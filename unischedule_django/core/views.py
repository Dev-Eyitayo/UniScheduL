from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Lecturer, Room, Course, TimeSlot, Institution
from .serializers import LecturerSerializer, RoomSerializer, CourseSerializer, TimeSlotSerializer
from .scheduler import auto_schedule_courses
from .algoclass import Room as AlgoRoom, Course as AlgoCourse, TimeSlot as AlgoTimeSlot
from .export_utils import generate_pdf, generate_docx
from django.db import IntegrityError


User = get_user_model()


# Token generation helper
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Signup API
@api_view(['POST'])
def signup(request):
    try:
        institution_name = request.data.get('institution_name')
        institution_domain = request.data.get('institution_domain')
        email = request.data.get('admin_email')
        password = request.data.get('password')
        name = request.data.get('admin_name')

        # --- Validation ---
        if not all([institution_name, institution_domain, email, password, name]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # --- Ensure Email Domain Matches ---
        email_domain = email.split('@')[-1]
        if email_domain != institution_domain:
            return Response({'error': 'Email domain does not match the institution domain.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # --- Create or Get Institution ---
        institution, created = Institution.objects.get_or_create(
            domain=institution_domain,
            defaults={'name': institution_name}
        )

        # --- Create Admin User ---
        user = User.objects.create_user(
            username=name,
            email=email,
            password=password,
            institution=institution,
            role='admin',
            is_staff=False,
            is_superuser=False
        )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'Signup successful',
            'user': {
                'email': user.email,
                'role': user.role,
                'institution_id': institution.id,
                'institution_name': institution.name
            },
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        return Response({'error': 'A user with that email already exists.'}, status=status.HTTP_409_CONFLICT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Custom Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        data['user'] = {
            'email': user.email,
            'username': user.username,
            'role': user.role,
            'institution_id': user.institution.id if user.institution else None,
            'institution_name': user.institution.name if user.institution else None,
        }

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer














# ----- LECTURERS -----
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lecturers_view(request):
    if request.method == 'GET':
        lecturers = Lecturer.objects.filter(institution=request.user.institution)
        serializer = LecturerSerializer(lecturers, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = LecturerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(institution=request.user.institution)
            return Response({"message": "Lecturer added successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def lecturer_detail(request, pk):
    try:
        lecturer = Lecturer.objects.get(pk=pk, institution=request.user.institution)
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
@permission_classes([IsAuthenticated])
def rooms_view(request):
    if request.method == 'GET':
        rooms = Room.objects.filter(institution=request.user.institution)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(institution=request.user.institution)
            return Response({"message": "Room added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def room_detail(request, pk):
    try:
        room = Room.objects.get(pk=pk, institution=request.user.institution)
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
@permission_classes([IsAuthenticated]) 
def courses_view(request):
    if request.method == 'GET':
        courses = Course.objects.filter(institution=request.user.institution)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        lecturer_id = request.data.get("lecturer")
        try:
            lecturer = Lecturer.objects.get(id=lecturer_id, institution=request.user.institution)
        except Lecturer.DoesNotExist:
            return Response({"error": "Lecturer not found or does not belong to your institution."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(institution=request.user.institution)
            return Response({"message": "Course added successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk, institution=request.user.institution)
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
@permission_classes([IsAuthenticated]) 
def timeslots_view(request):
    if request.method == 'GET':
        timeslots = TimeSlot.objects.filter(institution=request.user.institution)
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
        course_id = request.data.get("course")
        try:
            course = Course.objects.get(id=course_id, institution=request.user.institution)
        except Course.DoesNotExist:
            return Response({"error": "Course not found or does not belong to your institution."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(institution=request.user.institution)
            return Response({
                "message": "Time slot added successfully!",
                "timeslot_id": serializer.instance.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated]) 
def timeslot_detail(request, pk):
    try:
        ts = TimeSlot.objects.get(pk=pk, institution=request.user.institution)
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
@permission_classes([IsAuthenticated]) 
def get_timetable(request):
    """Fetch all scheduled courses organized by days"""
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    timetable = {day: [] for day in week_days}

    courses = Course.objects.prefetch_related('time_slots', 'lecturer')\
    .filter(institution=request.user.institution)


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
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    inst = request.user.institution
    return Response({
        "courses": Course.objects.filter(institution=inst).count(),
        "lecturers": Lecturer.objects.filter(institution=inst).count(),
        "rooms": Room.objects.filter(institution=inst).count(),
        "timeslots": TimeSlot.objects.filter(institution=inst).count(),
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
@permission_classes([IsAuthenticated]) 
def run_algorithm(request):
    inst = request.user.institution
    rooms = Room.objects.filter(institution=inst)
    courses = Course.objects.prefetch_related('time_slots').filter(institution=inst)

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

    lecturer_lookup = {l.id: l.name for l in Lecturer.objects.filter(institution=inst)}

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