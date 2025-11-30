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
import StudentDashboard from "./components/Dashboard1";

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
        <Route path="/Dashboard1" element={<StudentDashboard />} /></Routes>
    </Router>
  );
}

export default App;
