from django.contrib import admin
from django.conf import settings
from .models import Lecturer, Room, Course, TimeSlot, Institution, User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


# Customizing the Django Admin
admin.site.site_header = getattr(settings, "ADMIN_SITE_HEADER", "Admin")
admin.site.site_title = getattr(settings, "ADMIN_SITE_TITLE", "Admin")
admin.site.index_title = getattr(settings, "ADMIN_INDEX_TITLE", "Welcome")


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
