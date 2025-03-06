import { useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");

  const addCourse = () => {
    if (courseName) {
      setCourses([...courses, { name: courseName }]);
      setCourseName("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Courses</h1>
      <div className="flex gap-4">
        <InputField label="Course Name" value={courseName} onChange={setCourseName} />
        <Button onClick={addCourse}>Add Course</Button>
      </div>

      <ul className="mt-6">
        {courses.map((course, index) => (
          <li key={index} className="border-b py-2">{course.name}</li>
        ))}
      </ul>
    </div>
  );
}
