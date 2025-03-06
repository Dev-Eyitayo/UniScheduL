import { useState } from "react";
import LecturerForm from "../../components/form/LecturerForm";

export default function ManageLecturers() {
  const [lecturers, setLecturers] = useState([
    { lecturer_id: 1, name: "Dr. James Maxwell" },
    { lecturer_id: 2, name: "Prof. Albert Newton" },
    { lecturer_id: 3, name: "Dr. Katherine Johnson" },
  ]);

  const [editingLecturer, setEditingLecturer] = useState(null);

  const handleAddLecturer = (lecturer) => {
    setLecturers([...lecturers, { ...lecturer, lecturer_id: lecturers.length + 1 }]);
  };

  const handleEditLecturer = (updatedLecturer) => {
    setLecturers(lecturers.map((l) => (l.lecturer_id === updatedLecturer.lecturer_id ? updatedLecturer : l)));
    setEditingLecturer(null);
  };

  const handleDeleteLecturer = (lecturerId) => {
    setLecturers(lecturers.filter((l) => l.lecturer_id !== lecturerId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Lecturers</h1>

      {/* Lecturer Form */}
      <LecturerForm 
        onAddLecturer={handleAddLecturer} 
        onEditLecturer={handleEditLecturer} 
        editingLecturer={editingLecturer} 
      />

      {/* Lecturer List */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Lecturer ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => (
            <tr key={lecturer.lecturer_id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{lecturer.lecturer_id}</td>
              <td className="border border-gray-300 px-4 py-2">{lecturer.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => setEditingLecturer(lecturer)}
                >
                  Edit
                </button>
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
