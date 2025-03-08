import random
from faker import Faker
from app import app, db, Lecturer, Room, Course, TimeSlot

# Initialize Faker for realistic names
fake = Faker()

with app.app_context():  # <<<< FIXED: This ensures the app context is active
    # --- STEP 1: CREATE 10 LECTURERS ---
    departments = ["Physics", "Mathematics", "Chemistry", "Biology", "Computer Science"]
    lecturers = [
        Lecturer(name=fake.name(), department=random.choice(departments))
        for _ in range(10)  # 10 lecturers
    ]

    db.session.bulk_save_objects(lecturers)
    db.session.commit()
    print("✅ 10 Lecturers Added")

    # Fetch lecturers from DB
    lecturer_list = Lecturer.query.all()

    # --- STEP 2: CREATE 10 ROOMS ---
    rooms = [
        Room(name=f"Lecture Hall {i}", capacity=random.randint(50, 200))
        for i in range(1, 11)  # 10 rooms
    ]

    db.session.bulk_save_objects(rooms)
    db.session.commit()
    print("✅ 10 Rooms Added")

    # --- STEP 3: CREATE 50 COURSES ---
    levels = [100, 200, 300, 400, 500]
    courses = [
        Course(
            id=f"PHY{random.randint(600,900)}",
            name=f"Physics {random.choice(['Mechanics', 'Electromagnetism', 'Quantum', 'Thermodynamics', 'Optics'])}",
            level=random.choice(levels),
            num_students=random.randint(30, 150),
            lecturer_id=random.choice(lecturer_list).id
        )
        for _ in range(10)  # 50 courses
    ]

    db.session.bulk_save_objects(courses)
    db.session.commit()
    print("✅ 10 Courses Added")

    # Fetch courses from DB
    course_list = Course.query.all()

    # --- STEP 4: CREATE 100 TIME SLOTS ---
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

    time_slots = [
        TimeSlot(
            course_id=random.choice(course_list).id,
            day=random.choice(days),
            start_time=random.choice(times),
            end_time=random.choice(times)
        )
        for _ in range(10)  # 100 time slots
    ]

    db.session.bulk_save_objects(time_slots)
    db.session.commit()
    print("✅ 10 Time Slots Added")

print("🎉 DATABASE POPULATION COMPLETED SUCCESSFULLY!")
