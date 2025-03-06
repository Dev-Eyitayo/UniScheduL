from flask import Flask, jsonify, request
from flask_cors import CORS
from scheduler import auto_schedule_courses
from sample_data import rooms, courses_extreme

app = Flask(__name__)
CORS(app)  # Allow frontend to call the API

@app.route('/generate-schedule', methods=['POST'])
def generate_schedule():
    bookings, failed_bookings = auto_schedule_courses(courses_extreme, rooms)
    
    return jsonify({
        "bookings": [{"course": b.course.name, "day": b.day, "time": f"{b.start_time} - {b.end_time}", "room": b.room.name} for b in bookings],
        "failed_bookings": failed_bookings
    })

@app.route('/schedule', methods=['GET'])
def get_schedule():
    return jsonify({"message": "API is running. Use /generate-schedule to create a schedule."})

if __name__ == '__main__':
    app.run(debug=True)
