import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GeneratePDF() {
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generatePDF = async () => {
    setLoading(true);

    // Fetch scheduling data
    const scheduleRes = await fetch("http://127.0.0.1:5000/api/run-algorithm");
    const scheduleData = await scheduleRes.json();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester,
          academic_year: academicYear,
          department,
          schedule: scheduleData.bookings,
          failed_bookings: scheduleData.failed_bookings,
        }),
      });

      if (res.ok) {
        // Convert response into a downloadable file
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Schedule.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Generate Schedule PDF</h2>

      {/* User Input Fields */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Semester (e.g., Fall 2025)"
          className="border px-4 py-2 rounded mr-2"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Academic Year (e.g., 2025/2026)"
          className="border px-4 py-2 rounded mr-2"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Department (e.g., Physics)"
          className="border px-4 py-2 rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>

      {/* Buttons: Generate PDF & Go Back */}
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
          onClick={generatePDF}
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Generate & Download PDF"}
        </button>

        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/optimized-timetable")}
        >
          ⬅️ Back to Scheduling
        </button>
      </div>
    </div>
  );
}
