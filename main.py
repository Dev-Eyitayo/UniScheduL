from models import Course, TimeSlot, Room, Booking


def times_overlap(start1, end1, start2, end2):
    """
    Given times in HH:MM format, returns True if [start1, end1) overlaps with [start2, end2).
    """
    # Simplistic string comparison method if they're zero-padded HH:MM:
    return not (end1 <= start2 or start1 >= end2)

def find_free_room(rooms, bookings, course, timeslot):
    """
    Returns the first room that fits the course's capacity and
    is free on timeslot.day between timeslot.start_time and timeslot.end_time.
    """
    for room in rooms:
        # 1) Check capacity
        if room.capacity < course.num_students:
            continue

        # 2) Check existing bookings for conflicts
        conflict_found = False
        for b in bookings:
            if b.room.room_id == room.room_id and b.day == timeslot.day:
                # same day, so check time
                if times_overlap(timeslot.start_time, timeslot.end_time,
                                 b.start_time, b.end_time):
                    conflict_found = True
                    break

        if not conflict_found:
            return room

    return None  # No free room found

def auto_schedule_courses(courses, rooms):
    bookings = []
    booking_id_counter = 1

    for course in courses:
        for timeslot in course.time_slots:
            # Attempt to find a free room for this timeslot
            free_room = find_free_room(rooms, bookings, course, timeslot)
            if free_room:
                # Create a booking
                new_booking = Booking(
                    booking_id=booking_id_counter,
                    room=free_room,
                    course=course,
                    day=timeslot.day,
                    start_time=timeslot.start_time,
                    end_time=timeslot.end_time
                )
                bookings.append(new_booking)
                booking_id_counter += 1
            else:
                print(f"No available room found for {course.name} on {timeslot.day} "
                      f"{timeslot.start_time}-{timeslot.end_time}")

    return bookings
course_101_time_slots = [
    TimeSlot("Monday", "08:00", "10:00"),
    TimeSlot("Thursday", "13:00", "16:00")
]

phy_101 = Course(
    course_id=1,
    name="PHY 101",
    level=100,
    num_students=120,
    time_slots=course_101_time_slots
)


rooms = [
    Room(1, "Physics Lab 1", 80),
    Room(2, "Physics Lab 2", 100),
    Room(3, "Lecture Hall A", 150)
]

course_201_time_slots = [
    TimeSlot("Monday", "08:00", "10:00"),   # same as 101's Monday slot => conflict test
    TimeSlot("Wednesday", "10:00", "12:00")
]
phy_201 = Course(2, "PHY 201", 200, 90, course_201_time_slots)

courses = [phy_101, phy_201]  # plus any others


bookings = auto_schedule_courses(courses, rooms)
for b in bookings:
    print(f"Booking {b.booking_id}: {b.course.name} -> {b.room.name} on {b.day} {b.start_time}-{b.end_time}")
