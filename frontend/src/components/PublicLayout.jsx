import Navbar from "./Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Public Navbar (Visible only for public pages) */}
      <Navbar />
      
      {/* Main content */}
      <main className="p-6 bg-gray-100 flex-1">{children}</main>
    </div>
  );
}
