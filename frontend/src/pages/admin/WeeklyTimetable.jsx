import React, { useEffect, useState } from "react";

export default function WeeklyTimetable() {
  // const [timetable, setTimetable] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

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
      const start = slot.start_time;
      const end = slot.end_time;
      return (
        slot.day === day &&
        time >= start &&
        time < end
      );
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
                if (courses.length > 0) {
                  const colSpan = courses[0].start_time === hour ? Math.max(1, (parseInt(courses[0].end_time.split(":")[0]) - parseInt(hour.split(":")[0]))) : 0;
                  return colSpan > 0 ? (
                    <td key={hour} className="border px-4 py-2 bg-blue-100 font-semibold" colSpan={colSpan}>
                      {courses.map((course, index) => (
                        <div key={index}>
                          <span className="font-bold">{course.course_id} - {course.course_name}</span>
                          <br />
                          <span className="text-sm">{course.lecturer_name}</span>
                        </div>
                      ))}
                    </td>
                  ) : null;
                } else {
                  return <td key={hour} className="border px-4 py-2 text-center">—</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
