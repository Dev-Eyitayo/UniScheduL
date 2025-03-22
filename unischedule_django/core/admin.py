from django.contrib import admin
from .models import Lecturer, Room, Course, TimeSlot

# Register your models here.
admin.site.register([Lecturer, Room, Course, TimeSlot])