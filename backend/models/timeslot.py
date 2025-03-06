class TimeSlot:
    def __init__(self, day, start_time, end_time):
        """
        day: e.g. "Monday"
        start_time: e.g. "08:00"
        end_time: e.g. "10:00"
        """
        self.day = day
        self.start_time = start_time
        self.end_time = end_time
