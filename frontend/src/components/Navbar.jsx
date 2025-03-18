import { Link } from "react-router-dom"
import { useState } from "react"
import Logo from "../assets/default-monochrome.svg"

export default function Navbar() {
  // Example state to demonstrate how you might handle
  // the collapsed / expanded sidebar from the navbar
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <header
      // A cohesive, darker color that matches or complements your sidebar
      className="flex items-center justify-between bg-gray-900 text-white h-16 px-4 shadow-md"
    >
      {/* Left Section: Logo + (Optionally) Title */}
      <div className="flex items-center gap-2">
        {/* If your sidebar uses a button in the navbar, place it here */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 focus:outline-none hover:bg-gray-800 rounded-md md:hidden"
        >
          {/* This could be a hamburger icon, for example: */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo Image */}
        <Link to="/">
          <img
            src={Logo}
            alt="Your Project Logo"
            className="h-8 w-auto" // Adjust sizing as needed
          />
        </Link>

        {/* (Optional) Site/Brand Name */}
        <Link to="/">
          <span className="text-xl font-semibold ml-2 hidden sm:inline-block">
            UniScheduL
          </span>
        </Link>
      </div>

      {/* Right Section: Nav Links (If you have any) */}
      <nav className="flex items-center space-x-4">
        {/* Example links or user info. Replace with your actual routes / content. */}
        <Link
          to="/home"
          className="hover:bg-gray-800 px-3 py-2 rounded-md transition"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="hover:bg-gray-800 px-3 py-2 rounded-md transition"
        >
          Dashboard
        </Link>
        <Link
          to="/login"
          className="hover:bg-gray-800 px-3 py-2 rounded-md transition"
        >
          Login
        </Link>
      </nav>
    </header>
  )
}
