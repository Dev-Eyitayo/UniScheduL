import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// You can customize these as needed
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00"
];

export default function OptimizedSchedule() {
  const [logs, setLogs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [failedBookings, setFailedBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Run the scheduling algorithm
  const runAlgorithm = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/run-algorithm");
      if (!res.ok) throw new Error("Failed to run the algorithm");

      const data = await res.json();
      setLogs(data.logs);
      setSchedule(data.bookings);        // bookings = array with day, start_time, end_time, course_name, lecturer, room
      setFailedBookings(data.failed_bookings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setSchedule([]);
    setFailedBookings([]);
  };

  // Helper: check if an hour (e.g. "09:00") is within [start, end)
  const isWithinTimeSlot = (hour, start, end) => {
    const hourNum = parseInt(hour.split(":")[0], 10);
    const startNum = parseInt(start.split(":")[0], 10);
    const endNum   = parseInt(end.split(":")[0], 10);
    return hourNum >= startNum && hourNum < endNum;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Optimized Timetable</h2>

      {/* Buttons for Running & Clearing Logs */}
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          onClick={runAlgorithm}
          disabled={loading}
        >
          {loading ? "Running Algorithm..." : "Run Algorithm"}
        </button>

        {/* Show these extra buttons only if logs exist */}
        {logs.length > 0 && (
          <>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
              onClick={clearLogs}
            >
              Clear Logs 🗑️
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => navigate("/generate-pdf", { state: { schedule, failedBookings } })}
            >
              📄 Generate PDF
            </button>
          </>
        )}
      </div>

      {/* Logs Section */}
      {logs.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📝 Algorithm Logs:</h3>
          <ul className="list-disc list-inside">
            {logs.map((log, index) => {
              const isWarning = log.startsWith("⚠️");
              const isError = log.startsWith("❌");
              return (
                <li
                  key={index}
                  className={
                    isWarning ? "text-yellow-600" : isError ? "text-red-600" : "text-gray-700"
                  }
                >
                  {log}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 
        If schedule is empty, we won't show the table.
        We'll treat 'schedule' as an array of objects:
          [
            {
              "course_id": "PHY101",
              "course_name": "Mechanics",
              "day": "Monday",
              "start_time": "08:00",
              "end_time": "10:00",
              "lecturer": "Dr. John Doe",
              "room": "Lecture Hall A"
            },
            ...
          ]
      */}
      {schedule.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📅 Final Room Schedule (Optimized)</h3>

          {/* Scrollable container for horizontal scrolling */}
          <div className="overflow-x-auto w-full">
            <table className="w-max border border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Days</th>
                  {HOURS.map((hour) => (
                    <th key={hour} className="border px-4 py-2 min-w-[80px]">{hour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="border px-4 py-2 font-bold">{day}</td>
                    {HOURS.map((hour) => {
                      // Filter all bookings that apply to this day & hour
                      const activeBookings = schedule.filter((bk) =>
                        bk.day === day &&
                        isWithinTimeSlot(hour, bk.start_time, bk.end_time)
                      );

                      return (
                        <td key={hour} className="border px-4 py-2 text-center align-top">
                          {activeBookings.length === 0 ? (
                            <span>—</span>
                          ) : (
                            activeBookings.map((bk, idx) => (
                              <div key={idx} className="bg-blue-100 p-1 mb-2 rounded">
                                <div className="font-bold">
                                  {bk.course_id} - {bk.course_name}
                                </div>
                                <div className="text-sm italic">{bk.lecturer}</div>
                                <div className="text-xs">Room: {bk.room}</div>
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
        </div>
      )}

      {/* Failed Bookings Section */}
      {failedBookings.length > 0 && (
        <div className="mt-6 bg-red-100 p-4 rounded">
          <h3 className="text-lg font-semibold text-red-700 mb-2">🚨 Failed Scheduling Attempts:</h3>
          <ul className="list-disc list-inside">
            {failedBookings.map((failure, index) => (
              <li key={index} className="text-red-700">
                ❌ {failure}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
