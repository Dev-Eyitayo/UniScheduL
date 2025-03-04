class Course:
    def __init__(self, course_id, name, level, num_students, start_time, end_time, days):
        """
        course_id: unique identifier
        name: e.g. "PHY 101"
        level: e.g. 100, 200, 300, 400
        num_students: how many students are taking the course
        start_time, end_time: times in e.g. "08:00", "10:00" format
        days: list or set of days, e.g. ["Monday", "Wednesday"]
        """
        self.course_id = course_id
        self.name = name
        self.level = level
        self.num_students = num_students
        self.start_time = start_time
        self.end_time = end_time
        self.days = days
