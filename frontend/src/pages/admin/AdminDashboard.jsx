import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  BookOpenIcon,
  UserIcon,
  ClockIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentLogs();
  }, []);

  // Fetch stats for dashboard
  const fetchDashboardStats = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/dashboard-stats");
    const data = await res.json();
    setStats(data);
  };

  // Fetch recent logs
  const fetchRecentLogs = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/recent-logs");
    const data = await res.json();
    setLogs(data);
  };

  // 📊 Chart Data
  const barData = {
    labels: ["Courses", "Lecturers", "Rooms", "Time Slots"],
    datasets: [
      {
        label: "Counts",
        data: [stats.courses || 0, stats.lecturers || 0, stats.rooms || 0, stats.timeslots || 0],
        backgroundColor: ["#3b82f6", "#22c55e", "#f97316", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">📊 Dashboard Overview</h2>
      {/* Show Institution name */}
      {user?.institution_name && (
        <p className="text-lg text-gray-600 mb-6">
          Institution: <span className="font-semibold text-gray-800">{user.institution_name}</span>
        </p>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Courses" value={stats.courses} icon={<BookOpenIcon className="w-8 h-8 text-blue-600" />} />
        <StatCard title="Total Lecturers" value={stats.lecturers} icon={<UserIcon className="w-8 h-8 text-green-600" />} />
        <StatCard title="Total Rooms" value={stats.rooms} icon={<BuildingLibraryIcon className="w-8 h-8 text-orange-600" />} />
        <StatCard title="Total Time Slots" value={stats.timeslots} icon={<ClockIcon className="w-8 h-8 text-red-600" />} />
      </div>

      {/* 📊 Bar Chart */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">📈 Scheduling Overview</h3>
        <Bar data={barData} />
      </div>

      {/* 📝 Recent Logs */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">📝 Recent Activities</h3>
        <ul className="list-disc list-inside">
          {logs.length === 0 ? <p>No recent activities.</p> : logs.map((log, index) => (
            <li key={index} className="mb-1">{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 📌 Small Card Component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-xl font-bold">{value || 0}</h3>
      </div>
    </div>
  );
}
