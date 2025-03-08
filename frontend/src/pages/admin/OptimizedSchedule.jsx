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

  // Function to download logs
  const downloadLogs = () => {
    const blob = new Blob([consoleOutput], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "timetable_logs.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to clear the output
  const clearOutput = () => {
    setConsoleOutput("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 Generate Optimized Timetable</h2>
      
      <div className="flex gap-4 mb-4">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={fetchResults}
          disabled={loading}
        >
          {loading ? "Running Algorithm..." : "Generate Schedule"}
        </button>

        {consoleOutput && (
          <>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={downloadLogs}
            >
              Download Logs
            </button>

            <button 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={clearOutput}
            >
              Clear Output
            </button>
          </>
        )}
      </div>

      {consoleOutput && (
        <pre className="bg-black text-green-400 p-4 rounded-lg overflow-auto whitespace-pre-wrap max-h-96">
          {consoleOutput}
        </pre>
      )}
    </div>
  );
}
