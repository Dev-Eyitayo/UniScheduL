from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///unischedule.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---- MODELS ---- #
class Lecturer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    courses = db.relationship('Course', backref='lecturer', lazy=True)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

class Course(db.Model):
    id = db.Column(db.String(10), primary_key=True)  # Course Code
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    num_students = db.Column(db.Integer, nullable=False)
    lecturer_id = db.Column(db.Integer, db.ForeignKey('lecturer.id'), nullable=False)
    time_slots = db.relationship('TimeSlot', backref='course', lazy=True)

class TimeSlot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(10), db.ForeignKey('course.id'), nullable=False)
    day = db.Column(db.String(10), nullable=False)
    start_time = db.Column(db.String(5), nullable=False)
    end_time = db.Column(db.String(5), nullable=False)

# ---- DATABASE CREATION & SEEDING ---- #
def seed_database():
    db.create_all()

    # Lecturers (Physics & Computer Science)
    lecturers = [
        Lecturer(id=1, name='Dr. John Doe', department='Physics'),
        Lecturer(id=2, name='Dr. Jane Smith', department='Physics'),
        Lecturer(id=3, name='Dr. Alice Johnson', department='Physics'),
        Lecturer(id=4, name='Dr. Robert Brown', department='Physics'),
        Lecturer(id=5, name='Dr. Emily Davis', department='Physics'),
        Lecturer(id=6, name='Dr. Michael White', department='Physics'),
        Lecturer(id=7, name='Dr. Sarah Lee', department='Physics'),
        Lecturer(id=8, name='Dr. Kevin Martinez', department='Physics'),
        Lecturer(id=9, name='Dr. Olivia Wilson', department='Physics'),
        Lecturer(id=10, name='Dr. Daniel Thomas', department='Physics'),

        # Computer Science Lecturers
        Lecturer(id=11, name='Dr. Richard Green', department='Computer Science'),
        Lecturer(id=12, name='Dr. Rachel Adams', department='Computer Science'),
        Lecturer(id=13, name='Dr. Thomas Black', department='Computer Science'),
        Lecturer(id=14, name='Dr. Chris Brown', department='Computer Science'),
        Lecturer(id=15, name='Dr. Sophia Miller', department='Computer Science'),
    ]
    db.session.bulk_save_objects(lecturers)

    # Rooms (Existing)
    rooms = [
        Room(id=1, name='Physics Lab 1', capacity=80),
        Room(id=2, name='Physics Lab 2', capacity=100),
        Room(id=3, name='Lecture Hall A', capacity=150),
        Room(id=4, name='Lecture Hall B', capacity=200),
        Room(id=5, name='Physics Seminar Room', capacity=50),
        Room(id=6, name='General Lecture Hall', capacity=200),
        Room(id=7, name='Research Lab', capacity=70),
        Room(id=8, name='Advanced Physics Lab', capacity=90),
        Room(id=9, name='Main Auditorium', capacity=300),
        Room(id=10, name='Extension Lecture Hall', capacity=120),
        Room(id=11, name='Specialized Quantum Lab', capacity=60),
        Room(id=12, name='Advanced Optics Lab', capacity=90),
    ]
    db.session.bulk_save_objects(rooms)

    # Courses (Physics & Computer Science)
    courses = [
        # Physics Courses
        Course(id='PHY101', name='Mechanics', level=100, num_students=120, lecturer_id=1),
        Course(id='PHY102', name='Waves & Optics', level=100, num_students=100, lecturer_id=2),
        Course(id='PHY201', name='Electromagnetic Fields', level=200, num_students=200, lecturer_id=4),
        Course(id='PHY301', name='Classical Mechanics II', level=300, num_students=240, lecturer_id=2),
        Course(id='PHY302', name='Advanced Nuclear Physics', level=300, num_students=150, lecturer_id=3),

        # Computer Science Courses
        Course(id='CSC101', name='Introduction to Computer Science', level=100, num_students=150, lecturer_id=11),
        Course(id='CSC102', name='Data Structures', level=100, num_students=130, lecturer_id=12),
        Course(id='CSC201', name='Algorithms', level=200, num_students=200, lecturer_id=13),
        Course(id='CSC202', name='Operating Systems', level=200, num_students=180, lecturer_id=11),
        Course(id='CSC301', name='Database Management Systems', level=300, num_students=220, lecturer_id=12),
    ]
    db.session.bulk_save_objects(courses)

    # Time Slots (Arranged Manually for MAXIMUM Conflict)
    time_slots = [
        # MONDAY
        TimeSlot(course_id='PHY101', day='Monday', start_time='08:00', end_time='10:00'),
        TimeSlot(course_id='CSC101', day='Monday', start_time='08:00', end_time='10:00'),  # Conflict
        TimeSlot(course_id='PHY102', day='Monday', start_time='10:00', end_time='12:00'),
        TimeSlot(course_id='CSC201', day='Monday', start_time='10:00', end_time='12:00'),  # Conflict

        # TUESDAY
        TimeSlot(course_id='PHY201', day='Tuesday', start_time='08:00', end_time='10:00'),
        TimeSlot(course_id='CSC301', day='Tuesday', start_time='08:00', end_time='10:00'),  # Conflict
        TimeSlot(course_id='PHY301', day='Tuesday', start_time='12:00', end_time='14:00'),
        TimeSlot(course_id='CSC102', day='Tuesday', start_time='12:00', end_time='14:00'),  # Conflict

        # WEDNESDAY
        TimeSlot(course_id='PHY302', day='Wednesday', start_time='08:00', end_time='10:00'),
        TimeSlot(course_id='CSC202', day='Wednesday', start_time='08:00', end_time='10:00'),  # Conflict
        TimeSlot(course_id='PHY101', day='Wednesday', start_time='10:00', end_time='12:00'),
        TimeSlot(course_id='CSC301', day='Wednesday', start_time='10:00', end_time='12:00'),  # Conflict

        # THURSDAY
        TimeSlot(course_id='PHY102', day='Thursday', start_time='08:00', end_time='10:00'),
        TimeSlot(course_id='CSC102', day='Thursday', start_time='08:00', end_time='10:00'),  # Conflict
        TimeSlot(course_id='PHY201', day='Thursday', start_time='10:00', end_time='12:00'),
        TimeSlot(course_id='CSC202', day='Thursday', start_time='10:00', end_time='12:00'),  # Conflict

        # FRIDAY
        TimeSlot(course_id='PHY301', day='Friday', start_time='08:00', end_time='10:00'),
        TimeSlot(course_id='CSC201', day='Friday', start_time='08:00', end_time='10:00'),  # Conflict
        TimeSlot(course_id='PHY302', day='Friday', start_time='10:00', end_time='12:00'),
        TimeSlot(course_id='CSC301', day='Friday', start_time='10:00', end_time='12:00'),  # Conflict
    ]
    db.session.bulk_save_objects(time_slots)

    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        seed_database()
        print("Database seeded successfully!")
