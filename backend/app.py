from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

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

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([
        {'id': r.id, 'name': r.name, 'capacity': r.capacity}
        for r in rooms
    ])

@app.route('/api/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    return jsonify([
        {
            'id': c.id,
            'name': c.name,
            'level': c.level,
            'num_students': c.num_students,
            'lecturer': c.lecturer.name,
            'time_slots': [{'day': ts.day, 'start': ts.start_time, 'end': ts.end_time} for ts in c.time_slots]
        }
        for c in courses
    ])

@app.route('/api/timeslots', methods=['GET'])
def get_timeslots():
    timeslots = TimeSlot.query.all()
    return jsonify([
        {'course_id': ts.course_id, 'day': ts.day, 'start': ts.start_time, 'end': ts.end_time}
        for ts in timeslots
    ])

if __name__ == '__main__':
    app.run(debug=True)

