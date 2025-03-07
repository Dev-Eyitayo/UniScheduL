import { useEffect, useState } from "react";

export default function WeeklyTimetable() {
  const [timetable, setTimetable] = useState([]);
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/timetable");
    const data = await res.json();
    setTimetable(data);
  };

  // Helper function to calculate colSpan based on time duration
  const calculateColSpan = (start, end) => {
    const startIndex = hours.indexOf(start);
    const endIndex = hours.indexOf(end);
    return endIndex - startIndex;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Weekly Timetable</h2>
      <table className="w-full border text-center">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border px-4 py-2">Days</th>
            {hours.map((hour) => (
              <th key={hour} className="border px-4 py-2">{hour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day} className="border">
              <td className="border px-4 py-2 font-bold">{day}</td>
              {hours.map((hour, index) => {
                const slot = timetable.find(
                  (slot) => slot.day === day && slot.start_time === hour
                );

                if (slot) {
                  const colSpan = calculateColSpan(slot.start_time, slot.end_time);
                  return (
                    <td
                      key={index}
                      colSpan={colSpan}
                      className="border px-4 py-2 bg-gray-100 font-semibold"
                    >
                      <span className="block text-sm font-bold">{slot.course_code} - {slot.course_name}</span>
                      <span className="text-xs">{slot.lecturer_name}</span>
                    </td>
                  );
                } else {
                  return <td key={index} className="border px-4 py-2">—</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
