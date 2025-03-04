from .timeslot import TimeSlot
class Course:
    def __init__(self, course_id, name, level, num_students, time_slots:list[TimeSlot]):
        """
        course_id: unique ID for the course
        name: e.g. "PHY 101"
        level: e.g. 100, 200, ...
        num_students: how many students in the course
        time_slots: a list of TimeSlot objects
        """
        self.course_id = course_id
        self.name = name
        self.level = level
        self.num_students = num_students
        self.time_slots = time_slots  # e.g. [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "13:00", "16:00")]
