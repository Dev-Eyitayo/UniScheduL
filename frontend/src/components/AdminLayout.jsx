import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  // Control sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar with dynamic width */}
      <Sidebar isOpen={sidebarOpen} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Fixed Navbar at the top */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main content with padding to prevent overlap */}
        <main className="p-4 pt-16 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
}
