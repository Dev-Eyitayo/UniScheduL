import React, { useEffect, useState } from "react";
import { fetchLecturers, addLecturer, updateLecturer, deleteLecturer } from "../../api";


export default function ManageLecturers() {
    const [lecturers, setLecturers] = useState([]);
    const [newLecturer, setNewLecturer] = useState({ name: "", department: "" });
    const [editingLecturer, setEditingLecturer] = useState(null);

    useEffect(() => {
        loadLecturers();
    }, []);

    async function loadLecturers() {
        const data = await fetchLecturers();
        setLecturers(data);
    }

    async function handleAddLecturer() {
        await addLecturer(newLecturer);
        setNewLecturer({ name: "", department: "" });
        loadLecturers();
    }

    async function handleUpdateLecturer() {
        if (editingLecturer) {
            await updateLecturer(editingLecturer.id, editingLecturer);
            setEditingLecturer(null);
            loadLecturers();
        }
    }

    async function handleDeleteLecturer(id) {
        await deleteLecturer(id);
        loadLecturers();
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Lecturers</h1>

            {/* Add Lecturer Form */}
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Name"
                    className="border px-2 py-1"
                    value={newLecturer.name}
                    onChange={(e) => setNewLecturer({ ...newLecturer, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Department"
                    className="border px-2 py-1"
                    value={newLecturer.department}
                    onChange={(e) => setNewLecturer({ ...newLecturer, department: e.target.value })}
                />
                <button onClick={handleAddLecturer} className="bg-green-500 text-white px-3 w-[100px] py-1">Add</button>
            </div>

            {/* Lecturer Table */}
            <table className="min-w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Department</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lecturers.map((lecturer) => (
                        <tr key={lecturer.id} className="text-center">
                            <td className="border px-4 py-2">{lecturer.id}</td>
                            <td className="border px-4 py-2">
                                {editingLecturer?.id === lecturer.id ? (
                                    <input
                                        type="text"
                                        value={editingLecturer.name}
                                        onChange={(e) => setEditingLecturer({ ...editingLecturer, name: e.target.value })}
                                    />
                                ) : (
                                    lecturer.name
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editingLecturer?.id === lecturer.id ? (
                                    <input
                                        type="text"
                                        value={editingLecturer.department}
                                        onChange={(e) => setEditingLecturer({ ...editingLecturer, department: e.target.value })}
                                    />
                                ) : (
                                    lecturer.department
                                )}
                            </td>
                            <td className="border px-4 py-2 flex justify-center gap-2">
                                {editingLecturer?.id === lecturer.id ? (
                                    <button onClick={handleUpdateLecturer} className="bg-blue-500 text-white px-3 py-1">Save</button>
                                ) : (
                                    <button onClick={() => setEditingLecturer(lecturer)} className="bg-yellow-500 text-white px-3 py-1">Edit</button>
                                )}
                                <button onClick={() => handleDeleteLecturer(lecturer.id)} className="bg-red-500 text-white px-3 py-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
