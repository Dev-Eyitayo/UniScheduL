import React, { useState } from "react";

export default function OptimizedSchedule() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const runAlgorithm = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/run-algorithm");
      if (!res.ok) throw new Error("Failed to run the algorithm");

      const data = await res.json();
      setLogs(data.logs);  // <-- Store logs in state
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Run Scheduling Algorithm</h2>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={runAlgorithm}
        disabled={loading}
      >
        {loading ? "Running Algorithm..." : "Run Algorithm"}
      </button>

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
    </div>
  );
}
