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
        
    if any(room.capacity < course.num_students for room in rooms):
        return None, "Room unavailable at this time"
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
                    print(f"⚠️ {course.name} moved to {alt_timeslot.day} {alt_timeslot.start_time}-{alt_timeslot.end_time} due to {reason}")
                else:
                    # If no alternative time was found, log failure
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed due to {reason}")

    return bookings, failed_bookings


# bookings, failed_bookings = auto_schedule_courses(courses, rooms)

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
        print(f"📌 {booking.start_time} - {booking.end_time}: {booking.course.name} [{booking.course.level} Level, Class Size: {booking.course.num_students}] -> {booking.room.name} (Capacity: {booking.room.capacity})")

    if failed_bookings:
        print("\n🚨 **Failed Scheduling Attempts**\n" + "-" * 30)
        for failure in failed_bookings:
            print(f"❌ {failure}")

# # Run the scheduling function
# bookings, failed_bookings = auto_schedule_courses(courses, rooms)

# # Display formatted output
# print_schedule(bookings, failed_bookings)


# Extreme test cases for scheduling algorithm stress testing

rooms = [
    Room(1, "Physics Lab 1", 80),
    Room(2, "Physics Lab 2", 100),
    Room(3, "Lecture Hall A", 150),
    Room(4, "Lecture Hall B", 200),
    Room(5, "Physics Seminar Room", 50),
]

# 1️⃣ Large classes that exceed room capacity
courses_extreme = [
    Course(501, "PHY 501 - Advanced Quantum Physics", 500, 400,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),  
    Course(502, "PHY 502 - Theoretical Mechanics", 500, 200,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),  
    Course(503, "PHY 503 - Electromagnetic Theory", 500, 180,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),  
    Course(504, "PHY 504 - Computational Physics", 500, 190,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),  
    Course(505, "PHY 505 - Advanced Optics",500, 300,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")]),  
]

# A fully packed day
courses_filled_day = [
    Course(601, "PHY 601 - Relativity", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
    Course(602, "PHY 602 - Plasma Physics", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
    Course(603, "PHY 603 - Experimental Techniques", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
    Course(604, "PHY 604 - Biophysics", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
    Course(605, "PHY 605 - Nuclear Astrophysics", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
    Course(606, "PHY 606 - Particle Physics", 600, 100, [TimeSlot("Tuesday", "08:00", "10:00")]),  
]

# No available gaps for rescheduling
courses_no_gaps = [
    Course(701, "PHY 701 - High Energy Physics", 700, 150, [TimeSlot("Wednesday", "08:00", "10:00")]),  
    Course(702, "PHY 702 - Fluid Mechanics", 700, 150, [TimeSlot("Wednesday", "10:00", "12:00")]),  
    Course(703, "PHY 703 - Statistical Thermodynamics", 700, 150, [TimeSlot("Wednesday", "12:00", "14:00")]),  
    Course(704, "PHY 704 - Condensed Matter Physics", 700, 150, [TimeSlot("Wednesday", "14:00", "16:00")]),  
    Course(705, "PHY 705 - Quantum Field Theory", 700, 150, [TimeSlot("Wednesday", "16:00", "18:00")]),  
]

# Courses that need special rooms
courses_special_rooms = [
    Course(801, "PHY 801 - Advanced Experimental Physics", 800, 80,  
           [TimeSlot("Thursday", "08:00", "10:00")]),  
    Course(802, "PHY 802 - Laser Optics", 800, 60,  
           [TimeSlot("Thursday", "10:00", "12:00")]),  
]

rooms_specialized = [
    Room(6, "General Lecture Hall", 200),
    Room(7, "Physics Lab", 100),  # Only one physics lab!
]

# Exams requiring large space and happening at the same time
courses_exams = [
    Course(901, "PHY 901 - Research Methods", 900, 100, [TimeSlot("Friday", "08:00", "10:00")]),  
    Course(902, "PHY 902 - Computational Fluid Dynamics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")]),  
    Course(903, "PHY 903 - Atomic Physics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")]),  
    Course(904, "PHY 904 - Statistical Physics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")]),  
]

# Combine all test cases
courses_extreme_cases = courses_extreme + courses_filled_day + courses_no_gaps + courses_special_rooms + courses_exams

# Run the scheduler with extreme cases
bookings, failed_bookings = auto_schedule_courses(courses_extreme_cases, rooms)

# Print results
print_schedule(bookings, failed_bookings)

