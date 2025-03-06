import { useState } from "react";
import CourseForm from "../../components/form/CourseForm";

export default function ManageCourses() {
  const [courses, setCourses] = useState([
    { course_id: "PHY101", name: "Quantum Mechanics", level: 500, num_students: 120, lecturer_id: 1 },
    { course_id: "PHY102", name: "Electromagnetic Fields", level: 300, num_students: 100, lecturer_id: 2 },
  ]);

  const [editingCourse, setEditingCourse] = useState(null);

  const handleAddCourse = (course) => {
    setCourses([...courses, course]);
  };

  const handleEditCourse = (updatedCourse) => {
    setCourses(courses.map((c) => (c.course_id === updatedCourse.course_id ? updatedCourse : c)));
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((c) => c.course_id !== courseId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Courses</h1>

      {/* Course Form */}
      <CourseForm 
        onAddCourse={handleAddCourse} 
        onEditCourse={handleEditCourse} 
        editingCourse={editingCourse} 
      />

      {/* Course List */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Course Code</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Level</th>
            <th className="border border-gray-300 px-4 py-2">Students</th>
            <th className="border border-gray-300 px-4 py-2">Lecturer</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{course.course_id}</td>
              <td className="border border-gray-300 px-4 py-2">{course.name}</td>
              <td className="border border-gray-300 px-4 py-2">{course.level}</td>
              <td className="border border-gray-300 px-4 py-2">{course.num_students}</td>
              <td className="border border-gray-300 px-4 py-2">{course.lecturer_id}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => setEditingCourse(course)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteCourse(course.course_id)}
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
