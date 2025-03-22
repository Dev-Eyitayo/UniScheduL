from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Lecturer, Room, Course, TimeSlot
from .serializers import LecturerSerializer, RoomSerializer, CourseSerializer, TimeSlotSerializer

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
