import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/icon.png";

export default function Navbar({ toggleSidebar }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-md transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-6">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-800">
          <Bars3Icon className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="hidden md:inline-block text-xl font-semibold">UniScheduL</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {isAuthenticated ? (
                <>
                  <Link to="/admin" className="flex items-center gap-1 hover:text-blue-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 3h18v4H3zM4 9h16v11H4z" />
                    </svg>
                    Dashboard
                  </Link>

                  <button
                    onClick={confirmLogout}
                    className="flex items-center gap-1 hover:text-red-400 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
                    </svg>
                    Logout
                  </button>
                </>
                ) : (
                <>
                  <Link to="/" className="flex items-center gap-1 hover:text-blue-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 9.75L12 4l9 5.75M3 9.75V18l9 5.25L21 18V9.75" />
                    </svg>
                    Home
                  </Link>

                  <Link to="/signup" className="flex items-center gap-1 hover:text-green-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 4v16m8-8H4" />
                    </svg>
                    Sign Up
                  </Link>

                  <Link to="/login" className="flex items-center gap-1 hover:text-yellow-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6 15l6 6 6-6M12 21V9" />
                    </svg>
                    Login
                  </Link>
                </>
              )}
        </div>

      </div>
    </nav>
  );
}
