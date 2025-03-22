from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from .models import Lecturer, Room, Course, TimeSlot
from .serializers import LecturerSerializer, RoomSerializer, CourseSerializer, TimeSlotSerializer
from .scheduler import auto_schedule_courses
from .algoclass import Room as AlgoRoom, Course as AlgoCourse, TimeSlot as AlgoTimeSlot
from .export_utils import generate_pdf, generate_docx

# ----- LECTURERS -----
@api_view(['GET', 'POST'])
def lecturers_view(request):
    if request.method == 'GET':
        lecturers = Lecturer.objects.all()
        serializer = LecturerSerializer(lecturers, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = LecturerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Lecturer added successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def lecturer_detail(request, pk):
    try:
        lecturer = Lecturer.objects.get(pk=pk)
    except Lecturer.DoesNotExist:
        return Response({"error": "Lecturer not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = LecturerSerializer(lecturer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Lecturer updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        lecturer.delete()
        return Response({"message": "Lecturer deleted successfully"})


# ----- ROOMS -----
@api_view(['GET', 'POST'])
def rooms_view(request):
    if request.method == 'GET':
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Room added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def room_detail(request, pk):
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Room updated successfully!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        room.delete()
        return Response({"message": "Room deleted successfully!"})


# ----- COURSES -----
@api_view(['GET', 'POST'])
def courses_view(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Course added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Course updated successfully!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        course.delete()
        return Response({"message": "Course deleted successfully!"})


# ----- TIMESLOTS -----
@api_view(['GET', 'POST'])
def timeslots_view(request):
    if request.method == 'GET':
        timeslots = TimeSlot.objects.select_related('course__lecturer').all()
        enriched_data = [{
            "id": ts.id,
            "course_id": ts.course.id,
            "course_code": ts.course.id,
            "course_name": ts.course.name,
            "lecturer_name": ts.course.lecturer.name,
            "day": ts.day,
            "start_time": ts.start_time,
            "end_time": ts.end_time
        } for ts in timeslots]
        return Response(enriched_data)

    elif request.method == 'POST':
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Time slot added successfully!", "timeslot_id": serializer.instance.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def timeslot_detail(request, pk):
    try:
        ts = TimeSlot.objects.get(pk=pk)
    except TimeSlot.DoesNotExist:
        return Response({"error": "Time slot not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = TimeSlotSerializer(ts, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Time slot updated successfully!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        ts.delete()
        return Response({"message": "Time slot deleted successfully!"})

@api_view(['GET'])
def get_timetable(request):
    """Fetch all scheduled courses organized by days"""
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    timetable = {day: [] for day in week_days}

    courses = Course.objects.prefetch_related('time_slots', 'lecturer').all()

    for course in courses:
        for slot in course.time_slots.all():
            timetable[slot.day].append({
                "course_code": course.id,
                "course_name": course.name,
                "lecturer": course.lecturer.name,
                "start_time": slot.start_time,
                "end_time": slot.end_time,
                "room": "N/A",  # Placeholder
            })

    return Response(timetable)

@api_view(['GET'])
def get_dashboard_stats(request):
    return Response({
        "courses": Course.objects.count(),
        "lecturers": Lecturer.objects.count(),
        "rooms": Room.objects.count(),
        "timeslots": TimeSlot.objects.count(),
    })

@api_view(['GET'])
def get_recent_logs(request):
    logs = [
        "📌 Course PHY101 scheduled on Monday 08:00 - 10:00",
        "⚠️ Conflict: Lecturer Dr. Smith assigned to two courses at the same time!",
        "📌 New course CSC202 added to the database",
    ]
    return Response(logs)


@api_view(['GET'])
def run_algorithm(request):
    rooms = Room.objects.all()
    courses = Course.objects.prefetch_related('time_slots').all()

    # Convert to algo format
    room_list = [AlgoRoom(r.id, r.name, r.capacity) for r in rooms]
    course_list = [
        AlgoCourse(
            c.id,
            c.name,
            c.level,
            c.num_students,
            [AlgoTimeSlot(ts.day, ts.start_time, ts.end_time) for ts in c.time_slots.all()],
            c.lecturer_id
        ) for c in courses
    ]

    logs = []
    bookings, failed = auto_schedule_courses(course_list, room_list, logs)

    lecturer_lookup = {l.id: l.name for l in Lecturer.objects.all()}

    result = {
        "bookings": [
            {
                "course_id": b.course.course_id,
                "course_name": b.course.name,
                "lecturer": lecturer_lookup.get(b.course.lecturer_id, "Unknown"),
                "room": b.room.name,
                "day": b.day,
                "start_time": b.start_time,
                "end_time": b.end_time
            } for b in bookings
        ],
        "failed_bookings": failed,
        "logs": logs
    }

    return Response(result)

@api_view(['POST'])
def export_file(request):
    data = request.data
    file_format = data.get("format", "pdf")

    schedule = data.get("schedule", [])
    failed = data.get("failed_bookings", [])
    semester = data.get("semester", "Semester")
    faculty = data.get("faculty", "Faculty")
    session = data.get("session", "Session")
    year = data.get("academic_year", "Year")
    dept = data.get("department", "Department")

    if file_format == "pdf":
        return generate_pdf(schedule, failed, semester, year, dept, faculty, session)
    else:
        return generate_docx(schedule, failed, semester, year, dept, faculty, session)