import { useEffect, useState } from "react";
import authFetch from "../../utils/authFetch";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    level: 100,
    num_students: 0,
    lecturer_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const levels = [100, 200, 300, 400, 500, 600];

  // Fetch Courses & Lecturers
  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/courses");

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Course fetch error:", err);
      setCourses([]); // prevent blank page crash
    }
  };
  

  const fetchLecturers = async () => {
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/lecturers");
      setLecturers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lecturer fetch error:", err);
      setLecturers([]);
    }
  };
  

  // Handle form change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  

  // Add or Edit Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:8000/api/courses/${formData.id}`
      : "http://127.0.0.1:8000/api/courses";
  
    await authFetch(url, {
      method,
      body: JSON.stringify(formData),
    });
  
    setFormData({
      id: "",
      name: "",
      level: 100,
      num_students: 0,
      lecturer_id: "",
    });
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
    await authFetch(`http://127.0.0.1:8000/api/courses/${id}`, {
      method: "DELETE",
    });
    fetchCourses();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Manage Courses</h2>

      {/* Course Form */}
      <form className="mb-6 flex gap-4 flex-wrap" onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="Course Code"
          className="border p-2 rounded w-40"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          className="border p-2 rounded flex-1"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select
          name="level"
          className="border p-2 rounded w-20"
          value={formData.level}
          onChange={handleChange}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="num_students"
          placeholder="No. of Students"
          className="border p-2 rounded w-32"
          value={formData.num_students}
          onChange={handleChange}
          required
        />
        <select
          name="lecturer_id"
          className="border p-2 rounded w-40"
          value={formData.lecturer_id}
          onChange={handleChange}
        >
          <option value="">Select Lecturer</option>
          {lecturers.map((lect) => (
            <option key={lect.id} value={lect.id}>
              {lect.name}
            </option>
          ))}
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {isEditing ? "Update" : "Add"} Course
        </button>
      </form>

      {/* Courses Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Level</th>
            <th className="border px-4 py-2">Students</th>
            <th className="border px-4 py-2">Lecturer</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border">
              <td className="border px-4 py-2">{course.id}</td>
              <td className="border px-4 py-2">{course.name}</td>
              <td className="border px-4 py-2">{course.level}</td>
              <td className="border px-4 py-2">{course.num_students}</td>
              <td className="border px-4 py-2">
                {lecturers.find(l => l.id === course.lecturer)?.name || "N/A"}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
