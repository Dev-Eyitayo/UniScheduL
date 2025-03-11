import React, { useEffect, useState } from "react";

export default function WeeklyTimetable() {
  const [timeSlots, setTimeSlots] = useState([]);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Fetch timetable from API
  const fetchTimetable = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
  };

  // Helper function to check if an hour (e.g., "09:00") is within a time slot
  const isWithinTimeSlot = (hour, start, end) => {
    const hourNum = parseInt(hour.split(":")[0], 10);
    const startNum = parseInt(start.split(":")[0], 10);
    const endNum = parseInt(end.split(":")[0], 10);
    return hourNum >= startNum && hourNum < endNum;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Weekly Timetable</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Days</th>
            {hours.map((hour) => (
              <th key={hour} className="border px-4 py-2">{hour}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              {/* Column for the day name */}
              <td className="border px-4 py-2 font-bold">{day}</td>

              {/* Columns for each hour */}
              {hours.map((hour) => {
                // Find all courses that are active during this hour
                const activeCourses = timeSlots.filter((slot) => (
                  slot.day === day &&
                  isWithinTimeSlot(hour, slot.start_time, slot.end_time)
                ));

                // Detect conflicts (same lecturer or same room)
                const lecturerConflicts = new Set();
                const roomConflicts = new Set();
                const lecturerMap = {};
                const roomMap = {};

                activeCourses.forEach((course) => {
                  // Track lecturer conflicts
                  if (lecturerMap[course.lecturer_name]) {
                    lecturerConflicts.add(course.lecturer_name);
                  } else {
                    lecturerMap[course.lecturer_name] = course;
                  }

                  // Track room conflicts
                  if (roomMap[course.room]) {
                    roomConflicts.add(course.room);
                  } else {
                    roomMap[course.room] = course;
                  }
                });

                return (
                  <td key={hour} className="border px-4 py-2 text-center align-top">
                    {activeCourses.length === 0 ? (
                      <span>—</span>
                    ) : (
                      activeCourses.map((course, index) => {
                        // Determine conflict style
                        let bgColor = "bg-blue-100";
                        if (lecturerConflicts.has(course.lecturer_name)) {
                          bgColor = "bg-yellow-300"; // Lecturer conflict
                        }
                        if (roomConflicts.has(course.room)) {
                          bgColor = "bg-red-400 text-white"; // Room conflict
                        }

                        return (
                          <div key={index} className={`mb-2 p-1 rounded ${bgColor}`}>
                            <div className="font-bold">
                              {course.course_code} - {course.course_name}
                            </div>
                            <div className="text-sm italic">
                              {course.lecturer_name}
                            </div>
                            <div className="text-xs">
                              Room: {course.room}
                            </div>

                            {/* Conflict Labels */}
                            {lecturerConflicts.has(course.lecturer_name) && (
                              <div className="text-sm text-black font-semibold">
                                ⚠️ Lecturer Conflict!
                              </div>
                            )}
                            {roomConflicts.has(course.room) && (
                              <div className="text-sm text-white font-semibold">
                                ❌ Room Conflict!
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
