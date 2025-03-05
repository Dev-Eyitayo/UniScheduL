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
        
    if all(room.capacity < course.num_students for room in rooms):
        return None, f"No room that can support the required capacity of {course.num_students}. Largest room available: {max(room.capacity for room in rooms)}"  # No room is available
    return None, f"No room unavailable on {timeslot.day} at ({timeslot.start_time} - {timeslot.end_time})"

def find_next_available_time_slot(course, rooms, bookings, original_timeslot):
    """
    Finds the **best possible** alternative time slot for a course when its original time slot is full.
    Prioritizes:
    - **Same day earlier slots**
    - **Same day later slots**
    - **Next best available day**
    Ensures:
    - **Least number of conflicts**
    - **Lecturer is available**
    - **A suitable room is available**
    """

    possible_times = ["08:00", "09:00", "10:00", "11:00", "12:00",
                      "13:00", "14:00", "15:00", "16:00", "17:00"]
    week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    # Get the index of the current time and day
    start_index = possible_times.index(original_timeslot.start_time)
    current_day_index = week_days.index(original_timeslot.day)

    # **Store potential slots with their conflict count**
    best_slot = None
    best_room = None
    min_conflicts = float("inf")

    # **Step 1: Check same day earlier slots**
    for new_start_time in reversed(possible_times[:start_index]):
        new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
        new_timeslot = TimeSlot(original_timeslot.day, new_start_time, new_end_time)

        # Find room + check lecturer availability
        room, reason = find_free_room(rooms, bookings, course, new_timeslot)
        conflicts = sum(1 for b in bookings if b.day == original_timeslot.day and b.start_time == new_start_time)

        if room and is_lecturer_available(course.lecturer_id, bookings, original_timeslot.day, new_start_time, new_end_time):
            if conflicts < min_conflicts:  # Pick the slot with the fewest conflicts
                min_conflicts = conflicts
                best_slot = new_timeslot
                best_room = room

    # **Step 2: Check same day later slots**
    for new_start_time in possible_times[start_index + 1:]:
        new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
        new_timeslot = TimeSlot(original_timeslot.day, new_start_time, new_end_time)

        # Find room + check lecturer availability
        room, reason = find_free_room(rooms, bookings, course, new_timeslot)
        conflicts = sum(1 for b in bookings if b.day == original_timeslot.day and b.start_time == new_start_time)

        if room and is_lecturer_available(course.lecturer_id, bookings, original_timeslot.day, new_start_time, new_end_time):
            if conflicts < min_conflicts:
                min_conflicts = conflicts
                best_slot = new_timeslot
                best_room = room

    # **Step 3: If no slots on the same day, check other days**
    for new_day in week_days[current_day_index + 1:] + week_days[:current_day_index]:
        for new_start_time in possible_times:
            new_end_time = possible_times[possible_times.index(new_start_time) + 2] if possible_times.index(new_start_time) + 2 < len(possible_times) else "18:00"
            new_timeslot = TimeSlot(new_day, new_start_time, new_end_time)

            # Find room + check lecturer availability
            room, reason = find_free_room(rooms, bookings, course, new_timeslot)
            conflicts = sum(1 for b in bookings if b.day == new_day and b.start_time == new_start_time)

            if room and is_lecturer_available(course.lecturer_id, bookings, new_day, new_start_time, new_end_time):
                if conflicts < min_conflicts:
                    min_conflicts = conflicts
                    best_slot = new_timeslot
                    best_room = room

    return best_room, best_slot  # Returns the best available time slot

def is_lecturer_available(lecturer_id, bookings, day, start_time, end_time):
    """
    Checks if a lecturer is already assigned to another class at the same time.
    Returns True if available, False if they are already teaching another course.
    """
    for booking in bookings:
        if booking.course.lecturer_id == lecturer_id and booking.day == day:
            if times_overlap(booking.start_time, booking.end_time, start_time, end_time):
                return False  # Conflict found
    return True  # Lecturer is available


def auto_schedule_courses(courses, rooms):
    bookings = []
    failed_bookings = []  # Store failed scheduling attempts
    booking_id_counter = 1

    for course in courses:
        for timeslot in course.time_slots:
            # ✅ Check if the lecturer is available
            if not is_lecturer_available(course.lecturer_id, bookings, timeslot.day, timeslot.start_time, timeslot.end_time):
                # ❌ Instead of immediately failing, try to reschedule
                alt_room, alt_timeslot = find_next_available_time_slot(course, rooms, bookings, timeslot)

                if alt_room and alt_timeslot and is_lecturer_available(course.lecturer_id, bookings, alt_timeslot.day, alt_timeslot.start_time, alt_timeslot.end_time):
                    # ✅ Successfully found a new slot with an available lecturer
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
                    print(f"⚠️ {course.name} originally planned on {} moved to {alt_timeslot.day} {alt_timeslot.start_time}-{alt_timeslot.end_time} due to Lecturer conflict")
                else:
                    # ❌ If no alternative time was found, log failure
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed due to Lecturer conflict")
                continue  # ✅ Skip the rest since we've handled the conflict

            # ✅ Attempt to find a free room for this timeslot
            free_room, reason = find_free_room(rooms, bookings, course, timeslot)
            if free_room:
                # ✅ Schedule successfully
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
                # ❌ Try to find an alternative time slot due to ROOM conflict
                alt_room, alt_timeslot = find_next_available_time_slot(course, rooms, bookings, timeslot)

                if alt_room and alt_timeslot and is_lecturer_available(course.lecturer_id, bookings, alt_timeslot.day, alt_timeslot.start_time, alt_timeslot.end_time):
                    # ✅ Successfully found a new slot with an available lecturer
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
                    # ❌ If no alternative time was found, log failure
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed due to {reason}")

    return bookings, failed_bookings

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
        print(f"📌 {booking.start_time} - {booking.end_time}: {booking.course.name} by Lecturer {booking.course.lecturer_id} [{booking.course.level} Level, Class Size: {booking.course.num_students}] -> {booking.room.name} (Capacity: {booking.room.capacity})")

    if failed_bookings:
        print("\n🚨 **Failed Scheduling Attempts**\n" + "-" * 30)
        for failure in failed_bookings:
            print(f"❌ {failure}")







# Extreme test cases for scheduling algorithm stress testing
rooms = [
    Room(1, "Physics Lab 1", 80),
    Room(2, "Physics Lab 2", 100),
    Room(3, "Lecture Hall A", 150),
    Room(4, "Lecture Hall B", 200),
    Room(5, "Physics Seminar Room", 50),
    Room(6, "General Lecture Hall", 200),
    Room(7, "Research Lab", 70),
    Room(8, "Advanced Physics Lab", 90),
    Room(9, "Main Auditorium", 300),
    Room(10, "Extension Lecture Hall", 120),
    Room(11, "Specialized Quantum Lab", 60),
    Room(12, "Advanced Optics Lab", 90),
]

courses_massive = [
    # 100-Level Courses
    Course(101, "PHY 101 - Mechanics", 100, 120,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "10:00", "12:00")], lecturer_id=1),
    Course(102, "PHY 102 - Waves & Optics", 100, 100,  
           [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Thursday", "08:00", "10:00")], lecturer_id=2),
    Course(103, "PHY 103 - Electricity & Magnetism", 100, 140,  
           [TimeSlot("Tuesday", "08:00", "10:00"), TimeSlot("Friday", "08:00", "10:00")], lecturer_id=3),

    # 200-Level Courses
    Course(201, "PHY 201 - Electromagnetic Fields", 200, 200,  
           [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Wednesday", "08:00", "10:00")], lecturer_id=4),
    Course(202, "PHY 202 - Quantum Mechanics", 200, 180,  
           [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Thursday", "08:00", "10:00")], lecturer_id=1),
    Course(203, "PHY 203 - Thermodynamics", 200, 120,  
           [TimeSlot("Monday", "12:00", "14:00"), TimeSlot("Friday", "10:00", "12:00")], lecturer_id=5),

    # 300-Level Courses (Some Large Classes Need Splitting)
    Course(301, "PHY 301 - Classical Mechanics II", 300, 240,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")], lecturer_id=2),
    Course(302, "PHY 302 - Advanced Nuclear Physics", 300, 150,  
           [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Friday", "10:00", "12:00")], lecturer_id=3),
    Course(303, "PHY 303 - Computational Physics", 300, 180,  
           [TimeSlot("Wednesday", "12:00", "14:00"), TimeSlot("Thursday", "10:00", "12:00")], lecturer_id=5),

    # 400-Level Courses
    Course(401, "PHY 401 - Advanced Quantum Mechanics", 400, 50,  
           [TimeSlot("Tuesday", "13:00", "16:00"), TimeSlot("Thursday", "13:00", "16:00")], lecturer_id=4),
    Course(402, "PHY 402 - Electromagnetic Waves", 400, 60,  
           [TimeSlot("Monday", "10:00", "12:00"), TimeSlot("Wednesday", "13:00", "15:00")], lecturer_id=1),

    # 500-Level (Large Classes, High Priority)
    Course(501, "PHY 501 - Quantum Information", 500, 300,  
           [TimeSlot("Monday", "08:00", "10:00"), TimeSlot("Thursday", "08:00", "10:00")], lecturer_id=6),
    Course(502, "PHY 502 - Plasma Physics", 500, 200,  
           [TimeSlot("Tuesday", "10:00", "12:00"), TimeSlot("Friday", "10:00", "12:00")], lecturer_id=7),

    # 600-Level (Advanced Research-Based Courses)
    Course(601, "PHY 601 - Relativity & Gravitation", 600, 100,  
           [TimeSlot("Wednesday", "08:00", "10:00"), TimeSlot("Friday", "08:00", "10:00")], lecturer_id=8),
    
    # 700-Level (Tightly Packed Schedule)
    Course(701, "PHY 701 - Statistical Thermodynamics", 700, 150,  
           [TimeSlot("Wednesday", "12:00", "14:00")], lecturer_id=9),
    Course(702, "PHY 702 - High Energy Physics", 700, 160,  
           [TimeSlot("Wednesday", "14:00", "16:00")], lecturer_id=10),
    
    # 800-Level (Requires Specific Rooms)
    Course(801, "PHY 801 - Experimental Methods", 800, 80,  
           [TimeSlot("Thursday", "08:00", "10:00")], lecturer_id=1),
    Course(802, "PHY 802 - Advanced Optics", 800, 60,  
           [TimeSlot("Thursday", "10:00", "12:00")], lecturer_id=2),

    # 900-Level (Final Year Research + Exams)
    Course(901, "PHY 901 - Research Methods", 900, 100, [TimeSlot("Friday", "08:00", "10:00")], lecturer_id=3),
    Course(902, "PHY 902 - Computational Fluid Dynamics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")], lecturer_id=4),
    Course(903, "PHY 903 - Atomic Physics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")], lecturer_id=5),
    Course(904, "PHY 904 - Statistical Physics", 900, 100, [TimeSlot("Friday", "08:00", "10:00")], lecturer_id=6),
]

# Run the scheduler with massive dataset
bookings, failed_bookings = auto_schedule_courses(courses_massive, rooms)

# Print results
print_schedule(bookings, failed_bookings)
