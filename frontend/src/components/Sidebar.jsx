import { Link } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } min-h-screen p-5`}
      >
        <div className="flex items-center mb-6">
          <h1
            className={`text-2xl font-bold transition-opacity ${
              collapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            Admin Panel
          </h1>
        </div>

        <nav className="space-y-2">
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/admin"
          >
            <HomeIcon className="w-10 h-10" /> {!collapsed && "Dashboard"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/admin/courses"
          >
            <BookOpenIcon className="w-10 h-10" /> {!collapsed && "Manage Courses"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/admin/rooms"
          >
            <BuildingLibraryIcon className="w-10 h-10" /> {!collapsed && "Manage Rooms"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/admin/timeslots"
          >
            <ClockIcon className="w-10 h-10" /> {!collapsed && "Manage Time Slots"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/admin/lecturers"
          >
            <UserIcon className="w-10 h-10" /> {!collapsed && "Manage Lecturers"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md font-bold"
            to="/admin/timetable"
          >
            <CalendarIcon className="w-10 h-10" /> {!collapsed && "View Timetable"}
          </Link>
          <Link
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
            to="/optimized-timetable"
          >
            <AdjustmentsHorizontalIcon className="w-10 h-10" /> {!collapsed && "Optimized Timetable"}
          </Link>
        </nav>
      </aside>

      {/* Sidebar Toggle Button - Stays Visible */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 right-[-15px] bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition"
      >
        {collapsed ? "▶" : "◀"}
      </button>
    </div>
  );
}
