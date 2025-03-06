import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">UniSchedul</h1>
        <div className="hidden md:flex gap-6">
          <Link className="text-white hover:underline" to="/">Home</Link>
          <Link className="text-white hover:underline" to="/dashboard">Dashboard</Link>
          <Link className="text-white hover:underline" to="/login">Login</Link>
        </div>

        {/* Mobile Menu */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col bg-blue-500 p-3">
          <Link className="text-white py-2" to="/">Home</Link>
          <Link className="text-white py-2" to="/dashboard">Dashboard</Link>
          <Link className="text-white py-2" to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
}
