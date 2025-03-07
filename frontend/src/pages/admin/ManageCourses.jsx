import { useEffect, useState } from "react";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    id: "", name: "", level: 100, num_students: 0, lecturer_id: "", time_slots: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const levels = [100, 200, 300, 400, 500, 600];

  // Fetch Courses & Lecturers
  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  const fetchLecturers = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/lecturers");
    const data = await res.json();
    setLecturers(data);
  };

  // Handle form change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add or Edit Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:5000/api/courses/${formData.id}`
      : "http://127.0.0.1:5000/api/courses";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ id: "", name: "", level: 100, num_students: 0, lecturer_id: "", time_slots: [] });
    setIsEditing(false);
    fetchCourses();
  };

  // Edit Course
  const handleEdit = (course) => {
    setFormData(course);
    setIsEditing(true);
  };

  // Delete Course
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>

      {/* Course Form */}
      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <input type="text" name="id" placeholder="Course Code" className="border p-2 rounded" value={formData.id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Course Name" className="border p-2 rounded" value={formData.name} onChange={handleChange} required />
        
        <select name="level" className="border p-2 rounded" value={formData.level} onChange={handleChange}>
          {levels.map(level => <option key={level} value={level}>{level}</option>)}
        </select>

        <input type="number" name="num_students" placeholder="Students" className="border p-2 rounded" value={formData.num_students} onChange={handleChange} required />
        
        <select name="lecturer_id" className="border p-2 rounded" value={formData.lecturer_id} onChange={handleChange}>
          {lecturers.map(lect => <option key={lect.id} value={lect.id}>{lect.name}</option>)}
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">{isEditing ? "Update" : "Add"} Course</button>
      </form>

      {/* Courses Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200"><th>Code</th><th>Name</th><th>Level</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id} className="border">
              <td>{course.id}</td><td>{course.name}</td><td>{course.level}</td>
              <td>
                <button onClick={() => handleEdit(course)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(course.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
