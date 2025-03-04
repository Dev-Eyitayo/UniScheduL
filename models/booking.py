class Booking:
    def __init__(self, booking_id, room, course, day, start_time, end_time):
        self.booking_id = booking_id
        self.room = room        # Room object
        self.course = course    # Course object
        self.day = day
        self.start_time = start_time
        self.end_time = end_time
    def __str__(self):
        return f"Booking ID: {self.booking_id}, Room: {self.room.name}, Course: {self.course.name}, Day: {self.day}, Start: {self.start_time}, End: {self.end_time}"