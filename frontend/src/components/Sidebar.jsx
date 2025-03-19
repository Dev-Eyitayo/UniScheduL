import { Link } from "react-router-dom";
import { HomeIcon, BookOpenIcon, ClockIcon, UserIcon, BuildingLibraryIcon, CalendarIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40 ${
      isOpen ? "w-64" : "w-20"
    }`}>
      <div className="flex flex-col h-full">
        
        {/* Sidebar Toggle Button */}
        <button onClick={toggleSidebar} className="p-2 bg-gray-800 hover:bg-gray-700 w-full flex justify-center">
          {isOpen ? "<<" : ">>"}
        </button>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2 py-4">
          <SidebarItem icon={<HomeIcon className="w-6 h-6" />} text="Dashboard" to="/admin" isOpen={isOpen} />
          <SidebarItem icon={<BookOpenIcon className="w-6 h-6" />} text="Manage Courses" to="/admin/courses" isOpen={isOpen} />
          <SidebarItem icon={<BuildingLibraryIcon className="w-6 h-6" />} text="Manage Rooms" to="/admin/rooms" isOpen={isOpen} />
          <SidebarItem icon={<ClockIcon className="w-6 h-6" />} text="Manage Time Slots" to="/admin/timeslots" isOpen={isOpen} />
          <SidebarItem icon={<UserIcon className="w-6 h-6" />} text="Manage Lecturers" to="/admin/lecturers" isOpen={isOpen} />
          <SidebarItem icon={<CalendarIcon className="w-6 h-6" />} text="View Timetable" to="/admin/timetable" isOpen={isOpen} />
          <SidebarItem icon={<AdjustmentsHorizontalIcon className="w-6 h-6" />} text="Optimized Timetable" to="/optimized-timetable" isOpen={isOpen} />
        </nav>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, text, to, isOpen }) {
  return (
    <Link to={to} className="flex items-center p-3 hover:bg-gray-800 rounded-md transition-all duration-300">
      {icon}
      <span className={`ml-3 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 hidden"
      }`}>
        {text}
      </span>
    </Link>
  );
}
