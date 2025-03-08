from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from scheduler import auto_schedule_courses 
from algoclass import Room as AlgoRoom, Course as AlgoCourse, TimeSlot as AlgoTimeSlot

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend interaction

# Database Configuration (Ensure the path is correct)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///unischedule.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---- DATABASE MODELS ---- #
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
    start_time = db.Column(db.String(5), nullable=False)  # HH:MM format
    end_time = db.Column(db.String(5), nullable=False)

# ---- API ROUTES ---- #
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to UniSchedul API'}), 200


# API Endpoints

# GET /api/lecturers
@app.route('/api/lecturers', methods=['GET'])
def get_lecturers():
    lecturers = Lecturer.query.all()
    return jsonify([
        {'id': l.id, 'name': l.name, 'department': l.department}
        for l in lecturers
    ])

# POST /api/lecturers
@app.route('/api/lecturers', methods=['POST'])
def add_lecturer():
    data = request.json
    new_lecturer = Lecturer(name=data['name'], department=data['department'])
    db.session.add(new_lecturer)
    db.session.commit()
    return jsonify({"message": "Lecturer added successfully"}), 201

# PUT /api/lecturers/<id>
@app.route('/api/lecturers/<int:id>', methods=['PUT'])
def update_lecturer(id):
    data = request.json
    lecturer = Lecturer.query.get(id)
    if lecturer:
        lecturer.name = data['name']
        lecturer.department = data['department']
        db.session.commit()
        return jsonify({"message": "Lecturer updated successfully"})
    return jsonify({"error": "Lecturer not found"}), 404

# DELETE /api/lecturers/<id>
@app.route('/api/lecturers/<int:id>', methods=['DELETE'])
def delete_lecturer(id):
    lecturer = Lecturer.query.get(id)
    if lecturer:
        db.session.delete(lecturer)
        db.session.commit()
        return jsonify({"message": "Lecturer deleted successfully"})
    return jsonify({"error": "Lecturer not found"}), 404

# --- API ROUTES FOR ROOM MANAGEMENT ---

# Fetch all rooms
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([{"id": r.id, "name": r.name, "capacity": r.capacity} for r in rooms])

# Add a new room
@app.route('/api/rooms', methods=['POST'])
def add_room():
    data = request.json
    new_room = Room(name=data['name'], capacity=data['capacity'])
    db.session.add(new_room)
    db.session.commit()
    return jsonify({"message": "Room added successfully!"}), 201

# Edit an existing room
@app.route('/api/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404
    
    data = request.json
    room.name = data['name']
    room.capacity = data['capacity']
    db.session.commit()
    return jsonify({"message": "Room updated successfully!"})

# Delete a room
@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    room = Room.query.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404
    
    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Room deleted successfully!"})


# --- API ROUTES FOR COURSE MANAGEMENT ---

# Fetch all courses
@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "level": c.level,
            "num_students": c.num_students,
            "lecturer_id": c.lecturer_id,
            "time_slots": [{"day": ts.day, "start_time": ts.start_time, "end_time": ts.end_time} for ts in c.time_slots]
        }
        for c in courses
    ])


# Add a new course
@app.route('/api/courses', methods=['POST'])
def add_course():
    data = request.json
    new_course = Course(
        id=data['id'], name=data['name'], level=data['level'], 
        num_students=data['num_students'], lecturer_id=data['lecturer_id']
    )
    db.session.add(new_course)
    
    for slot in data['time_slots']:  # Save time slots
        new_slot = TimeSlot(course_id=data['id'], day=slot['day'], start_time=slot['start_time'], end_time=slot['end_time'])
        db.session.add(new_slot)
    
    db.session.commit()
    return jsonify({"message": "Course added successfully!"}), 201

# Edit a course
@app.route('/api/courses/<string:course_id>', methods=['PUT'])
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    data = request.json
    course.name = data['name']
    course.level = data['level']
    course.num_students = data['num_students']
    course.lecturer_id = data['lecturer_id']

    # Update time slots
    TimeSlot.query.filter_by(course_id=course_id).delete()
    for slot in data['time_slots']:
        new_slot = TimeSlot(course_id=course_id, day=slot['day'], start_time=slot['start_time'], end_time=slot['end_time'])
        db.session.add(new_slot)
    
    db.session.commit()
    return jsonify({"message": "Course updated successfully!"})

# Delete a course
@app.route('/api/courses/<string:course_id>', methods=['DELETE'])
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "Course deleted successfully!"})


# --- API ROUTES FOR TIME SLOT MANAGEMENT ---

# Fetch all time slots
@app.route('/api/timeslots', methods=['GET'])
def get_time_slots():
    time_slots = TimeSlot.query.all()
    return jsonify([
        {
            "id": ts.id,
            "course_id": ts.course_id,
            "course_code": ts.course.id,  # Include course code
            "course_name": ts.course.name,  # Include course title
            "lecturer_name": ts.course.lecturer.name, 
            "day": ts.day,
            "start_time": ts.start_time,
            "end_time": ts.end_time
        }
        for ts in time_slots
    ])


# Add a new time slot
@app.route('/api/timeslots', methods=['POST'])
def add_time_slot():
    data = request.json
    course = Course.query.get(data['course_id'])
    
    if not course:
        return jsonify({"error": "Invalid Course ID"}), 400

    # Ensure no conflicts
    existing_slots = TimeSlot.query.filter_by(day=data['day']).all()
    for ts in existing_slots:
        if ts.start_time < data['end_time'] and data['start_time'] < ts.end_time:
            return jsonify({"error": "Time conflict detected!"}), 400

    new_time_slot = TimeSlot(
        course_id=data['course_id'],
        day=data['day'],
        start_time=data['start_time'],
        end_time=data['end_time']
    )
    db.session.add(new_time_slot)
    db.session.commit()
    return jsonify({"message": "Time slot added successfully!"}), 201

# Edit a time slot
@app.route('/api/timeslots/<int:timeslot_id>', methods=['PUT'])
def update_time_slot(timeslot_id):
    time_slot = TimeSlot.query.get(timeslot_id)
    if not time_slot:
        return jsonify({"error": "Time slot not found"}), 404

    data = request.json
    time_slot.day = data['day']
    time_slot.start_time = data['start_time']
    time_slot.end_time = data['end_time']
    
    db.session.commit()
    return jsonify({"message": "Time slot updated successfully!"})

# Delete a time slot
@app.route('/api/timeslots/<int:timeslot_id>', methods=['DELETE'])
def delete_time_slot(timeslot_id):
    time_slot = TimeSlot.query.get(timeslot_id)
    if not time_slot:
        return jsonify({"error": "Time slot not found"}), 404

    db.session.delete(time_slot)
    db.session.commit()
    return jsonify({"message": "Time slot deleted successfully!"})

# --- API ROUTES FOR TIMETABLE MANAGEMENT ---
@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    """Fetch all scheduled courses organized by days."""
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    timetable = {day: [] for day in week_days}

    courses = Course.query.all()
    for course in courses:
        for slot in course.time_slots:
            timetable[slot.day].append({
                "course_code": course.id,
                "course_name": course.name,
                "lecturer": course.lecturer.name,
                "start_time": slot.start_time,
                "end_time": slot.end_time,
                "room": "N/A"  # We can enhance this if room allocation is added
            })

    return jsonify(timetable)


# API Algorithm 
@app.route('/api/run-algorithm', methods=['GET'])
def run_algorithm():
    """Fetches timetable data, runs the scheduling algorithm, and returns formatted results."""

    # Fetch all necessary data from the database
    rooms = Room.query.all()
    courses = Course.query.all()

    # Convert database data into algorithm-compatible format using `AlgoRoom`, `AlgoCourse`, `AlgoTimeSlot`
    room_list = [AlgoRoom(r.id, r.name, r.capacity) for r in rooms]
    course_list = [
        AlgoCourse(
            c.id, c.name, c.level, c.num_students,
            [AlgoTimeSlot(ts.day, ts.start_time, ts.end_time) for ts in c.time_slots],
            c.lecturer_id
        ) for c in courses
    ]

    # Run the scheduling algorithm
    bookings, failed_bookings = auto_schedule_courses(course_list, room_list)

    # Format results in a structured console-style output
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    formatted_result = ""

    # **Warnings for rescheduled courses**
    if any("moved to" in warning for warning in failed_bookings):
        formatted_result += "\n".join([f"⚠️ {warning}" for warning in failed_bookings if "moved to" in warning]) + "\n\n"

    formatted_result += "📅 **Final Room Schedule**\n\n"

    # **Organize bookings by day**
    bookings_by_day = {day: [] for day in week_days}
    for b in bookings:
        bookings_by_day[b.day].append(b)

    # **Sort and format bookings by time**
    for day in week_days:
        if bookings_by_day[day]:
            formatted_result += f"\n🗓 **{day}**\n" + "-" * 30 + "\n"
            sorted_bookings = sorted(bookings_by_day[day], key=lambda b: b.start_time)
            for b in sorted_bookings:
                formatted_result += (f"📌 {b.start_time} - {b.end_time}: {b.course.name} "
                                     f"by Lecturer {b.course.lecturer_id} "
                                     f"[{b.course.level} Level, Class Size: {b.course.num_students}] "
                                     f"-> {b.room.name} (Capacity: {b.room.capacity})\n")

    # **Failed bookings**
    failed_entries = [f"❌ {fail}" for fail in failed_bookings if "moved to" not in fail]
    if failed_entries:
        formatted_result += "\n🚨 **Failed Scheduling Attempts**\n" + "-" * 30 + "\n"
        formatted_result += "\n".join(failed_entries) + "\n"

    return jsonify({"console_output": formatted_result}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the database and tables exist
    app.run(debug=True)

