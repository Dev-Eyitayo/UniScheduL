import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    setError("");
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.detail || "Login failed.");
      }
  
      // ✅ Map the data properly for your login()
      login(
        {
          tokens: {
            access: data.access,
            refresh: data.refresh,
          },
          user: data.user,
        },
        rememberMe
      );
  
      navigate("/admin");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="form-checkbox text-blue-600 rounded"
            />
            <span>Remember Me</span>
          </label>
        </div>



        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
