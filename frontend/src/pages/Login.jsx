import { useState } from "react";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <label className="block mb-2">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded-md mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="primary">Login</Button>
      </div>
    </div>
  );
}
