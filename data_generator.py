import random
import csv
import collections

# --- Configuration ---
STREAMS = ['CSE', 'AIDS', 'AIML', 'ECE', 'EE', 'ME', 'CE', 'IT', 'Biotech']
SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
SECTIONS_PER_STREAM = 20
MIN_SUBJECTS_PER_SEMESTER = 6
NUM_FACULTY_PER_DEPT = 15

NUM_CLASS_GROUPS = len(STREAMS) * SECTIONS_PER_STREAM
NUM_THEORY_ROOMS = NUM_CLASS_GROUPS + 5
NUM_LAB_ROOMS = 100
MAX_WEEKLY_HOURS = 36

FACULTY_FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Saanvi', 'Aanya', 'Aadhya', 'Kiara', 'Diya', 'Pari', 'Ananya', 'Riya', 'Fatima', 'Priya']
FACULTY_LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Khan', 'Joshi', 'Menon', 'Iyer', 'Nath', 'Mishra', 'Yadav', 'Pandey']
FACULTY_TITLES = ['Dr.', 'Prof.']
COURSE_PREFIXES = {'CSE': 'CS', 'AIDS': 'DS', 'AIML': 'AI', 'ECE': 'EC', 'EE': 'EE', 'ME': 'ME', 'CE': 'CE', 'IT': 'IT', 'Biotech': 'BT'}
COURSE_SUFFIXES = ['Fundamentals', 'Design', 'Systems', 'Analysis', 'Programming', 'Theory', 'Applications', 'Engineering', 'Structures', 'Dynamics', 'Principles']

def generate_conflict_free_data():
    print("🤖 Starting conflict-free generation of a large-scale synthetic dataset...")
    
    faculty = {}
    all_depts = STREAMS + ['Physics', 'Chemistry', 'Maths', 'Humanities']
    for dept in all_depts:
        for _ in range(NUM_FACULTY_PER_DEPT):
            name = f"{random.choice(FACULTY_TITLES)} {random.choice(FACULTY_FIRST_NAMES)} {random.choice(FACULTY_LAST_NAMES)}"
            if name not in faculty: faculty[name] = {'dept': dept}
    print(f"   -> Generated {len(faculty)} faculty members.")

    rooms = {}
    for i in range(NUM_THEORY_ROOMS): rooms[f'CR-{i+1:03}'] = {'type': 'theory', 'capacity': random.randint(50, 80)}
    for i in range(NUM_LAB_ROOMS): rooms[f'LAB-{i+1:03}'] = {'type': 'lab', 'capacity': random.randint(25, 40)}
    print(f"   -> Generated {len(rooms)} rooms.")
    
    courses = {}
    for sem_num, sem in enumerate(SEMESTERS, 1):
        for stream in STREAMS:
            for i in range(1, 13):
                prefix = COURSE_PREFIXES.get(stream, "GEN")
                course_code = f'{prefix}-{sem_num}0{i}'
                if course_code not in courses:
                    is_lab_associated = random.random() < 0.6
                    courses[course_code] = {'name': random.choice(COURSE_SUFFIXES), 'hours_per_week': random.randint(3, 4), 'dept': stream, 'is_lab': False}
                    if is_lab_associated: courses[f'{course_code}L'] = {'name': f"{courses[course_code]['name']} Lab", 'hours_per_week': 2, 'dept': stream, 'is_lab': True}
    print(f"   -> Generated {len(courses)} unique courses in the catalog.")
    
    stream_map = {}
    theory_rooms = [r for r, d in rooms.items() if d['type'] == 'theory']
    random.shuffle(theory_rooms)
    
    sections = [chr(ord('A') + i) for i in range(SECTIONS_PER_STREAM)]
    all_stream_sections = [f"{stream}-{section}" for stream in STREAMS for section in sections]

    if len(all_stream_sections) > len(theory_rooms):
        print(f"❌ ERROR: Not enough theory rooms for all class groups. Groups: {len(all_stream_sections)}, Rooms: {len(theory_rooms)}")
        return None

    faculty_workload = collections.defaultdict(int)
    
    for stream_section in all_stream_sections:
        room_name = theory_rooms.pop()
        stream = stream_section.split('-')[0]
        
        for sem_num, sem in enumerate(SEMESTERS, 1):
            stream_sem_key = f"{stream_section}_{sem}"
            prefix = COURSE_PREFIXES.get(stream)
            relevant_courses_pool = [c for c, v in courses.items() if v.get('dept') == stream and c.startswith(f'{prefix}-{sem_num}0') and not v.get('is_lab')]
            random.shuffle(relevant_courses_pool)
            relevant_faculty = [f for f, d in faculty.items() if d.get('dept') == stream]
            if not relevant_faculty: relevant_faculty = list(faculty.keys())

            assigned_courses, num_assigned, current_curriculum_hours = [], 0, 0
            
            while num_assigned < MIN_SUBJECTS_PER_SEMESTER and relevant_courses_pool:
                course_code = relevant_courses_pool.pop()
                course_hours = courses[course_code]['hours_per_week']
                available_faculty = [f for f in relevant_faculty if faculty_workload[f] + course_hours <= MAX_WEEKLY_HOURS]
                if not available_faculty or current_curriculum_hours + course_hours > MAX_WEEKLY_HOURS: continue

                assigned_faculty = random.choice(available_faculty)
                assigned_courses.append((course_code, assigned_faculty))
                faculty_workload[assigned_faculty] += course_hours
                current_curriculum_hours += course_hours
                num_assigned += 1
                
                lab_code = f'{course_code}L'
                if lab_code in courses and num_assigned < MIN_SUBJECTS_PER_SEMESTER:
                    lab_hours = courses[lab_code]['hours_per_week']
                    available_faculty_lab = [f for f in relevant_faculty if faculty_workload[f] + lab_hours <= MAX_WEEKLY_HOURS]
                    if not available_faculty_lab or current_curriculum_hours + lab_hours > MAX_WEEKLY_HOURS: continue

                    assigned_faculty_lab = random.choice(available_faculty_lab)
                    assigned_courses.append((lab_code, assigned_faculty_lab))
                    faculty_workload[assigned_faculty_lab] += lab_hours
                    current_curriculum_hours += lab_hours
                    num_assigned += 1
            
            stream_map[stream_sem_key] = {'room': room_name, 'courses': assigned_courses}
            
    print(f"   -> Generated course mappings for {len(stream_map)} groups with conflict prevention.")
    return {'rooms': rooms, 'faculty': faculty, 'courses': courses, 'stream_map': stream_map}

def save_data_to_single_csv(data, filename="master_timetable_dataset.csv"):
    if data is None: return
    print(f"\nWriting all data to a single CSV file: {filename}...")
    
    header = ['stream_semester_group', 'stream', 'section', 'semester', 'dedicated_room', 'room_type', 'room_capacity', 'course_code', 'course_name', 'course_hours_per_week', 'course_department', 'is_lab', 'faculty_name', 'faculty_department']
    total_rows = 0
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            
            for stream_sem_key, details in data['stream_map'].items():
                stream_section, sem_str = stream_sem_key.rsplit('_', 1)
                stream, section = stream_section.split('-')
                
                # --- CORRECTED CODE BLOCK ---
                # FIX: Define room_name first, then use it to get room_info.
                room_name = details['room']
                room_info = data['rooms'].get(room_name, {})

                for course_code, faculty_name in details['courses']:
                    course_info, faculty_info = data['courses'].get(course_code, {}), data['faculty'].get(faculty_name, {})
                    writer.writerow([stream_sem_key, stream, section, sem_str, room_name, room_info.get('type', 'N/A'), room_info.get('capacity', 'N/A'), course_code, course_info.get('name', 'N/A'), course_info.get('hours_per_week', 'N/A'), course_info.get('dept', 'N/A'), course_info.get('is_lab', False), faculty_name, faculty_info.get('dept', 'N/A')])
                    total_rows += 1
        
        print("\n" + "="*50 + f"\n✅ Success! Conflict-free dataset with {total_rows} rows saved to '{filename}'\n" + "="*50)

    except Exception as e:
        print(f"\nError: Could not write to CSV file. {e}")


if __name__ == '__main__':
    synthetic_data = generate_conflict_free_data()
    save_data_to_single_csv(synthetic_data)