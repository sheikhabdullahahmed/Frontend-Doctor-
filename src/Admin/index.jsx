

import React, { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, FileText, Activity, CheckCircle, Trash2, XCircle, Clock, UserPlus, Mail, Phone, Stethoscope, User, LogOut } from "lucide-react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [caseRecords, setCaseRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors");
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
  });

  const navigate = useNavigate()

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchAppointments();
    fetchCaseRecords();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${BASE_URL}/doctors`);
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${BASE_URL}/patients`);
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/appointments`);
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchCaseRecords = async () => {
    try {
      const res = await fetch(`${BASE_URL}/all`);
      const data = await res.json();
      setCaseRecords(data);
    } catch (error) {
      console.error("Error fetching case records:", error);
    }
  };

  
  const deleteDoctor = async (id) => {
    try {
      await fetch(`${BASE_URL}/doctors/${id}`, { method: "DELETE" });
      setDoctors(doctors.filter(d => d._id !== id));
      setMessage({ type: "success", text: "Doctor deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      setMessage({ type: "error", text: "Failed to delete doctor" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const deletePatient = async (id) => {
    try {
      await fetch(`${BASE_URL}/patients/${id}`, { method: "DELETE" });
      setPatients(patients.filter(p => p._id !== id));
      setMessage({ type: "success", text: "Patient deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setMessage({ type: "error", text: "Failed to delete patient" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await fetch(`${BASE_URL}/appointments/${id}`, { method: "DELETE" });
      setAppointments(appointments.filter(a => a._id !== id));
      setMessage({ type: "success", text: "Appointment deleted successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setMessage({ type: "error", text: "Failed to delete appointment" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleNewDoctorChange = (e) => {
    setNewDoctorData({ ...newDoctorData, [e.target.name]: e.target.value });
  };


 const handleCreateDoctor = async (e) => {
    e.preventDefault();

    if (
      !newDoctorData.name ||
      !newDoctorData.email ||
      !newDoctorData.phone ||
      !newDoctorData.password ||
      !newDoctorData.specialization
    ) {
      setMessage({ type: "error", text: "All fields are required!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoctorData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Doctor created successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);

        setNewDoctorData({
          name: "",
          email: "",
          phone: "",
          password: "",
          specialization: "",
        });
        setShowCreateDoctor(false);
        fetchDoctors();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create doctor",
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      setMessage({ type: "error", text: "Failed to create doctor" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

   const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout",  {}, { withCredentials: true });
      setMessage({ type: "success", text: "Logged out successfully!" });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
  
      console.log("Logged out and cookie cleared");
  
    } catch (err) {
      console.error("Error clearing cookie:", err);
    }
  }





  const deleteCaseRecord = async (id) => {
  try {
    const res = await axios.delete(`http://localhost:5000/delete/${id}`, {
      withCredentials: true, // agar token cookies mein hai
    });
    console.log("suuces")

    // toast.success(res.data.message || "Record deleted successfully!");
  } catch (err) {
    console.error(err);
    // toast.error(
    //   err.response?.data?.message || "Error deleting record. Try again."
    // );
  }
};

  const stats = [
    { 
      title: "Total Doctors", 
      value: doctors.length, 
      icon: UserCheck, 
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      title: "Total Patients", 
      value: patients.length, 
      icon: Users, 
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    { 
      title: "Appointments", 
      value: appointments.length, 
      icon: Calendar, 
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    { 
    title: "Total Cases", 
    value: caseRecords.length, 
    icon: FileText, 
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 rounded-xl p-2">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your healthcare system
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Create Doctor Button */}
        <button
          onClick={() => setShowCreateDoctor(!showCreateDoctor)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden xs:inline">Create Doctor</span>
        </button>

        {/* Admin Info - hidden on very small screens */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-800">Administrator</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xs:inline">Logout</span>
        </button>
      </div>
    </div>
  </div>
</div>


      {/* Create Doctor Modal */}
      {showCreateDoctor && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 rounded-xl p-2">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Create New Doctor</h3>
              </div>
              <button
                onClick={() => setShowCreateDoctor(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={newDoctorData.name}
                    onChange={handleNewDoctorChange}
                    placeholder="Dr. John Doe"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={newDoctorData.email}
                    onChange={handleNewDoctorChange}
                    placeholder="doctor@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={newDoctorData.phone}
                    onChange={handleNewDoctorChange}
                    placeholder="03xx-xxxxxxx"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={newDoctorData.password}
                    onChange={handleNewDoctorChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="specialization"
                    value={newDoctorData.specialization}
                    onChange={handleNewDoctorChange}
                    placeholder="e.g., Cardiologist, Dermatologist, Pediatrician"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <button
                  onClick={handleCreateDoctor}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Doctor Account
                </button>
                 
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Alert */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className={`flex items-center gap-3 p-4 rounded-xl ${
            message.type === "success" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 p-2">
            <div className="flex gap-2">
              {["doctors", "patients", "appointments", "cases"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Tab */}
          {activeTab === "doctors" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  Doctors Management
                </h2>
                <span className="text-sm text-gray-500">{doctors.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {doctors.map((doc) => (
                      <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {doc.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Dr {doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.specialization}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{doc.email}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            doc.status === "approved" 
                              ? "bg-green-50 text-green-700 border border-green-200" 
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}>
                            {doc.status === "approved" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {doc.status !== "approved" && (
                            //   <button
                            //     onClick={() => approveDoctor(doc._id)}
                            //     className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                            //   >
                            //     <CheckCircle className="w-4 h-4" />
                            //     Approve
                            //   </button>
                            
                            <button
                              onClick={() => deleteDoctor(doc._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === "patients" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Patients Management
                </h2>
                <span className="text-sm text-gray-500">{patients.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {patients.map((pat) => (
                      <tr key={pat._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {pat.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{pat.name}</p>
                              <p className="text-xs text-gray-500">{pat.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{pat.email}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => deletePatient(pat._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Appointments Management
                </h2>
                <span className="text-sm text-gray-500">{appointments.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {a.doctorId?.name?.charAt(0)}
                            </div>
                            <p className="font-semibold text-gray-800">{a.doctorId?.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {a.patientId?.name?.charAt(0)}
                            </div>
                            <p className="font-semibold text-gray-800">{a.patientId?.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{a.date.slice(0,10)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => deleteAppointment(a._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Case Records Tab */}
          {activeTab === "cases" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Case Records Management
                </h2>
                <span className="text-sm text-gray-500">
                  {caseRecords.length} total
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Diagnosis
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Treatment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {caseRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                              {record.patientId?.name?.charAt(0) || "P"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {record.patientId?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {record.patientId?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {record.diagnosis || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {record.treatment || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => deleteCaseRecord(record._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;