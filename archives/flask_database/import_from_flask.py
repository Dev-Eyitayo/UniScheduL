import sqlite3
import django
import os

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "unischedule_django.settings")
django.setup()

from core.models import Lecturer, Room, Course, TimeSlot

# Connect to the Flask database
conn = sqlite3.connect("flask_database/unischedule.db")
cursor = conn.cursor()

# ---- LECTURERS ----
cursor.execute("SELECT id, name, department FROM lecturer")
for row in cursor.fetchall():
    Lecturer.objects.get_or_create(id=row[0], name=row[1], department=row[2])

# ---- ROOMS ----
cursor.execute("SELECT id, name, capacity FROM room")
for row in cursor.fetchall():
    Room.objects.get_or_create(id=row[0], name=row[1], capacity=row[2])

# ---- COURSES ----
cursor.execute("SELECT id, name, level, num_students, lecturer_id FROM course")
for row in cursor.fetchall():
    Course.objects.get_or_create(
        id=row[0],
        name=row[1],
        level=row[2],
        num_students=row[3],
        lecturer_id=row[4],
    )

# ---- TIMESLOTS ----
cursor.execute("SELECT id, course_id, day, start_time, end_time FROM time_slot")
for row in cursor.fetchall():
    TimeSlot.objects.get_or_create(
        id=row[0],
        course_id=row[1],
        day=row[2],
        start_time=row[3],
        end_time=row[4],
    )

conn.close()
print("✅ Import complete.")
