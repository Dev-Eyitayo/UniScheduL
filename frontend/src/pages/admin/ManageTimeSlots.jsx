import { useEffect, useState } from "react";

export default function ManageTimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [formData, setFormData] = useState({ course_id: "", day: "Monday", start_time: "", end_time: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchTimeSlots();
    fetchCourses();
  }, []);

  // Fetch all time slots
  const fetchTimeSlots = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
    setFilteredSlots(data);
  };

  // Fetch all courses
  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 📌 Filter time slots based on selected course
  const handleCourseFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
    setFilteredSlots(selected ? timeSlots.filter(slot => slot.course_id === selected) : timeSlots);
};


  // 📌 Handle Form Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:8000/api/timeslots/${editingId}`
      : "http://127.0.0.1:8000/api/timeslots";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchTimeSlots();
      setFormData({ course_id: "", day: "Monday", start_time: "", end_time: "" });
      setIsEditing(false);
    }
  };

  // 📌 Handle Edit Time Slot
  const handleEdit = (slot) => {
    setFormData({ course_id: slot.course_id, day: slot.day, start_time: slot.start_time, end_time: slot.end_time });
    setIsEditing(true);
    setEditingId(slot.id);
  };

  // 📌 Handle Delete Time Slot
  const handleDelete = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/api/timeslots/${id}`, { method: "DELETE" });
    if (res.ok) {
        await fetchTimeSlots(); // Refresh time slot list after deletion
    } else {
        const errorData = await res.json();
        console.error("Error:", errorData.error);
    }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Time Slots</h2>

      {/* Time Slot Form */}
      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <select name="course_id" className="border p-2 rounded" value={formData.course_id} onChange={handleChange} required>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>

        <select name="day" className="border p-2 rounded" value={formData.day} onChange={handleChange}>
          {days.map(day => <option key={day} value={day}>{day}</option>)}
        </select>

        <input type="time" name="start_time" className="border p-2 rounded" value={formData.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" className="border p-2 rounded" value={formData.end_time} onChange={handleChange} required />

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {isEditing ? "Update" : "Add"} Time Slot
        </button>
      </form>

      {/* Course Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Course:</label>
        <select name="filter_course" className="border p-2 rounded" value={selectedCourse} onChange={handleCourseFilterChange}>
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Slots Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSlots.map(slot => (
            <tr key={slot.id}>
              <td>{slot.course_id}</td>
              <td>{courses.find(c => c.id === slot.course_id)?.name || "Unknown"}</td>
              <td>{slot.day}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEdit(slot)}>Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(slot.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
