import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
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
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />

        {/* Wrap Admin Routes Inside Layout */}
        <Route path="/admin/*" element={<AdminLayout> <AdminDashboard /> </AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout> <ManageRooms /> </AdminLayout>} />
        <Route path="/admin/courses" element={<AdminLayout> <ManageCourses /> </AdminLayout>} />
        <Route path="/admin/lecturers" element={<AdminLayout> <ManageLecturers /> </AdminLayout>} />
        <Route path="/admin/timeslots" element={<AdminLayout> <ManageTimeSlots /> </AdminLayout>} />
        <Route path="/admin/timetable" element={<AdminLayout> <WeeklyTimetable /> </AdminLayout>} />
        <Route path="/optimized-timetable" element={<AdminLayout> <OptimizedSchedule /> </AdminLayout>} />
        <Route path="/generate-pdf" element={<AdminLayout> <GeneratePDF /> </AdminLayout>} />
      </Routes>
    </Router>
  );
}
