from algoclass import Room, Course, TimeSlot, Booking

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

def auto_schedule_courses(courses, rooms, changes_logs):
    bookings = []
    failed_bookings = []  # Store failed scheduling attempts
    booking_id_counter = 1

    for course in courses:
        for timeslot in course.time_slots:
            # ✅ Check if the lecturer is available
            if not is_lecturer_available(course.lecturer_id, bookings, timeslot.day, timeslot.start_time, timeslot.end_time):
                alt_room, alt_timeslot = find_next_available_time_slot(course, rooms, bookings, timeslot)

                if alt_room and alt_timeslot:
                    changes_logs.append(f"⚠️ {course.name} originally planned on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} has moved to {alt_timeslot.day} {alt_timeslot.start_time}-{alt_timeslot.end_time} due to Lecturer conflict")
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
                else:
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed due to Lecturer conflict")
                continue

            # ✅ Find free room
            free_room, reason = find_free_room(rooms, bookings, course, timeslot)
            if free_room:
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
                alt_room, alt_timeslot = find_next_available_time_slot(course, rooms, bookings, timeslot)

                if alt_room and alt_timeslot:
                    changes_logs.append(f"⚠️ {course.name} moved to {alt_timeslot.day} {alt_timeslot.start_time}-{alt_timeslot.end_time} due to {reason}")
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
                else:
                    failed_bookings.append(f"❌ {course.name} on {timeslot.day} {timeslot.start_time}-{timeslot.end_time} failed due to {reason}")

    return bookings, failed_bookings
