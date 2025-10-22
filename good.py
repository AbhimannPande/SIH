# timetable_solver.py
import random
from ortools.sat.python import cp_model
from tabulate import tabulate

# Days & Times
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
times = ["10:00-11:00", "11:00-12:00", "12:00-01:00", "01:00-02:00",
         "02:00-03:00", "03:00-04:00", "04:00-05:00"]

# Subjects: (Course, Teacher, Room)
subjects = [
    ("CS-301", "Patel", "CR-101"),
    ("CS-302", "Rao", "CR-101"),
    ("CS-303", "Nath", "CR-101"),
    ("CS-304", "Iyer", "CR-101"),
    ("AS-301", "Sharma", "CR-101"),
    ("LIB-301", "Coordinator", "CR-101"),
    ("SPORT-301", "Coordinator", "LAB-002"),
]

# Extra sessions for free slots
extra_sessions = ["Free Study", "Remedial", "PPT", "Sports"]

# Build CP-SAT model
model = cp_model.CpModel()

# Decision vars
assign = {}
for d in range(len(days)):
    for t in range(len(times)):
        for s in range(len(subjects)):
            assign[(d, t, s)] = model.NewBoolVar(f"assign_{d}_{t}_{s}")

# Constraint: only one subject per slot
for d in range(len(days)):
    for t in range(len(times)):
        model.Add(sum(assign[(d, t, s)] for s in range(len(subjects))) <= 1)

# Constraint: no horizontal repetition (same teacher multiple times in a day)
teachers = set([sub[1] for sub in subjects])
for teacher in teachers:
    for d in range(len(days)):
        for t1 in range(len(times)):
            for t2 in range(t1 + 1, len(times)):
                for s1 in range(len(subjects)):
                    for s2 in range(len(subjects)):
                        if subjects[s1][1] == teacher and subjects[s2][1] == teacher:
                            model.Add(assign[(d, t1, s1)] + assign[(d, t2, s2)] <= 1)

# Constraint: reduce vertical repetition (avoid same subject at same slot across consecutive days)
for t in range(len(times)):
    for s in range(len(subjects)):
        for d in range(len(days) - 1):
            model.Add(assign[(d, t, s)] + assign[(d + 1, t, s)] <= 1)

# Objective: maximize classes
model.Maximize(sum(assign.values()))

# Solve
solver = cp_model.CpSolver()
status = solver.Solve(model)

# Display
if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
    print("🗓️  DISPLAYING OPTIMIZED SOLUTION")
    print("=" * 80)

    timetable = {day: {time: None for time in times} for day in days}

    for d, day in enumerate(days):
        for t, time in enumerate(times):
            filled = False
            for s, subj in enumerate(subjects):
                if solver.Value(assign[(d, t, s)]) == 1:
                    timetable[day][time] = f"{subj[0]} | {subj[1]} | {subj[2]}"
                    filled = True
                    break
            if not filled:
                timetable[day][time] = random.choice(extra_sessions)

    # Convert to table
    headers = ["Day"] + times
    table_data = []
    for day in days:
        row = [day] + [timetable[day][time] for time in times]
        table_data.append(row)

    print(tabulate(table_data, headers=headers, tablefmt="grid"))

else:
    print("❌ No feasible solution found.")
