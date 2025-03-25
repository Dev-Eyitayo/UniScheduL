import React, { useEffect, useState } from "react";
import authFetch from "../../utils/authFetch";

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
  
  const fetchTimetable = async () => {
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/timeslots");
      setTimeSlots(data);
    } catch (err) {
      console.error("Error loading timetable:", err);
    }
  };
  

  const isWithinTimeSlot = (hour, start, end) => {
    const hourNum = parseInt(hour.split(":")[0], 10);
    const startNum = parseInt(start.split(":")[0], 10);
    const endNum = parseInt(end.split(":")[0], 10);
    return hourNum >= startNum && hourNum < endNum;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Weekly Timetable</h2>

      {/* ✅ Wrap table inside a horizontally scrollable container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Days</th>
              {hours.map((hour) => (
                <th key={hour} className="border px-4 py-2 min-w-[100px]">{hour}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border px-4 py-2 font-bold">{day}</td>
                {hours.map((hour) => {
                  const activeCourses = timeSlots.filter((slot) => (
                    slot.day === day &&
                    isWithinTimeSlot(hour, slot.start_time, slot.end_time)
                  ));

                  const lecturerConflicts = new Set();
                  const lecturerMap = {};

                  activeCourses.forEach((course) => {
                    if (lecturerMap[course.lecturer_name]) {
                      lecturerConflicts.add(course.lecturer_name);
                    } else {
                      lecturerMap[course.lecturer_name] = course;
                    }
                  });

                  return (
                    <td key={hour} className="border px-4 py-2 text-center align-top">
                      {activeCourses.length === 0 ? (
                        <span>—</span>
                      ) : (
                        activeCourses.map((course, index) => {
                          const hasConflict = lecturerConflicts.has(course.lecturer_name);
                          const bgColor = hasConflict ? "bg-yellow-300" : "bg-blue-100";

                          return (
                            <div key={index} className={`mb-2 p-1 rounded ${bgColor}`}>
                              <div className="font-bold">{course.course_code} - {course.course_name}</div>
                              <div className="text-sm italic">{course.lecturer_name}</div>
                              {hasConflict && (
                                <div className="text-sm text-black font-semibold">⚠️ Lecturer Conflict!</div>
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
    </div>
  );
}
