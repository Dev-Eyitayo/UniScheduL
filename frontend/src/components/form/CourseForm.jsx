import { useState, useEffect } from "react";

export default function CourseForm({ onAddCourse, onEditCourse, editingCourse }) {
  const levels = [100, 200, 300, 400, 500, 600]; 
  const lecturers = [{ id: 1, name: "Dr. John Doe" }, { id: 2, name: "Prof. Jane Smith" }];

  const [courseCode, setCourseCode] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [numStudents, setNumStudents] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setCourseCode(editingCourse.course_id);
      setName(editingCourse.name);
      setLevel(editingCourse.level);
      setNumStudents(editingCourse.num_students);
      setLecturerId(editingCourse.lecturer_id);
      setTimeSlot(editingCourse.time_slot || "");
    }
  }, [editingCourse]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseCode || !name || !level || numStudents <= 0 || !lecturerId || !timeSlot) {
      return alert("All fields are required and values must be valid!");
    }

    const newCourse = {
      course_id: courseCode,
      name,
      level: parseInt(level),
      num_students: parseInt(numStudents),
      lecturer_id: parseInt(lecturerId),
      time_slot: timeSlot
    };

    if (editingCourse) {
      onEditCourse(newCourse);
    } else {
      onAddCourse(newCourse);
    }

    setCourseCode("");
    setName("");
    setLevel("");
    setNumStudents("");
    setLecturerId("");
    setTimeSlot("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium">Course Code</label>
        <input 
          type="text" 
          className="w-full border rounded px-2 py-1" 
          value={courseCode} 
          onChange={(e) => setCourseCode(e.target.value)} 
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium">Course Name</label>
        <input 
          type="text" 
          className="w-full border rounded px-2 py-1" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium">Level</label>
        <select 
          className="w-full border rounded px-2 py-1" 
          value={level} 
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Select Level</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium">Number of Students</label>
        <input 
          type="number" 
          className="w-full border rounded px-2 py-1" 
          value={numStudents} 
          onChange={(e) => setNumStudents(e.target.value)} 
        />
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium">Lecturer</label>
        <select 
          className="w-full border rounded px-2 py-1" 
          value={lecturerId} 
          onChange={(e) => setLecturerId(e.target.value)}
        >
          <option value="">Select Lecturer</option>
          {lecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {editingCourse ? "Update Course" : "Add Course"}
      </button>
    </form>
  );
}
