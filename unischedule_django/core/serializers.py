from rest_framework import serializers
from .models import Lecturer, Room, Course, TimeSlot

class LecturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        exclude = ['institution']

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        exclude = ['institution']

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        exclude = ['institution']

class CourseSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        exclude = ['institution']
