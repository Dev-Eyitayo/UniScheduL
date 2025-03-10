import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OptimizedSchedule() {
  const [logs, setLogs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [failedBookings, setFailedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const runAlgorithm = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/run-algorithm");
      if (!res.ok) throw new Error("Failed to run the algorithm");
      
      const data = await res.json();
      setLogs(data.logs);
      setSchedule(data.bookings);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Run Scheduling Algorithm</h2>

      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          onClick={runAlgorithm}
          disabled={loading}
        >
          {loading ? "Running Algorithm..." : "Run Algorithm"}
        </button>

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

      {logs.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📝 Algorithm Logs:</h3>
          <ul className="list-disc list-inside">
            {logs.map((log, index) => (
              <li key={index} className={log.startsWith("⚠️") ? "text-yellow-600" : log.startsWith("❌") ? "text-red-600" : "text-gray-700"}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}

      {schedule.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📅 Final Room Schedule:</h3>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
            <div key={day} className="mb-4">
              <h4 className="text-lg font-semibold mt-4">{day}</h4>
              <ul className="list-none">
                {schedule
                  .filter((entry) => entry.day === day)
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((entry, index) => (
                    <li key={index} className="border-b py-2">
                      📌 <strong>{entry.start_time} - {entry.end_time}</strong>: {entry.course_name} by {entry.lecturer} → Room: <strong>{entry.room}</strong>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}

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
