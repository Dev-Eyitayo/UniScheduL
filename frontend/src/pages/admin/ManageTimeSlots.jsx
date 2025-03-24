import { useEffect, useState } from "react";
import authFetch from "../../utils/authFetch"; // ✅ imported

export default function ManageTimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

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

  // ✅ Fetch time slots using authFetch
  const fetchTimeSlots = async () => {
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/timeslots");
      setTimeSlots(data);
      setFilteredSlots(selectedCourse
        ? data.filter((slot) => slot.course_id === selectedCourse)
        : data
      );
    } catch (err) {
      console.error("Error fetching time slots:", err);
    }
  };

  // ✅ Fetch courses using authFetch
  const fetchCourses = async () => {
    try {
      const data = await authFetch("http://127.0.0.1:8000/api/courses");
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCourseFilterChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
    setFilteredSlots(
      selected ? timeSlots.filter((slot) => slot.course_id === selected) : timeSlots
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:8000/api/timeslots/${editingId}`
      : "http://127.0.0.1:8000/api/timeslots";
  
    const payload = {
      ...formData,
      course_id: parseInt(formData.course_id),
    };
  
    console.log("Sending data to backend:", payload);
  
    try {
      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: formData.course_id,  // this is key! use 'course' not 'course_id'
          day: formData.day,
          start_time: formData.start_time,
          end_time: formData.end_time,
        }),
      });
  
      setFormData({
        course_id: "",
        day: "Monday",
        start_time: "",
        end_time: "",
      });
      setIsEditing(false);
      fetchTimeSlots();
    } catch (err) {
      console.error("Error saving time slot:", err.response?.data || err);
    }
  };
  
  

  const handleEdit = (slot) => {
    setFormData({
      course_id: slot.course_id,
      day: slot.day,
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
    setIsEditing(true);
    setEditingId(slot.id);
  };

  const handleDelete = async (id) => {
    try {
      await authFetch(`http://127.0.0.1:8000/api/timeslots/${id}`, {
        method: "DELETE",
      });
      fetchTimeSlots();
    } catch (err) {
      console.error("Error deleting time slot:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Time Slots</h2>

      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <select
          name="course_id"
          className="border p-2 rounded"
          value={formData.course_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>

        <select
          name="day"
          className="border p-2 rounded"
          value={formData.day}
          onChange={handleChange}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="time"
          name="start_time"
          className="border p-2 rounded"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="end_time"
          className="border p-2 rounded"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {isEditing ? "Update" : "Add"} Time Slot
        </button>
      </form>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Course:</label>
        <select
          name="filter_course"
          className="border p-2 rounded"
          value={selectedCourse}
          onChange={handleCourseFilterChange}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.id} - {course.name}
            </option>
          ))}
        </select>
      </div>

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
          {filteredSlots.map((slot) => (
            <tr key={slot.id}>
              <td>{slot.course_id}</td>
              <td>{courses.find((c) => c.id === slot.course_id)?.name || "Unknown"}</td>
              <td>{slot.day}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleEdit(slot)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(slot.id)}
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
