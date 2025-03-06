import { useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

export default function ManageLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const [lecturerName, setLecturerName] = useState("");
  const [lecturerId, setLecturerId] = useState("");

  const addLecturer = () => {
    if (lecturerName && lecturerId) {
      setLecturers([...lecturers, { id: lecturerId, name: lecturerName }]);
      setLecturerName("");
      setLecturerId("");
    }
  };

  const removeLecturer = (id) => {
    setLecturers(lecturers.filter(lecturer => lecturer.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Lecturers</h1>
      <div className="flex gap-4">
        <InputField label="Lecturer ID" value={lecturerId} onChange={setLecturerId} />
        <InputField label="Lecturer Name" value={lecturerName} onChange={setLecturerName} />
        <Button onClick={addLecturer}>Add Lecturer</Button>
      </div>

      <ul className="mt-6">
        {lecturers.map((lecturer, index) => (
          <li key={index} className="border-b py-2 flex justify-between">
            {lecturer.id} - {lecturer.name}
            <button
              onClick={() => removeLecturer(lecturer.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
