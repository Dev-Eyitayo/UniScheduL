import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageTimeSlots from "./pages/admin/ManageTimeSlots";
import ManageLecturers from "./pages/admin/ManageLecturers";
import WeeklyTimetable from "./pages/admin/WeeklyTimetable";
import OptimizedSchedule from "./pages/admin/OptimizedSchedule";
import GeneratePDF from "./pages/admin/GeneratePDF";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<ManageRooms />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/lecturers" element={<ManageLecturers />} />
            <Route path="/admin/timeslots" element={<ManageTimeSlots />} />
            <Route path="/admin/timetable" element={<WeeklyTimetable />} />
            <Route path="/optimized-timetable" element={<OptimizedSchedule />} />
            <Route path="/generate-pdf" element={<GeneratePDF />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
