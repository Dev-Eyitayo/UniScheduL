from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Signup
    path('api/signup', views.signup),

    # Lecturer APIs
    path('api/lecturers', views.lecturers_view),
    path('api/lecturers/<int:pk>', views.lecturer_detail),

    # Room APIs
    path('api/rooms', views.rooms_view),
    path('api/rooms/<int:pk>', views.room_detail),

    # Course APIs
    path('api/courses', views.courses_view),
    path('api/courses/<str:pk>', views.course_detail),

    # TimeSlot APIs
    path('api/timeslots', views.timeslots_view),
    path('api/timeslots/<int:pk>', views.timeslot_detail),

    path('api/timetable', views.get_timetable),
    path('api/run-algorithm', views.run_algorithm),
    path('api/dashboard-stats', views.get_dashboard_stats),
    path('api/recent-logs', views.get_recent_logs),
    path('api/export-file', views.export_file),
]
