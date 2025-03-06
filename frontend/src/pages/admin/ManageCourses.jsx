import React, { useEffect, useState } from "react";
import { fetchCourses } from "../../api";

export default function ManageCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        async function loadCourses() {
            const data = await fetchCourses();
            setCourses(data);
        }
        loadCourses();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Courses</h1>
            <table className="min-w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Course Code</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Level</th>
                        <th className="border px-4 py-2">Students</th>
                        <th className="border px-4 py-2">Lecturer</th>
                        <th className="border px-4 py-2">Time Slots</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id} className="text-center">
                            <td className="border px-4 py-2">{course.id}</td>
                            <td className="border px-4 py-2">{course.name}</td>
                            <td className="border px-4 py-2">{course.level}</td>
                            <td className="border px-4 py-2">{course.num_students}</td>
                            <td className="border px-4 py-2">{course.lecturer}</td>
                            <td className="border px-4 py-2">
                                {course.time_slots.map(ts => `${ts.day} (${ts.start}-${ts.end})`).join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
