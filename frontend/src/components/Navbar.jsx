import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Logo from "../assets/icon.png";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-md transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-6">
        
        {/* Sidebar Toggle Button */}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800">
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="hidden md:inline-block text-xl font-semibold">UniScheduL</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/admin" className="hover:underline">Dashboard</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
}
