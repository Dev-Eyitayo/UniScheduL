import { useEffect, useState } from "react";

export default function OptimizedSchedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOptimizedSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/run-algorithm");
      const data = await res.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Optimized Schedule</h2>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={fetchOptimizedSchedule}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate Optimized Timetable"}
      </button>

      {/* Show results in console format */}
      {schedule && (
        <pre className="bg-gray-100 p-4 rounded border">
          {JSON.stringify(schedule, null, 2)}
        </pre>
      )}
    </div>
  );
}
