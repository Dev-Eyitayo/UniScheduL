from django.contrib import admin
from .models import Lecturer, Room, Course, TimeSlot, Institution, User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'role', 'institution', 'is_active', 'is_staff')
    list_filter = ('role', 'institution', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('role', 'institution')}),
    )
    search_fields = ('email', 'username')

# Register your models here.
admin.site.register([Lecturer, Room, Course, TimeSlot, Institution])
admin.site.register(User, CustomUserAdmin)
