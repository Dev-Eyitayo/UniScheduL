import React, { useEffect, useState } from "react";
import { fetchRooms } from "../../api";

export default function ManageRooms() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        async function loadRooms() {
            const data = await fetchRooms();
            setRooms(data);
        }
        loadRooms();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Rooms</h1>
            <table className="min-w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Capacity</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id} className="text-center">
                            <td className="border px-4 py-2">{room.id}</td>
                            <td className="border px-4 py-2">{room.name}</td>
                            <td className="border px-4 py-2">{room.capacity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
