import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import PublicLayout from "./components/PublicLayout"; // NEW
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout> <Home /> </PublicLayout>} />
          <Route path="/dashboard" element={<PublicLayout> <Dashboard /> </PublicLayout>} />
          <Route path="/login" element={<PublicLayout> <Login /> </PublicLayout>} />
          <Route path="/signup" element={<PublicLayout> <Signup /> </PublicLayout>} />

          {/* Admin Routes (Handled by AdminLayout) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageRooms />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageCourses />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lecturers"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageLecturers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/timeslots"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ManageTimeSlots />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/timetable"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <WeeklyTimetable />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/optimized-timetable"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <OptimizedSchedule />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/generate-pdf"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <GeneratePDF />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>

    </Router>
  );
}
