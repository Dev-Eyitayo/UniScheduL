import React, { useEffect, useState } from "react";

export default function ManageLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [courses, setCourses] = useState([]);   // Courses for the selected lecturer

  // For adding/updating a course
  const [courseForm, setCourseForm] = useState({
    course_id: "",
    name: "",
    level: 100,
    num_students: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  // 1) Fetch all lecturers on mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/lecturers");
    const data = await res.json();
    setLecturers(data);
  };

  // 2) When user selects a lecturer, fetch that lecturer's courses
  const handleSelectLecturer = async (lecturer) => {
    setSelectedLecturer(lecturer);
    const res = await fetch(`http://127.0.0.1:5000/api/lecturers/${lecturer.id}/courses`);
    const data = await res.json();
    setCourses(data.courses || []);
    setIsEditing(false);
  };

  // 3) Handle adding or updating a course
  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!selectedLecturer) return alert("Select a lecturer first.");

    if (isEditing) {
      // Update existing
      const url = `http://127.0.0.1:5000/api/lecturers/${selectedLecturer.id}/courses/${courseForm.course_id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        alert("Course updated successfully");
        handleSelectLecturer(selectedLecturer);
      } else {
        alert("Error updating course");
      }
    } else {
      // Add new or reassign existing
      const url = `http://127.0.0.1:5000/api/lecturers/${selectedLecturer.id}/courses`;
      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        alert("Course added/reassigned successfully");
        handleSelectLecturer(selectedLecturer);
      } else {
        alert("Error adding course");
      }
    }
    setCourseForm({ course_id: "", name: "", level: 100, num_students: 0 });
    setIsEditing(false);
  };

  // 4) Edit a course
  const handleEditCourse = (course) => {
    setCourseForm({
      course_id: course.id,
      name: course.name,
      level: course.level,
      num_students: course.num_students,
    });
    setIsEditing(true);
  };

  // 5) Remove a course
  const handleRemoveCourse = async (course) => {
    if(!selectedLecturer) return;
    const confirm = window.confirm(`Remove course ${course.id}?`);
    if (!confirm) return;
    const url = `http://127.0.0.1:5000/api/lecturers/${selectedLecturer.id}/courses/${course.id}`;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      alert("Course removed");
      handleSelectLecturer(selectedLecturer);
    } else {
      alert("Error removing course");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Lecturers</h2>

      {/* Lecturers List */}
      <div className="flex gap-4">
        {/* Left Side: Lecturers */}
        <div className="w-1/3 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Lecturers</h3>
          <ul>
            {lecturers.map(lect => (
              <li key={lect.id}>
                <button
                  className={`block w-full text-left py-1 px-2 hover:bg-gray-200 ${selectedLecturer?.id === lect.id ? "bg-gray-200" : ""}`}
                  onClick={() => handleSelectLecturer(lect)}
                >
                  {lect.name} ({lect.department})
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Selected Lecturer & Courses */}
        <div className="w-2/3 bg-white p-4 rounded">
          {selectedLecturer ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Courses for {selectedLecturer.name}</h3>
              {courses.length === 0 ? (
                <p>No courses assigned.</p>
              ) : (
                <table className="border w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-2 py-1">ID</th>
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">Level</th>
                      <th className="border px-2 py-1">Students</th>
                      <th className="border px-2 py-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td className="border px-2 py-1">{course.id}</td>
                        <td className="border px-2 py-1">{course.name}</td>
                        <td className="border px-2 py-1">{course.level}</td>
                        <td className="border px-2 py-1">{course.num_students}</td>
                        <td className="border px-2 py-1">
                          <button
                            className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                            onClick={() => handleEditCourse(course)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleRemoveCourse(course)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Add / Update Course Form */}
              <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">{isEditing ? "Update Course" : "Add New Course / Reassign"}</h4>
                <form className="flex gap-2 items-center" onSubmit={handleSubmitCourse}>
                  <input
                    type="text"
                    className="border p-2 rounded"
                    placeholder="Course ID"
                    value={courseForm.course_id}
                    onChange={(e) => setCourseForm({ ...courseForm, course_id: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="border p-2 rounded"
                    placeholder="Course Name"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="border p-2 rounded w-20"
                    placeholder="Level"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    className="border p-2 rounded w-20"
                    placeholder="Students"
                    value={courseForm.num_students}
                    onChange={(e) => setCourseForm({ ...courseForm, num_students: Number(e.target.value) })}
                  />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                    {isEditing ? "Update" : "Add"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <p>Select a lecturer to view courses.</p>
          )}
        </div>
      </div>
    </div>
  );
}
