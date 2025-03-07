import { useEffect, useState } from "react";

export default function WeeklyTimetable() {
  const [timetable, setTimetable] = useState({});
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/timetable")
      .then(res => res.json())
      .then(data => setTimetable(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Weekly Timetable</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Days</th>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} className="border border-gray-300 p-2">{8 + i}:00</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekDays.map(day => (
              <tr key={day} className="border border-gray-300">
                <td className="border border-gray-300 p-2 font-bold">{day}</td>
                {Array.from({ length: 10 }, (_, i) => {
                  const slot = timetable[day]?.find(s => parseInt(s.start_time.split(":")[0]) === 8 + i);
                  return (
                    <td key={i} className="border border-gray-300 p-2">
                      {slot ? (
                        <>
                          <span className="font-bold">{slot.course_code}</span> - {slot.course_name}
                          <br />
                          <small>{slot.lecturer}</small>
                        </>
                      ) : "—"}
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
