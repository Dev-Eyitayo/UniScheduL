import { Link } from "react-router-dom"
import {
  HomeIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline"
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
import { createContext, useContext, useState } from "react"

// Create a context to manage the sidebar's expansion state
const SidebarContext = createContext()

export default function CombinedSidebar() {
  // `expanded` controls whether the sidebar is open or collapsed
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="h-screen bg-gray-900 text-white">
      <nav className="h-full flex flex-col border-r border-gray-700">
        {/* Header Section (Logo or Title + Collapse Button) */}
        <div className="p-4 flex items-center justify-between">
          {/* You can swap this out for an <img> if you prefer a logo */}
          <h1
            className={`text-2xl font-bold overflow-hidden transition-all duration-300
              ${expanded ? "w-auto" : "w-0"}
            `}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        {/* Provide the `expanded` state via Context */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1">
            <SidebarItem
              icon={<HomeIcon className="w-6 h-6" />}
              text="Dashboard"
              to="/admin"
            />
            <SidebarItem
              icon={<BookOpenIcon className="w-6 h-6" />}
              text="Manage Courses"
              to="/admin/courses"
            />
            <SidebarItem
              icon={<BuildingLibraryIcon className="w-6 h-6" />}
              text="Manage Rooms"
              to="/admin/rooms"
            />
            <SidebarItem
              icon={<ClockIcon className="w-6 h-6" />}
              text="Manage Time Slots"
              to="/admin/timeslots"
            />
            <SidebarItem
              icon={<UserIcon className="w-6 h-6" />}
              text="Manage Lecturers"
              to="/admin/lecturers"
            />
            <SidebarItem
              icon={<CalendarIcon className="w-6 h-6" />}
              text="View Timetable"
              to="/admin/timetable"
            />
            <SidebarItem
              icon={<AdjustmentsHorizontalIcon className="w-6 h-6" />}
              text="Optimized Timetable"
              to="/optimized-timetable"
            />
          </ul>
        </SidebarContext.Provider>

        {/* Footer Section (User Profile) */}
        <div className="border-t border-gray-700 p-3 flex items-center">
          {/* Replace with user's actual avatar if available */}
          <img
            src="https://ui-avatars.com/api/?background=0D8ABC&color=fff"
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              overflow-hidden flex items-center justify-between transition-all duration-300
              ${expanded ? "w-48 ml-3" : "w-0 ml-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-400">johndoe@gmail.com</span>
            </div>
            <MoreVertical
              size={20}
              className="ml-2 text-gray-400 cursor-pointer"
            />
          </div>
        </div>
      </nav>
    </aside>
  )
}

/**
 * Individual Sidebar Item
 *
 * Props:
 * - icon: ReactNode (icon component)
 * - text: string (label for the item)
 * - to: string (route path)
 */
function SidebarItem({ icon, text, to }) {
  const { expanded } = useContext(SidebarContext)

  return (
    <li className="group relative my-1">
      <Link
        to={to}
        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors rounded-md"
      >
        {icon}
        {/* The label that appears (or collapses) */}
        <span
          className={`ml-3 overflow-hidden transition-all duration-300
            ${expanded ? "w-40 opacity-100" : "w-0 opacity-0"}
          `}
        >
          {text}
        </span>

        {/* Tooltip that shows on hover if the sidebar is collapsed */}
        {!expanded && (
          <div
            className="
              absolute left-full top-1/2 transform -translate-y-1/2 ml-2
              px-2 py-1 rounded-md bg-gray-800 text-white text-sm
              opacity-0 group-hover:opacity-100 transition-opacity
            "
          >
            {text}
          </div>
        )}
      </Link>
    </li>
  )
}
