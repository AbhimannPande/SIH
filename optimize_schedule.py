import pandas as pd
import collections
from ortools.sat.python import cp_model
import time
import sys

# ==============================================================================
# 0. SCRIPT CONFIGURATION
# ==============================================================================
DATA_FILE = 'timetable_data.csv'
SEMESTER_TO_SCHEDULE = 'III'

# --- Soft Constraint (Preference) Scoring ---
FILLED_SLOT_REWARD = 100
GAP_PENALTY = 30
DAY_UNDERLOAD_PENALTY = 50
MIN_HOURS_PER_DAY = 3
FACULTY_CONSECUTIVE_PENALTY = 80 
MAX_CONSECUTIVE_FACULTY_HOURS = 2
# NEW: Penalty for scheduling the same subject multiple times on the same day
SUBJECT_REPETITION_PENALTY = 75

# --- Solver Controls ---
SOLVER_TIME_LIMIT_SECONDS = 180

# ==============================================================================
# 1. DATA LOADING FUNCTION
# ==============================================================================
def load_data_from_csv(filename, semester_filter):
    print(f"🔄 Loading data from '{filename}'...")
    try:
        df = pd.read_csv(filename)
    except FileNotFoundError:
        print(f"❌ ERROR: Data file '{filename}' not found. Please run the data generation script first.")
        sys.exit(1)

    print(f"   -> Filtering for Semester: '{semester_filter}'")
    df = df[df['semester'] == semester_filter].copy()
    if df.empty:
        print(f"❌ ERROR: No data found for semester '{semester_filter}'.")
        sys.exit(1)

    courses, faculty, rooms, stream_map = {}, {}, {}, collections.defaultdict(lambda: {'room': '', 'courses': []})
    for _, row in df.iterrows():
        courses[row['course_code']] = {'name': row['course_name'], 'hours_per_week': int(row['course_hours_per_week']), 'dept': row['course_department'], 'is_lab': bool(row['is_lab'])}
        faculty[row['faculty_name']] = {'dept': row['faculty_department']}
        if pd.notna(row['dedicated_room']) and row['dedicated_room'] != 'NA':
            rooms[row['dedicated_room']] = {'type': row['room_type'], 'capacity': int(row['room_capacity'])}
        stream_map[row['stream_semester_group']]['room'] = row['dedicated_room']
        stream_map[row['stream_semester_group']]['courses'].append((row['course_code'], row['faculty_name']))
        
    print(f"   -> Successfully loaded {len(stream_map)} class groups for this semester.")
    return dict(stream_map), courses, faculty, rooms

# ==============================================================================
# 2. MAIN TIMETABLE OPTIMIZER FUNCTION
# ==============================================================================
def generate_master_timetable(stream_map, courses, faculty, rooms):
    model = cp_model.CpModel()
    
    DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    TIMESLOTS = ['10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-02:00', '02:00-03:00', '03:00-04:00', '04:00-05:00']
    LUNCH_SLOT_INDEX = 3
    lab_rooms = [r for r, d in rooms.items() if d['type'] == 'lab']
    if not lab_rooms: 
        lab_rooms = ['LAB-001']
        rooms['LAB-001'] = {'type': 'lab', 'capacity': 30}
    
    assignments = {}
    for stream_sem, details in stream_map.items():
        home_room = details.get('room')
        for course_code, faculty_name in details['courses']:
            course_info = courses.get(course_code, {})
            is_lab = course_info.get('is_lab', False)
            duration = 2 if is_lab else 1
            possible_rooms = lab_rooms if is_lab else [home_room]
            
            for room_name in possible_rooms:
                if pd.isna(room_name) or room_name == 'NA': room_name = f"Activity_{course_code}"
                for day_idx in range(len(DAYS)):
                    for ts_idx in range(len(TIMESLOTS) - duration + 1):
                        if ts_idx == LUNCH_SLOT_INDEX or (duration == 2 and ts_idx + 1 == LUNCH_SLOT_INDEX): continue
                        key = (stream_sem, day_idx, ts_idx, course_code, faculty_name, room_name)
                        assignments[key] = model.NewBoolVar(str(key))

    # --- Hard Constraints ---
    for stream_sem, details in stream_map.items():
        for course_code, _ in details['courses']:
            course_info = courses.get(course_code, {})
            duration = 2 if course_info.get('is_lab', False) else 1
            possible_slots = [var for (ss, d, t, c, f, r), var in assignments.items() if ss == stream_sem and c == course_code]
            if course_info.get('hours_per_week'): model.Add(sum(possible_slots) * duration == course_info['hours_per_week'])

    all_stream_sems, all_faculty, all_rooms = stream_map.keys(), faculty.keys(), rooms.keys()
    for entity_list, get_entity_func in [(all_stream_sems, lambda k: k[0]), (all_faculty, lambda k: k[4]), (all_rooms, lambda k: k[5])]:
        for entity_name in entity_list:
            for day_idx in range(len(DAYS)):
                for ts_idx in range(len(TIMESLOTS)):
                    model.Add(sum(var for key, var in assignments.items() if get_entity_func(key) == entity_name and key[1] == day_idx and key[2] <= ts_idx < key[2] + (2 if courses.get(key[3], {}).get('is_lab') else 1)) <= 1)

    # --- Soft Constraints ---
    total_score = []
    for stream_sem in all_stream_sems:
        all_courses_for_stream = list(set(c[0] for c in stream_map[stream_sem]['courses']))
        for day_idx in range(len(DAYS)):
            daily_slots_busy = []
            for ts_idx in range(len(TIMESLOTS)):
                if ts_idx == LUNCH_SLOT_INDEX: continue
                is_busy = model.NewBoolVar(f'ss_busy_{stream_sem}_{day_idx}_{ts_idx}')
                active_in_slot = [var for (ss, d, t, c, f, r), var in assignments.items() if ss == stream_sem and d == day_idx and t <= ts_idx < t + (2 if courses.get(c, {}).get('is_lab') else 1)]
                model.Add(sum(active_in_slot) >= 1).OnlyEnforceIf(is_busy)
                model.Add(sum(active_in_slot) == 0).OnlyEnforceIf(is_busy.Not())
                daily_slots_busy.append(is_busy)
                total_score.append(is_busy * FILLED_SLOT_REWARD)
            
            daily_hours_sum = sum(daily_slots_busy)
            for i in range(len(daily_slots_busy) - 2):
                is_gap = model.NewBoolVar(f'gap_{stream_sem}_{day_idx}_{i}')
                model.AddBoolAnd([daily_slots_busy[i], daily_slots_busy[i+1].Not(), daily_slots_busy[i+2]]).OnlyEnforceIf(is_gap)
                total_score.append(-is_gap * GAP_PENALTY)
            
            is_underloaded = model.NewBoolVar(f'underload_{stream_sem}_{day_idx}')
            model.Add(daily_hours_sum > 0).OnlyEnforceIf(is_underloaded)
            model.Add(daily_hours_sum < MIN_HOURS_PER_DAY).OnlyEnforceIf(is_underloaded)
            total_score.append(-is_underloaded * DAY_UNDERLOAD_PENALTY)
            
            # --- NEW: Penalty for scheduling the same subject multiple times on the same day ---
            for course in all_courses_for_stream:
                if courses[course].get('is_lab'): continue 
                
                times_scheduled_today = model.NewIntVar(0, 5, f'count_{stream_sem}_{day_idx}_{course}')
                model.Add(times_scheduled_today == sum(var for (ss, d, t, c, f, r), var in assignments.items() if ss == stream_sem and d == day_idx and c == course))
                
                # Penalize if it's scheduled more than once (the excess count)
                # This penalizes the 2nd, 3rd, etc. occurrence of the subject on the same day.
                repetition_count = model.NewIntVar(0, 4, f'rep_{stream_sem}_{day_idx}_{course}')
                model.Add(repetition_count >= times_scheduled_today - 1)
                model.Add(repetition_count >= 0)
                total_score.append(-repetition_count * SUBJECT_REPETITION_PENALTY)

    for fac in all_faculty:
        for day_idx in range(len(DAYS)):
            faculty_schedule = []
            for ts_idx in range(len(TIMESLOTS)):
                if ts_idx == LUNCH_SLOT_INDEX: faculty_schedule.append(model.NewConstant(0)); continue
                is_fac_busy = model.NewBoolVar(f'fac_busy_{fac}_{day_idx}_{ts_idx}')
                active_in_slot = [var for (ss, d, t, c, f, r), var in assignments.items() if f == fac and d == day_idx and t <= ts_idx < t + (2 if courses.get(c, {}).get('is_lab') else 1)]
                model.Add(sum(active_in_slot) >= 1).OnlyEnforceIf(is_fac_busy)
                model.Add(sum(active_in_slot) == 0).OnlyEnforceIf(is_fac_busy.Not())
                faculty_schedule.append(is_fac_busy)
            
            window_size = MAX_CONSECUTIVE_FACULTY_HOURS + 1
            for i in range(len(faculty_schedule) - window_size + 1):
                if i <= LUNCH_SLOT_INDEX < i + window_size: continue
                is_overloaded = model.NewBoolVar(f'consecutive_{fac.replace(" ", "")}_{day_idx}_{i}')
                model.AddBoolAnd(faculty_schedule[i : i + window_size]).OnlyEnforceIf(is_overloaded)
                total_score.append(-is_overloaded * FACULTY_CONSECUTIVE_PENALTY)

    model.Maximize(sum(total_score))

    # --- Solve and Display ---
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = SOLVER_TIME_LIMIT_SECONDS
    print(f"\n🧠 Starting timetable optimization for Semester '{SEMESTER_TO_SCHEDULE}'...")
    start_time = time.time()
    status = solver.Solve(model)
    end_time = time.time()
    
    print(f"\n✅ Search complete in {end_time - start_time:.2f} seconds. Solver status: {solver.StatusName(status)}")
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print("\n" + "="*80 + f"\n🗓️  DISPLAYING OPTIMIZED SOLUTION (Highest Score: {solver.ObjectiveValue()})\n" + "="*80)
        for stream_sem in sorted(list(stream_map.keys())):
            df = pd.DataFrame(index=DAYS, columns=TIMESLOTS).fillna("--")
            df.iloc[:, LUNCH_SLOT_INDEX] = "LUNCH"
            for (ss, d, t, c, f, r), var in assignments.items():
                if ss == stream_sem and solver.Value(var):
                    entry = f"{c}\n{f.split(' ')[-1]}\n{r}"
                    for j in range(2 if courses.get(c, {}).get('is_lab', False) else 1):
                        if t + j < len(TIMESLOTS): df.iloc[d, t + j] = entry
            print(f"\n--- Timetable for: {stream_sem} ---\n{df.to_string()}")
    else:
        print("\nCould not find a feasible solution.")

if __name__ == '__main__':
    stream_map, courses, faculty, rooms = load_data_from_csv(DATA_FILE, SEMESTER_TO_SCHEDULE)
    generate_master_timetable(stream_map, courses, faculty, rooms)