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

# Example data
rooms = [
    Room(1, "Physics Lab 1", 80),
    Room(2, "Physics Lab 2", 100),
    Room(3, "Lecture Hall A", 150),
    Room(4, "Lecture Hall B", 200),
    Room(5, "Lecture Theatre 1", 250)
]


# Example data FOR 100 LEVEL COURSES
course_101_time_slots = [
    TimeSlot("Monday",    "08:00", "10:00"),  # M (8–10)
    TimeSlot("Wednesday", "10:00", "12:00")   # W (10–12)
]
phy_101 = Course(
    course_id=101,
    name="PHY 101",
    level=100,
    num_students=120,
    time_slots=course_101_time_slots
)

course_102_time_slots = [
    TimeSlot("Tuesday",  "08:00", "10:00"),   # T (8–10)
    TimeSlot("Thursday", "10:00", "12:00")    # Th (10–12)
]
phy_102 = Course(
    course_id=102,
    name="PHY 102",
    level=100,
    num_students=90,
    time_slots=course_102_time_slots
)

course_103_time_slots = [
    TimeSlot("Monday",   "10:00", "12:00"),   # M (10–12)
    TimeSlot("Friday",   "08:00", "10:00")    # F (8–10)
]
phy_103 = Course(
    course_id=103,
    name="PHY 103",
    level=100,
    num_students=60,
    time_slots=course_103_time_slots
)

course_104_time_slots = [
    TimeSlot("Tuesday",   "13:00", "15:00"),  # T (13–15)
    TimeSlot("Thursday",  "08:00", "10:00")   # Th (8–10)
]
phy_104 = Course(
    course_id=104,
    name="PHY 104",
    level=100,
    num_students=80,
    time_slots=course_104_time_slots
)


# Example data FOR 200 LEVEL COURSES
course_201_time_slots = [
    TimeSlot("Monday",    "08:00", "10:00"),  # M (8–10)  (same as PHY 101 slot -> potential conflict)
    TimeSlot("Friday",    "10:00", "12:00")   # F (10–12)
]
phy_201 = Course(
    course_id=201,
    name="PHY 201",
    level=200,
    num_students=120,
    time_slots=course_201_time_slots
)

course_202_time_slots = [
    TimeSlot("Tuesday",   "10:00", "12:00"),  # T (10–12)
    TimeSlot("Friday",    "08:00", "10:00")   # F (8–10)  (same as PHY 103 slot -> potential conflict)
]
phy_202 = Course(
    course_id=202,
    name="PHY 202",
    level=200,
    num_students=100,
    time_slots=course_202_time_slots
)

course_203_time_slots = [
    TimeSlot("Wednesday", "08:00", "10:00"),  # W (8–10)
    TimeSlot("Thursday",  "13:00", "15:00")   # Th (13–15)
]
phy_203 = Course(
    course_id=203,
    name="PHY 203",
    level=200,
    num_students=80,
    time_slots=course_203_time_slots
)

course_204_time_slots = [
    TimeSlot("Monday",    "13:00", "15:00"),  # M (13–15)
    TimeSlot("Wednesday", "10:00", "12:00")   # W (10–12) (same as PHY 101 -> potential conflict)
]
phy_204 = Course(
    course_id=204,
    name="PHY 204",
    level=200,
    num_students=90,
    time_slots=course_204_time_slots
)



# Example data FOR 300 LEVEL COURSES
course_301_time_slots = [
    TimeSlot("Monday",    "08:00", "09:00"),  # M (8–9)
    TimeSlot("Wednesday", "08:00", "09:00")   # W (8–9)
]
phy_301 = Course(
    course_id=301,
    name="PHY 301",
    level=300,
    num_students=70,
    time_slots=course_301_time_slots
)

course_302_time_slots = [
    TimeSlot("Monday",    "09:00", "10:00"),  # M (9–10)
    TimeSlot("Wednesday", "09:00", "10:00")   # W (9–10)
]
phy_302 = Course(
    course_id=302,
    name="PHY 302",
    level=300,
    num_students=70,
    time_slots=course_302_time_slots
)

course_303_time_slots = [
    TimeSlot("Tuesday",   "08:00", "09:00"),  # T (8–9)
    TimeSlot("Thursday",  "08:00", "09:00")   # Th (8–9)
]
phy_303 = Course(
    course_id=303,
    name="PHY 303",
    level=300,
    num_students=75,
    time_slots=course_303_time_slots
)

course_304_time_slots = [
    TimeSlot("Tuesday",   "09:00", "10:00"),  # T (9–10)
    TimeSlot("Thursday",  "09:00", "10:00")   # Th (9–10)
]
phy_304 = Course(
    course_id=304,
    name="PHY 304",
    level=300,
    num_students=100,
    time_slots=course_304_time_slots
)



# Example data FOR 400 LEVEL COURSES
course_401_time_slots = [
    TimeSlot("Tuesday",   "13:00", "16:00"),  # T (13–16)
    TimeSlot("Thursday",  "13:00", "16:00")   # Th (13–16)
]
phy_401 = Course(
    course_id=401,
    name="PHY 401",
    level=400,
    num_students=50,
    time_slots=course_401_time_slots
)

course_402_time_slots = [
    TimeSlot("Monday",    "10:00", "12:00"),  # M (10–12)
    TimeSlot("Wednesday", "13:00", "15:00")   # W (13–15)
]
phy_402 = Course(
    course_id=402,
    name="PHY 402",
    level=400,
    num_students=60,
    time_slots=course_402_time_slots
)

course_403_time_slots = [
    TimeSlot("Wednesday", "08:00", "10:00"),  # W (8–10)
    TimeSlot("Friday",    "08:00", "10:00")   # F (8–10)
]
phy_403 = Course(
    course_id=403,
    name="PHY 403",
    level=400,
    num_students=70,
    time_slots=course_403_time_slots
)

course_404_time_slots = [
    TimeSlot("Tuesday",   "10:00", "12:00"),  # T (10–12)
    TimeSlot("Thursday",  "10:00", "12:00")   # Th (10–12)
]
phy_404 = Course(
    course_id=404,
    name="PHY 404",
    level=400,
    num_students=40,
    time_slots=course_404_time_slots
)


# All courses
courses = [
    # 100-level
    phy_101,
    phy_102,
    phy_103,
    phy_104,

    # 200-level
    phy_201,
    phy_202,
    phy_203,
    phy_204,

    # 300-level
    phy_301,
    phy_302,
    phy_303,
    phy_304,

    # 400-level
    phy_401,
    phy_402,
    phy_403,
    phy_404
]




bookings = auto_schedule_courses(courses, rooms)

for b in bookings:
    print(f"Booking {b.booking_id}: {b.course.name} -> {b.room.name} on {b.day} {b.start_time}-{b.end_time}")
