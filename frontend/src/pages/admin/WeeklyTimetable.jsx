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

  const fetchTimetable = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
  };

  const getCoursesForTimeSlot = (day, time) => {
    return timeSlots.filter((slot) => {
      return slot.day === day && time >= slot.start_time && time < slot.end_time;
    });
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
              <td className="border px-4 py-2 font-bold">{day}</td>
              {hours.map((hour) => {
                const courses = getCoursesForTimeSlot(day, hour);
                return (
                  <td key={hour} className="border px-4 py-2 text-center">
                    {courses.length > 0 ? (
                      courses.map((course, index) => (
                        <div key={index} className="bg-blue-100 p-1 m-1 rounded">
                          <span className="font-bold">{course.course_code}</span> - {course.course_name}
                          <br />
                          <span className="text-sm text-gray-600">{course.lecturer_name}</span>
                        </div>
                      ))
                    ) : (
                      "—"
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
