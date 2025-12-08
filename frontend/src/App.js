import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Signup from "./components/Signup";
import FacSignup from "./components/FacSignup";
import Login from "./components/Login";
import FacLogin from "./components/FacLogin";
import AdminLogin from "./components/admLogin";
import StudentDashboard from "./components/Dashboard1";
import Logout from "./components/Logout";
import UpDocument from "./components/UpDocument";
import Submissions from "./components/Submissions";
import ViewGrades from "./components/ViewGrades";
import Dashboard2 from "./components/Dashboard2";
import Dashboard3 from "./components/Dashboard3";
import Dashboard4 from "./components/Dashboard4";
import Dashboard5 from "./components/Dashboard5";
import ViewStudents from "./components/ViewStudents";
import ViewSubmissions from "./components/ViewSubmissions";
import SetDeadlines from "./components/setdeadlines";
import ReleaseRes from "./components/ReleaseRes";
import AdminReports from "./components/AdminReports";
import ManageUsers from "./components/ManageUsers";
import MonProgress from "./components/MonProgress";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/student-signup" element={<Signup />} />
        <Route path="/faculty-signup" element={<FacSignup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/facLogin" element={<FacLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/Dashboard1" element={<StudentDashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/upload-document" element={<UpDocument />} />
        <Route path="/submission-history" element={<Submissions />} />
        <Route path="/view-grades" element={<ViewGrades />} />
        <Route path="/Dashboard2" element={<Dashboard2 />} />
        <Route path="/Dashboard3" element={<Dashboard3 />} />
        <Route path="/Dashboard4" element={<Dashboard4 />} />
        <Route path="/Dashboard5" element={<Dashboard5 />} />
        <Route path="/admin-dashboard" element={<Dashboard5 />} />
        <Route path="/view-students" element={<ViewStudents />} />
        <Route path="/view-submissions" element={<ViewSubmissions />} />
        <Route path="/set-deadlines" element={<SetDeadlines />} />
        <Route path="/release-results" element={<ReleaseRes />} />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/monitor-progress" element={<MonProgress />} />
        
      </Routes>
    </Router>
  );
}

export default App;
