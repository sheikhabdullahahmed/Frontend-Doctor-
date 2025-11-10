import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import PatientDashboard from "./Components/Patientdashboard";
import DoctorDashboard from "./Components/DoctorDashbaord";
import Admin from "./Admin/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <div>
      <ToastContainer position="top-center" />

    
    <BrowserRouter>
      <Routes>
        {/* ✅ Direct routes without toggle button */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
