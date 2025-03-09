import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GeneratePDF() {
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState([]);
  const [failedBookings, setFailedBookings] = useState([]);

  useEffect(() => {
    // Retrieve the stored schedule and failed bookings
    setSchedule(JSON.parse(localStorage.getItem("schedule") || "[]"));
    setFailedBookings(JSON.parse(localStorage.getItem("failedBookings") || "[]"));
  }, []);

  const generatePDF = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semester,
          academic_year: academicYear,
          department,
          schedule,
          failed_bookings: failedBookings,
        }),
      });

      if (res.ok) {
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

      <div className="mb-4">
        <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className="border px-4 py-2 rounded mr-2" />
        <input type="text" placeholder="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="border px-4 py-2 rounded mr-2" />
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} className="border px-4 py-2 rounded" />
      </div>

      <button onClick={generatePDF} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2">
        {loading ? "Generating PDF..." : "Generate & Download PDF"}
      </button>

      <button onClick={() => navigate("/optimized-timetable")} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
        ⬅️ Back to Scheduling
      </button>
    </div>
  );
}
