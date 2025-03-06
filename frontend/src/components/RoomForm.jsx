import { useState, useEffect } from "react";

export default function RoomForm({ onAddRoom, onEditRoom, editingRoom }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (editingRoom) {
      setName(editingRoom.name);
      setCapacity(editingRoom.capacity);
    }
  }, [editingRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !capacity) return alert("All fields are required!");

    const newRoom = { room_id: editingRoom?.room_id || null, name, capacity: parseInt(capacity) };

    if (editingRoom) {
      onEditRoom(newRoom);
    } else {
      onAddRoom(newRoom);
    }

    setName("");
    setCapacity("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold">{editingRoom ? "Edit Room" : "Add Room"}</h2>
      
      <div className="mb-2">
        <label className="block text-sm font-medium">Room Name</label>
        <input 
          type="text" 
          className="w-full border rounded px-2 py-1" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Capacity</label>
        <input 
          type="number" 
          className="w-full border rounded px-2 py-1" 
          value={capacity} 
          onChange={(e) => setCapacity(e.target.value)} 
        />
      </div>

      <button 
        type="submit" 
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {editingRoom ? "Update Room" : "Add Room"}
      </button>
    </form>
  );
}
