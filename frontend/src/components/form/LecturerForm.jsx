import { useState } from "react";
import axios from "axios";

export default function LecturerForm({ onLecturerAdded }) {
  const [lecturerID, setLecturerID] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  // Department options
  const departments = ["Physics", "Mathematics", "Computer Science", "Engineering"];

  // Handle Adding Lecturer
  const handleAddLecturer = () => {
    if (!lecturerID || !name || !department) {
      alert("All fields are required!");
      return;
    }

    axios.post("http://127.0.0.1:5000/lecturers", {
      lecturer_id: lecturerID,
      name: name,
      department: department,
    })
    .then((response) => {
      onLecturerAdded(response.data);
      setLecturerID("");
      setName("");
      setDepartment("");
    })
    .catch((error) => console.error("Error adding lecturer:", error));
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex gap-4">
      <input
        type="text"
        placeholder="Lecturer ID"
        className="border p-2 rounded flex-1"
        value={lecturerID}
        onChange={(e) => setLecturerID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lecturer Name"
        className="border p-2 rounded flex-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="border p-2 rounded flex-1"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleAddLecturer}
      >
        Add Lecturer
      </button>
    </div>
  );
}
