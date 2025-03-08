import React, { useState } from "react";

export default function OptimizedSchedule() {
  const [consoleOutput, setConsoleOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/run-algorithm");
      const data = await res.json();
      setConsoleOutput(data.console_output);
    } catch (error) {
      console.error("Error fetching algorithm results:", error);
      setConsoleOutput("❌ Failed to load scheduling results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Generate Optimized Timetable</h2>
      
      <button 
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={fetchResults}
        disabled={loading}
      >
        {loading ? "Running Algorithm..." : "Generate Schedule"}
      </button>

      {consoleOutput && (
        <pre className="bg-black text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
          {consoleOutput}
        </pre>
      )}
    </div>
  );
}
