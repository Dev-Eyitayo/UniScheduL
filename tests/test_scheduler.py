from . import Room, Course, TimeSlot, Booking

def times_overlap(start1, end1, start2, end2):
    """
    Given times in HH:MM format, returns True if [start1, end1) overlaps with [start2, end2).
    """
    # Simplistic string comparison method if they're zero-padded HH:MM:
    return not (end1 <= start2 or start1 >= end2)


def find_free_room(rooms, bookings, course, timeslot):
    """
    Returns the first available room for the given course and timeslot.
    If no room is found, it will return an alternative available time slot.
    """
    for room in rooms:
        if room.capacity < course.num_students:
            continue  # Skip rooms that are too small

        conflict_found = False
        for b in bookings:
            if b.room.room_id == room.room_id and b.day == timeslot.day:
                if times_overlap(timeslot.start_time, timeslot.end_time, b.start_time, b.end_time):
                    conflict_found = True
                    break  # Stop checking if a conflict is found

        if not conflict_found:
            return room, None  # Found a suitable room

    # If no room is available, return a signal to try another time
    return None, "Room unavailable at this time"

def find_next_available_time_slot(course, rooms, bookings, original_timeslot):
    """
    Finds the next best available time slot for a course if the original time is full.
    - First, try **earlier slots** on the same day.
    - Then, try **later slots** on the same day.
    - If no room is available on the same day, check another day.
    """
    
    # Define available time slots (assuming 8:00 AM to 6:00 PM working hours)
    possible_times = ["08:00", "09:00", "10:00", "11:00", "12:00",
                      "13:00", "14:00", "15:00", "16:00", "17:00"]

    # Get the index of the original start time
    if original_timeslot.start_time in possible_times:
        start_index = possible_times.index(original_timeslot.start_time)
    else:
        return None, None  # If the time is outside working hours, return failure

    # Try earlier time slots on the same day
    for new_start_time in reversed(possible_times[:start_index]):
        new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
        new_timeslot = TimeSlot(original_timeslot.day, new_start_time, new_end_time)

        room, reason = find_free_room(rooms, bookings, course, new_timeslot)
        if room:
            return room, new_timeslot  # Found a free room at an earlier time

    # Try later time slots on the same day
    for new_start_time in possible_times[start_index + 1:]:
        new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
        new_timeslot = TimeSlot(original_timeslot.day, new_start_time, new_end_time)

        room, reason = find_free_room(rooms, bookings, course, new_timeslot)
        if room:
            return room, new_timeslot  # Found a free room at a later time

    # If no slot is available on the same day, try another day
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    current_day_index = week_days.index(original_timeslot.day)

    for new_day in week_days[current_day_index + 1:] + week_days[:current_day_index]:  # Search next and previous days
        for new_start_time in possible_times:
            new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
            new_timeslot = TimeSlot(new_day, new_start_time, new_end_time)

            room, reason = find_free_room(rooms, bookings, course, new_timeslot)
            if room:
                return room, new_timeslot  # Found a free room on another day

    return None, None  # No alternative slots available


def auto_schedule_courses(courses, rooms):
    bookings = []
    failed_bookings = []  # Store failed scheduling attempts
    booking_id_counter = 1

    for course in courses:
        for timeslot in course.time_slots:
            # Attempt to find a free room for this timeslot
            free_room, reason = find_free_room(rooms, bookings, course, timeslot)
            if free_room:
                # Schedule successfully
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
                # Try to find an alternative time slot
                alt_room, alt_timeslot = find_next_available_time_slot(course, rooms, bookings, timeslot)
                if alt_room:
                    # Successfully found a new slot
                    new_booking = Booking(
                        booking_id=booking_id_counter,
                        room=alt_room,
                        course=course,
                        day=alt_timeslot.day,
                        start_time=alt_timeslot.start_time,
                        end_time=alt_timeslot.end_time
                    )
                    bookings.append(new_booking)
                    booking_id_counter += 1
                    print(f"⚠️ {course.name} moved to {alt_timeslot.day} {alt_timeslot.start_time}-{alt_timeslot.end_time}")
                else:
                    # If no alternative time was found, log failure
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed. No available time slots.")

    return bookings, failed_bookings

# Example data
rooms = [
    Room(1, "Physics Lab 1", 80),
    Room(2, "Physics Lab 2", 100),
    Room(3, "Lecture Hall 12", 150),
    Room(4, "Lecture Hall 13", 200),
    Room(5, "Lecture Theatre 1", 250),
    Room(6, "Physics Lab 3", 90),
    Room(7, "Physics Lab 4", 70),
    # Room(8, "Physics Seminar Room", 60),
    # Room(9, "Physics Main Hall", 300),
    # Room(10, "Physics Extension", 120)
]


courses_100 = [
    Course(101, "PHY 101", 100, 120, [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Wednesday", "10:00", "12:00")]),
    Course(102, "PHY 102", 100, 90,  [TimeSlot("Tuesday", "08:00", "10:00"), TimeSlot("Thursday", "10:00", "12:00")]),
    Course(103, "PHY 103", 100, 60,  [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Friday", "08:00", "10:00")]),
    Course(104, "PHY 104", 100, 80,  [TimeSlot("Tuesday", "13:00", "15:00"), TimeSlot("Thursday", "08:00", "10:00")]),
    Course(105, "PHY 105", 100, 100, [TimeSlot("Wednesday", "08:00", "10:00"), TimeSlot("Friday", "10:00", "12:00")]),
    Course(106, "PHY 106", 100, 110, [TimeSlot("Monday", "13:00", "15:00"), TimeSlot("Wednesday", "15:00", "17:00")]),
    Course(107, "PHY 107", 100, 50,  [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Thursday", "13:00", "15:00")]),
    Course(108, "PHY 108", 100, 120, [TimeSlot("Monday", "15:00", "17:00"), TimeSlot("Thursday", "15:00", "17:00")]),
    Course(109, "PHY 109", 100, 70,  [TimeSlot("Wednesday", "13:00", "15:00"), TimeSlot("Friday", "08:00", "10:00")]),
    Course(110, "PHY 110", 100, 85,  [TimeSlot("Tuesday", "08:00", "10:00"), TimeSlot("Thursday", "10:00", "12:00")])
]

courses_200 = [
    Course(201, "PHY 201", 200, 130, [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Friday", "10:00", "12:00")]),
    Course(202, "PHY 202", 200, 95,  [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Friday", "08:00", "10:00")]),
    Course(203, "PHY 203", 200, 85,  [TimeSlot("Wednesday", "08:00", "10:00"), TimeSlot("Thursday", "13:00", "15:00")]),
    Course(204, "PHY 204", 200, 105, [TimeSlot("Monday", "13:00", "15:00"), TimeSlot("Wednesday", "10:00", "12:00")]),
    Course(205, "PHY 205", 200, 90,  [TimeSlot("Tuesday", "08:00", "10:00"), TimeSlot("Thursday", "10:00", "12:00")]),
    Course(206, "PHY 206", 200, 115, [TimeSlot("Monday", "15:00", "17:00"), TimeSlot("Thursday", "15:00", "17:00")]),
    Course(207, "PHY 207", 200, 75,  [TimeSlot("Tuesday", "13:00", "15:00"), TimeSlot("Friday", "08:00", "10:00")]),
    Course(208, "PHY 208", 200, 100, [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Wednesday", "10:00", "12:00")]),
    Course(209, "PHY 209", 200, 120, [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Thursday", "13:00", "15:00")]),
    Course(210, "PHY 210", 200, 110, [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Friday", "10:00", "12:00")])
]
courses_300 = [
    Course(301, "PHY 301", 300, 75,  [TimeSlot("Monday", "08:00", "09:00"), TimeSlot("Wednesday", "08:00", "09:00")]),
    Course(302, "PHY 302", 300, 90,  [TimeSlot("Monday", "09:00", "10:00"), TimeSlot("Wednesday", "09:00", "10:00")]),
    Course(303, "PHY 303", 300, 85,  [TimeSlot("Tuesday", "08:00", "09:00"), TimeSlot("Thursday", "08:00", "09:00")]),
    Course(304, "PHY 304", 300, 100, [TimeSlot("Tuesday", "09:00", "10:00"), TimeSlot("Thursday", "09:00", "10:00")]),
    Course(305, "PHY 305", 300, 110, [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Wednesday", "10:00", "12:00")]),
    Course(306, "PHY 306", 300, 120, [TimeSlot("Tuesday", "13:00", "15:00"), TimeSlot("Thursday", "13:00", "15:00")]),
    Course(307, "PHY 307", 300, 95,  [TimeSlot("Monday", "13:00", "15:00"), TimeSlot("Friday", "08:00", "10:00")]),
    Course(308, "PHY 308", 300, 80,  [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Thursday", "10:00", "12:00")]),
    Course(309, "PHY 309", 300, 70,  [TimeSlot("Wednesday", "10:00", "12:00"), TimeSlot("Friday", "10:00", "12:00")]),
    Course(310, "PHY 310", 300, 120, [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Wednesday", "08:00", "10:00")])
]

courses_400 = [
    Course(401, "PHY 401 - Quantum Mechanics II", 400, 50,  
           [TimeSlot("Tuesday", "13:00", "16:00"), TimeSlot("Thursday", "13:00", "16:00")]),

    Course(402, "PHY 402 - Electromagnetic Waves", 400, 60,  
           [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Wednesday", "13:00", "15:00")]),

    Course(403, "PHY 403 - Statistical Mechanics", 400, 70,  
           [TimeSlot("Wednesday", "08:00", "10:00"), TimeSlot("Friday", "08:00", "10:00")]),

    Course(404, "PHY 404 - Solid State Physics", 400, 40,  
           [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Thursday", "10:00", "12:00")]),

    Course(405, "PHY 405 - Nuclear Physics", 400, 55,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Wednesday", "10:00", "12:00")]),

    Course(406, "PHY 406 - Advanced Thermodynamics", 400, 65,  
           [TimeSlot("Tuesday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),

    Course(407, "PHY 407 - Mathematical Physics III", 400, 50,  
           [TimeSlot("Monday", "13:00", "15:00"), TimeSlot("Wednesday", "15:00", "17:00")]),

    Course(408, "PHY 408 - Atomic and Molecular Physics", 400, 45,  
           [TimeSlot("Tuesday", "15:00", "17:00"), TimeSlot("Thursday", "15:00", "17:00")]),

    Course(409, "PHY 409 - Plasma Physics", 400, 60,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "10:00", "12:00")]),

    Course(410, "PHY 410 - Research Methodology in Physics", 400, 80,  
           [TimeSlot("Friday", "08:00", "10:00"), TimeSlot("Friday", "13:00", "15:00")])
]


# All courses
courses = courses_100 + courses_200 + courses_300 + courses_400

bookings, failed_bookings = auto_schedule_courses(courses, rooms)

def print_schedule(bookings, failed_bookings):

    orders = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    # Sort bookings by day and start time
    bookings.sort(key=lambda b: (orders.index(b.day), b.start_time))
    
    print("\n📅 **Final Room Schedule**\n")
    current_day = None
    for booking in bookings:
        if booking.day != current_day:
            print(f"\n🗓 **{booking.day}**\n" + "-" * 30)
            current_day = booking.day
        print(f"📌 {booking.start_time} - {booking.end_time}: {booking.course.name} [{booking.course.level} Level] -> {booking.room.name} (Capacity: {booking.room.capacity})")

    if failed_bookings:
        print("\n🚨 **Failed Scheduling Attempts**\n" + "-" * 30)
        for failure in failed_bookings:
            print(f"❌ {failure}")

# Run the scheduling function
bookings, failed_bookings = auto_schedule_courses(courses, rooms)

# Display formatted output
print_schedule(bookings, failed_bookings)
