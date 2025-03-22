import { useEffect, useState } from "react";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", capacity: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Edit Room
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:5000/api/rooms/${formData.id}`
      : "http://127.0.0.1:5000/api/rooms";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, capacity: formData.capacity }),
      });

      setFormData({ id: "", name: "", capacity: "" });
      setIsEditing(false);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  // Edit Room
  const handleEdit = (room) => {
    setFormData(room);
    setIsEditing(true);
  };

  // Delete Room
  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/rooms/${id}`, { method: "DELETE" });
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Rooms</h2>

      {/* Room Form */}
      <form className="mb-6 flex gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Room Name"
          className="border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          className="border p-2 rounded"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          {isEditing ? "Update Room" : "Add Room"}
        </button>
      </form>

      {/* Rooms Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border">
              <td className="border p-2">{room.id}</td>
              <td className="border p-2">{room.name}</td>
              <td className="border p-2">{room.capacity}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(room)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(room.id)} className="bg-red-500 text-white px-3 py-1 rounded">
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
