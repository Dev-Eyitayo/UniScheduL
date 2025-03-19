import Navbar from "./Navbar";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (fixed position) */}
      <Navbar />
      
      {/* Ensure content starts below the navbar */}
      <main className="pt-16 p-6 bg-gray-100 flex-1">
        {children}
      </main>
    </div>
  );
}
