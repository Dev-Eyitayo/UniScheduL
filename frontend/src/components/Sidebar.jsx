import { Link } from "react-router-dom";
import { HomeIcon, BookOpenIcon, ClockIcon, UserIcon, BuildingLibraryIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="space-y-2">
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md" to="/admin">
          <HomeIcon className="w-5 h-5" /> Dashboard
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md" to="/admin/courses">
          <BookOpenIcon className="w-5 h-5" /> Manage Courses
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md" to="/admin/rooms">
          <BuildingLibraryIcon className="w-5 h-5" /> Manage Rooms
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md" to="/admin/timeslots">
          <ClockIcon className="w-5 h-5" /> Manage Time Slots
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md" to="/admin/lecturers">
          <UserIcon className="w-5 h-5" /> Manage Lecturers
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md font-bold" to="/admin/timetable">
          <CalendarIcon className="w-5 h-5" /> View Timetable
        </Link>
        
      </nav>
    </aside>
  );
}
