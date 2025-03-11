import React, { useEffect, useState } from "react";

export default function WeeklyTimetable() {
  const [timeSlots, setTimeSlots] = useState([]);

  // Decide the days and hours you want to show:
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:00", "09:00", "10:00", 
    "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00"
  ];

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Fetch your data from the API
  const fetchTimetable = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
  };

  // Helper to check if an hour (e.g. "09:00") is within a course’s [start, end)
  const isWithinTimeSlot = (hour, start, end) => {
    const hourNum = parseInt(hour.split(":")[0], 10);
    const startNum = parseInt(start.split(":")[0], 10);
    const endNum   = parseInt(end.split(":")[0], 10);
    return (hourNum >= startNum && hourNum < endNum);
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
              {/* Left-most column for the day name */}
              <td className="border px-4 py-2 font-bold">{day}</td>

              {/* One cell per hour in the day */}
              {hours.map((hour) => {
                // Find all courses that are active this hour
                const activeCourses = timeSlots.filter((slot) => (
                  slot.day === day &&
                  isWithinTimeSlot(hour, slot.start_time, slot.end_time)
                ));
                
                // Display them all in the same cell
                return (
                  <td key={hour} className="border px-4 py-2 text-center align-top">
                    {activeCourses.length === 0 ? (
                      <span>—</span>
                    ) : (
                      activeCourses.map((course) => (
                        <div key={course.id} className="mb-2 p-1 bg-blue-100 rounded">
                          <div className="font-bold">
                            {course.course_code} - {course.course_name}
                          </div>
                          <div className="text-sm italic">
                            {course.lecturer_name}
                          </div>
                        </div>
                      ))
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
