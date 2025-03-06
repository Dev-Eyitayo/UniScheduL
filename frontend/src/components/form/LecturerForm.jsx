import { useState, useEffect } from "react";

export default function LecturerForm({ onAddLecturer, onEditLecturer, editingLecturer }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingLecturer) {
      setName(editingLecturer.name);
    }
  }, [editingLecturer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("Lecturer name is required!");

    const newLecturer = { lecturer_id: editingLecturer?.lecturer_id || null, name };

    if (editingLecturer) {
      onEditLecturer(newLecturer);
    } else {
      onAddLecturer(newLecturer);
    }

    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg flex items-center space-x-4">
      <div className="flex-1">
        <label className="block text-sm font-medium">Lecturer Name</label>
        <input 
          type="text" 
          className="w-full border rounded px-2 py-1" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      <button 
        type="submit" 
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {editingLecturer ? "Update Lecturer" : "Add Lecturer"}
      </button>
    </form>
  );
}
