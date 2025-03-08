from algoclass import Room, Course, TimeSlot
#  Extreme test cases for scheduling algorithm stress testing
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

courses_extreme = [
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