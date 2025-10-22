import pandas as pd
import random
from ortools.sat.python import cp_model
from catboost import CatBoostClassifier, Pool
from sklearn.preprocessing import LabelEncoder
import numpy as np
import time

# ===============================
# 1. LOAD DATASET
# ===============================
dataset_path = r"C:\Users\Asus\OneDrive\Desktop\New folder (2)\master_timetable_dataset.csv"
df = pd.read_csv(dataset_path)

# Preprocessing
df.fillna('NA', inplace=True)

# Build mappings
streams = df['stream'].unique()
semesters = df['semester'].unique()
courses = {}
faculty = {}
rooms = {}

for idx, row in df.iterrows():
    ccode = row['course_code']
    courses[ccode] = {
        'name': row['course_name'],
        'hours': row['course_hours_per_week'],
        'dept': row['course_department'],
        'is_lab': row['is_lab']
    }
    faculty[row['faculty_name']] = {'dept': row['faculty_department']}
    rooms[row['dedicated_room']] = {
        'type': row['room_type'],
        'capacity': row['room_capacity']
    }

# Build stream map
stream_map = {}
for idx, row in df.iterrows():
    key = f"{row['stream']}-Sem{row['semester']}"
    if key not in stream_map:
        stream_map[key] = {'room': row['dedicated_room'], 'courses': []}
    stream_map[key]['courses'].append((row['course_code'], row['faculty_name']))

print("✅ Stream map, courses, faculty, and rooms built successfully!")

# ===============================
# 2. TRAIN CATBOOST MODEL
# ===============================
def train_catboost(stream_map, courses):
    rows = []
    for ss, details in stream_map.items():
        for ccode, fname in details['courses']:
            rows.append({'stream_sem': ss, 'course': ccode, 'dept': courses[ccode]['dept']})

    df_train = pd.DataFrame(rows)
    DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    TIMESLOTS = ['10:00-11:00','11:00-12:00','12:00-01:00','02:00-03:00','03:00-04:00','04:00-05:00']
    df_train['slot'] = [f"{random.choice(DAYS)}_{random.choice(TIMESLOTS)}" for _ in range(len(df_train))]

    encoders = {}
    for col in ['stream_sem','course','dept','slot']:
        le = LabelEncoder()
        df_train[col] = le.fit_transform(df_train[col])
        encoders[col] = le

    X = df_train[['stream_sem','course','dept']]
    y = df_train['slot']

    model = CatBoostClassifier(verbose=0, iterations=50, random_seed=42)
    model.fit(X, y)
    return model, encoders, DAYS, TIMESLOTS

cat_model, encoders, DAYS, TIMESLOTS = train_catboost(stream_map, courses)
print("🧠 CatBoost model trained successfully!")

# ===============================
# 3. GA INDIVIDUAL AND FITNESS
# ===============================
def generate_random_timetable(stream_map):
    timetable = {}
    for ss, details in stream_map.items():
        timetable[ss] = pd.DataFrame(index=DAYS, columns=TIMESLOTS)
        timetable[ss].iloc[:, 3] = 'LUNCH'  # lunch slot
        for day in DAYS:
            fillers = ['Free Study','PPT','Sports','Remedial']
            filler_used = False
            for ts in TIMESLOTS:
                if ts == '01:00-02:00': continue  # skip lunch
                if not filler_used and random.random() < 0.1:
                    timetable[ss].loc[day, ts] = random.choice(fillers)
                    filler_used = True
                else:
                    course, fac = random.choice(details['courses'])
                    timetable[ss].loc[day, ts] = f"{course} | {fac} | {details['room']}"
    return timetable

def fitness(timetable):
    score = 0
    for ss, df_tt in timetable.items():
        # Maximize filled slots
        score += df_tt.notna().sum().sum()
        # Minimize repeated theory classes for same faculty
        for fac in faculty.keys():
            count = sum(df_tt.apply(lambda row: row.str.contains(fac) if row.notna().any() else False).sum())
            score -= max(0, count-1)*5  # penalty for repeats
        # Minimize fillers (>1 per day)
        for day in DAYS:
            fillers_today = sum(df_tt.loc[day].isin(['Free Study','PPT','Sports','Remedial']))
            if fillers_today > 1:
                score -= (fillers_today-1)*3
    return score

# ===============================
# 4. CP-SAT HARD CONSTRAINT CHECK
# ===============================
def cp_sat_check(timetable, stream_map):
    model = cp_model.CpModel()
    all_vars = {}
    for ss, df_tt in timetable.items():
        for i, day in enumerate(DAYS):
            for j, ts in enumerate(TIMESLOTS):
                val = df_tt.loc[day, ts]
                if pd.isna(val) or val=='LUNCH' or val in ['Free Study','PPT','Sports','Remedial']: 
                    continue
                key = f"{ss}_{day}_{ts}_{val}"
                all_vars[key] = model.NewBoolVar(key)
    
    # No same faculty at same slot
    for fac in faculty.keys():
        for day in DAYS:
            for ts in TIMESLOTS:
                vars_in_slot = [v for k,v in all_vars.items() if fac in k and day in k and ts in k]
                if vars_in_slot:
                    model.Add(sum(vars_in_slot) <= 1)
    
    # Solve
    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    return status in [cp_model.OPTIMAL, cp_model.FEASIBLE]

# ===============================
# 5. GA LOOP
# ===============================
POPULATION_SIZE = 5
GENERATIONS = 20

population = [generate_random_timetable(stream_map) for _ in range(POPULATION_SIZE)]

for gen in range(GENERATIONS):
    scored = [(fitness(ind), ind) for ind in population]
    scored.sort(reverse=True, key=lambda x:x[0])
    best_score, best_ind = scored[0]
    print(f"Generation {gen} Best Fitness: {best_score}")

    # Crossover: take top 2 and swap days
    p1, p2 = scored[0][1], scored[1][1]
    child = {}
    for ss in p1.keys():
        df1, df2 = p1[ss], p2[ss]
        new_df = df1.copy()
        for day in DAYS:
            if random.random() < 0.5:
                new_df.loc[day] = df2.loc[day]
        child[ss] = new_df
    # Mutation
    for ss in child.keys():
        if random.random() < 0.3:
            day = random.choice(DAYS)
            ts = random.choice(TIMESLOTS)
            if ts != '01:00-02:00':
                course, fac = random.choice(stream_map[ss]['courses'])
                child[ss].loc[day, ts] = f"{course} | {fac} | {stream_map[ss]['room']}"
    if cp_sat_check(child, stream_map):
        population.append(child)
    if len(population) > POPULATION_SIZE:
        population = population[:POPULATION_SIZE]

# ===============================
# 6. DISPLAY BEST TIMETABLE
# ===============================
final_tt = population[0]
for ss, df_tt in final_tt.items():
    print(f"\n🗓️  Timetable for {ss}")
    print(df_tt.fillna('---').to_string())
