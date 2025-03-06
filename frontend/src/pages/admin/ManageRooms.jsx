import { useState } from "react";
import RoomForm from "../../components/RoomForm";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([
    { room_id: 1, name: "Physics Lab 1", capacity: 80 },
    { room_id: 2, name: "Lecture Hall A", capacity: 150 },
    { room_id: 3, name: "Main Auditorium", capacity: 300 },
  ]);

  const [editingRoom, setEditingRoom] = useState(null);

  const handleAddRoom = (room) => {
    setRooms([...rooms, { ...room, room_id: rooms.length + 1 }]);
  };

  const handleEditRoom = (updatedRoom) => {
    setRooms(rooms.map((room) => (room.room_id === updatedRoom.room_id ? updatedRoom : room)));
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId) => {
    setRooms(rooms.filter((room) => room.room_id !== roomId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Rooms</h1>
      
      {/* Room Form */}
      <RoomForm 
        onAddRoom={handleAddRoom} 
        onEditRoom={handleEditRoom} 
        editingRoom={editingRoom} 
      />

      {/* Room List */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Room ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Capacity</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room_id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{room.room_id}</td>
              <td className="border border-gray-300 px-4 py-2">{room.name}</td>
              <td className="border border-gray-300 px-4 py-2">{room.capacity}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => setEditingRoom(room)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteRoom(room.room_id)}
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
