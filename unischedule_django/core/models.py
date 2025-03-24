from django.db import models
from django.contrib.auth.models import AbstractUser

class Lecturer(models.Model):
    institution = models.ForeignKey("Institution", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)

class Room(models.Model):
    institution = models.ForeignKey("Institution", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()

class Course(models.Model):
    institution = models.ForeignKey("Institution", on_delete=models.CASCADE)
    id = models.CharField(primary_key=True, max_length=10)
    name = models.CharField(max_length=100)
    level = models.PositiveIntegerField()
    num_students = models.PositiveIntegerField()
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE, related_name='courses')

class TimeSlot(models.Model):
    institution = models.ForeignKey("Institution", on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='time_slots')
    day = models.CharField(max_length=10)
    start_time = models.CharField(max_length=5)
    end_time = models.CharField(max_length=5)


# --- Institution Model ---
class Institution(models.Model):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=100, unique=True)  # e.g. "lcu.ng"
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.domain})"


# --- Custom User Model ---
class User(AbstractUser):
    ROLE_CHOICES = (
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    )

    email = models.EmailField(unique=True)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Only needed for Django admin

    def save(self, *args, **kwargs):
        if self.role != 'super_admin':
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
