import { useEffect, useState } from "react";

export default function ManageTimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_id: "",
    day: "Monday",
    start_time: "",
    end_time: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchTimeSlots();
    fetchCourses();
  }, []);

  const fetchTimeSlots = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
  };

  const fetchCourses = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Synchronize course selection (either by name or code)
  const handleCourseChange = (e) => {
    const selectedCourse = courses.find(c => c.id === e.target.value);
    setFormData({ ...formData, course_id: selectedCourse ? selectedCourse.id : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:5000/api/timeslots/${editingId}`
      : "http://127.0.0.1:5000/api/timeslots";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      fetchTimeSlots();
      setFormData({ course_id: "", day: "Monday", start_time: "", end_time: "" });
      setIsEditing(false);
    } else {
      alert(result.error);
    }
  };

  const handleEdit = (timeSlot) => {
    setFormData(timeSlot);
    setIsEditing(true);
    setEditingId(timeSlot.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/timeslots/${id}`, { method: "DELETE" });
    fetchTimeSlots();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Time Slots</h2>

      {/* Time Slot Form */}
      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        {/* Course Code Dropdown */}
        <select name="course_id" className="border p-2 rounded" value={formData.course_id} onChange={handleCourseChange} required>
          <option value="">Select Course Code</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>

        {/* Day Selector */}
        <select name="day" className="border p-2 rounded" value={formData.day} onChange={handleChange}>
          {days.map(day => <option key={day} value={day}>{day}</option>)}
        </select>

        <input type="time" name="start_time" className="border p-2 rounded" value={formData.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" className="border p-2 rounded" value={formData.end_time} onChange={handleChange} required />

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {isEditing ? "Update" : "Add"} Time Slot
        </button>
      </form>

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
          {timeSlots.map(slot => (
            <tr key={slot.id} className="border">
              <td>{slot.course_code}</td>
              <td>{slot.course_name}</td>
              <td>{slot.day}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>
                <button onClick={() => handleEdit(slot)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(slot.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
