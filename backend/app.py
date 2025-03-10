import io
from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
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


# API Algorithm Endpoint
@app.route('/api/run-algorithm', methods=['GET'])
def run_algorithm():
    """Fetches timetable data, runs the scheduling algorithm, and returns results"""
    
    # Fetch all necessary data from the database
    rooms = Room.query.all()
    courses = Course.query.all()

    # Convert data into algorithm-readable format
    room_list = [AlgoRoom(r.id, r.name, r.capacity) for r in rooms]
    course_list = [
        AlgoCourse(
            c.id, 
            c.name, 
            c.level, 
            c.num_students, 
            [AlgoTimeSlot(ts.day, ts.start_time, ts.end_time) for ts in c.time_slots], 
            c.lecturer_id
        ) for c in courses
    ]

    # Initialize logs
    logs = []  # ✅ Add this so logs can be recorded properly

    # Run the scheduling algorithm with all required arguments
    bookings, failed_bookings = auto_schedule_courses(course_list, room_list, logs)

    # Fetch lecturer names for lookup
    lecturer_lookup = {lec.id: lec.name for lec in Lecturer.query.all()}  # ✅ Create a mapping of lecturer ID -> Name

    # Format results for JSON response
    result = {
        "bookings": [  # ✅ Scheduled timetable data
            {
                "course_id": b.course.course_id,
                "course_name": b.course.name,
                "lecturer": lecturer_lookup.get(b.course.lecturer_id, "Unknown Lecturer"),  # ✅ Get lecturer name
                "room": b.room.name,
                "day": b.day,
                "start_time": b.start_time,
                "end_time": b.end_time
            }
            for b in bookings
        ],
        "failed_bookings": failed_bookings,  # ✅ Failed scheduling attempts
        "logs": logs  # ✅ Include logs in the response
    }

    return jsonify(result), 200

# Function to structure the schedule like OptimizedSchedule.jsx
def format_schedule_for_pdf(bookings, failed_bookings):
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    # Sort bookings first by day, then by time
    sorted_bookings = sorted(bookings, key=lambda x: (week_days.index(x["day"]), x["start_time"]))

    # Organize bookings by day
    schedule_by_day = {day: [] for day in week_days}
    for booking in sorted_bookings:
        schedule_by_day[booking["day"]].append(
            f"🔹 {booking['start_time']} - {booking['end_time']}: {booking['course_name']} "
            f"in {booking['room']} by Lecturer {booking.get('lecturer', 'Unknown')}"
        )

    # Organize failed bookings
    formatted_failed_bookings = [f"❌ {failure}" for failure in failed_bookings]

    return schedule_by_day, formatted_failed_bookings


@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    semester = data.get("semester", "Unknown Semester")
    academic_year = data.get("academic_year", "Unknown Year")
    department = data.get("department", "Unknown Department")
    bookings = data.get("schedule", [])
    failed_bookings = data.get("failed_bookings", [])

    # Format the schedule properly
    schedule_by_day, formatted_failed_bookings = format_schedule_for_pdf(bookings, failed_bookings)

    # Create PDF
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", style='B', size=16)
    pdf.cell(200, 10, f"{department} - {semester} ({academic_year})", ln=True, align='L')
    pdf.ln(5)
    
    # Final Room Schedule Section
    pdf.set_font("Arial", style='B', size=12)
    pdf.cell(200, 10, "📅 Final Room Schedule:", ln=True)
    pdf.ln(3)
    
    pdf.set_font("Arial", size=10)
    for day in schedule_by_day:
        if schedule_by_day[day]:
            pdf.set_font("Arial", style='B', size=11)
            pdf.cell(200, 8, f"📌 {day}", ln=True)
            pdf.set_font("Arial", size=10)
            for entry in schedule_by_day[day]:
                pdf.cell(200, 7, entry, ln=True)
            pdf.ln(3)

    # Failed Scheduling Attempts Section
    if formatted_failed_bookings:
        pdf.set_font("Arial", style='B', size=12)
        pdf.cell(200, 10, "🚨 Failed Scheduling Attempts:", ln=True)
        pdf.ln(3)
        pdf.set_font("Arial", size=10)
        for failure in formatted_failed_bookings:
            pdf.cell(200, 7, failure, ln=True)
    
    # Save PDF
    pdf_output_path = "generated_schedule.pdf"
    pdf.output(pdf_output_path)

    return send_file(pdf_output_path, as_attachment=True)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the database and tables exist
    app.run(debug=True)

