import React, { useEffect, useState } from "react";
import { fetchLecturers } from "../../api";

export default function ManageLecturers() {
    const [lecturers, setLecturers] = useState([]);

    // Fetch lecturers when component loads
    useEffect(() => {
        async function loadLecturers() {
            const data = await fetchLecturers();
            setLecturers(data);
        }
        loadLecturers();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Lecturers</h1>
            <table className="min-w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {lecturers.map((lecturer) => (
                        <tr key={lecturer.id} className="text-center">
                            <td className="border px-4 py-2">{lecturer.id}</td>
                            <td className="border px-4 py-2">{lecturer.name}</td>
                            <td className="border px-4 py-2">{lecturer.department}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
