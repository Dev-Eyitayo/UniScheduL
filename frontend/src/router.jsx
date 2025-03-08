import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import OptimizedSchedule from "./pages/admin/OptimizedSchedule";

const AppRouter = () => {
  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/optimized-timetable" element={<OptimizedSchedule />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
