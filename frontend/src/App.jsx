import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import PublicLayout from "./components/PublicLayout"; // NEW
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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout> <Home /> </PublicLayout>} />
        <Route path="/dashboard" element={<PublicLayout> <Dashboard /> </PublicLayout>} />
        <Route path="/login" element={<PublicLayout> <Login /> </PublicLayout>} />

        {/* Admin Routes (Handled by AdminLayout) */}
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
