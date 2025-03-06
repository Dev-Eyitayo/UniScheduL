import { useState, useEffect } from "react";
import axios from "axios";
import LecturerForm from "../../components/form/LecturerForm";

export default function ManageLecturers() {
  const [lecturers, setLecturers] = useState([]);

  // Fetch lecturers from API
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/lecturers")
      .then((response) => setLecturers(response.data))
      .catch((error) => console.error("Error fetching lecturers:", error));
  }, []);

  // Update list when a lecturer is added
  const handleLecturerAdded = (newLecturer) => {
    setLecturers([...lecturers, newLecturer]);
  };

  // Handle Deleting Lecturer
  const handleDeleteLecturer = (id) => {
    axios.delete(`http://127.0.0.1:5000/lecturers/${id}`)
      .then(() => setLecturers(lecturers.filter((l) => l.lecturer_id !== id)))
      .catch((error) => console.error("Error deleting lecturer:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Lecturers</h1>

      {/* Lecturer Form */}
      <LecturerForm onLecturerAdded={handleLecturerAdded} />

      {/* Lecturer List */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Lecturer ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => (
            <tr key={lecturer.lecturer_id} className="text-center">
              <td className="border px-4 py-2">{lecturer.lecturer_id}</td>
              <td className="border px-4 py-2">{lecturer.name}</td>
              <td className="border px-4 py-2">{lecturer.department}</td>
              <td className="border px-4 py-2">
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteLecturer(lecturer.lecturer_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
