// Navbar.jsx
import { Link } from "react-router-dom"
import LogoLight from "../assets/logo.svg" // A white/light version of your logo
import { useState } from "react"

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Side: Logo + (optional) brand text */}
        <div className="flex items-center space-x-2">
          {/* Hamburger button only if you want to toggle the sidebar from the navbar */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-800 md:hidden"
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={LogoLight}
              alt="UniScheduL Logo"
              className="h-8 w-auto navbar-logo"
            />
            {/* Visible on md+ screens */}
            <span className="hidden md:inline-block text-xl font-semibold">
              UniScheduL
            </span>
          </Link>
        </div>

        {/* Right Side: Nav links */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/home"
            className="px-3 py-2 hover:bg-gray-800 rounded-md transition"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="px-3 py-2 hover:bg-gray-800 rounded-md transition"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="px-3 py-2 hover:bg-gray-800 rounded-md transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
