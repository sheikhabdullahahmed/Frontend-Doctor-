import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Save,
  X,
  LogOut,
  Activity,
  AlertCircle,
  FileText,
  Plus,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [caseRecords, setCaseRecords] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [showCaseRecords, setShowCaseRecords] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    email: "",
  });
  const [caseForm, setCaseForm] = useState({
    patientId: "",
    diagnosis: "",
    prescription: "",
    treatment: "",
    notes: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setDoctor(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctor?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/appointments/doctor/${doctor._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [doctor]);

  // Fetch case records function
  const fetchCaseRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/all", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setCaseRecords(data);
      // console.log("Created At", data);
    } catch (error) {
      console.error("Error fetching case records:", error);
      setMessage({ type: "error", text: "Failed to fetch case records" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  useEffect(() => {
  if (showCaseRecords) {
    fetchCaseRecords();
  }
}, [showCaseRecords]);


  
  

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      setMessage({ type: "success", text: `Appointment ${status}!` });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      const res = await fetch(
        `http://localhost:5000/appointments/doctor/${doctor._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage({ type: "error", text: "Failed to update appointment" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/doctors/update/${doctor._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      setMessage({
        type: "success",
        text: data.message || "Profile updated successfully!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      setDoctor((prev) => ({ ...prev, ...data.doctor }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleCaseChange = (e) => {
    setCaseForm({ ...caseForm, [e.target.name]: e.target.value });
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/patients");
      const data = await res.json();
      console.log("data", data);
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };


  useEffect(() => {
  if (showCaseForm) {
    fetchPatients();
  }
}, [showCaseForm]);

  const handleAddCaseRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(caseForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add case record");
      }

      setMessage({
        type: "success",
        text: data.message || "Case record added successfully",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      setShowCaseForm(false);
      setCaseForm({
        patientId: doctor?.Profile?._id,
        diagnosis: "",
        prescription: "",
        treatment: "",
        notes: "",
      });

      // Refresh case records if the view is open
      if (showCaseRecords) {
        fetchCaseRecords();
      }
    } catch (err) {
      console.error("Error adding record:", err);
      setMessage({ type: "error", text: err.message || "Error adding record" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      setMessage({ type: "success", text: "Logged out successfully!" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const stats = React.useMemo(
    () => [
      {
        title: "Total Appointments",
        value: appointments.length,
        icon: Calendar,
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Pending",
        value: appointments.filter((a) => a.status === "pending").length,
        icon: Clock,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
      },
      {
        title: "Approved",
        value: appointments.filter((a) => a.status === "approved").length,
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Case Records",
        value: caseRecords.length,
        icon: FileText,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
    ],
    [appointments, caseRecords]
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 rounded-xl p-2">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Doctor Dashboard
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage your profile and appointments
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* View Case Records Button */}
              <button
                onClick={() => setShowCaseRecords(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">View Records</span>
              </button>

              {/* Add Case Button */}
              <button
                onClick={() => setShowCaseForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Record</span>
              </button>

              {/* Doctor Info — Hidden on Small Screens */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Welcome back,</p>
                  <p className="font-semibold text-gray-800">{doctor.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {doctor.name?.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Form Modal */}
      {showCaseForm && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 rounded-xl p-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Add Case Record
                </h3>
              </div>
              <button
                onClick={() => setShowCaseForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCaseRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patient
                </label>
                <select
                  name="patientId"
                  value={caseForm.patientId}
                  onChange={handleCaseChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={caseForm.diagnosis}
                  onChange={handleCaseChange}
                  placeholder="Enter diagnosis"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prescription
                </label>
                <textarea
                  name="prescription"
                  value={caseForm.prescription}
                  onChange={handleCaseChange}
                  placeholder="Enter prescription details"
                  rows="3"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment
                </label>
                <textarea
                  name="treatment"
                  value={caseForm.treatment}
                  onChange={handleCaseChange}
                  placeholder="Enter treatment plan"
                  rows="3"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={caseForm.notes}
                  onChange={handleCaseChange}
                  placeholder="Additional notes (optional)"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Case Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowCaseForm(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Case Records Modal */}
      {showCaseRecords && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-xl p-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  All Case Records
                </h3>
              </div>
              <button
                onClick={() => setShowCaseRecords(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {caseRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No case records found
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Add your first case record to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {caseRecords.map((record) => (
                  <div
                    key={record._id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          Patient: {record.patientId?.name || "Unknown Patient"}
                        </h4>
                        {/* <p className="text-sm text-gray-500">
                          Patient ID: {record.patientId?._id || record.patientId}
                        </p> */}
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Diagnosis
                        </p>
                        <p className="text-sm text-gray-800">
                          {record.diagnosis}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Prescription
                        </p>
                        <p className="text-sm text-gray-800">
                          {record.prescription}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Treatment
                        </p>
                        <p className="text-sm text-gray-800">
                          {record.treatment}
                        </p>
                      </div>

                      {record.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-gray-800">
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Alert */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Profile Information
                </h2>
                {!editMode && (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setFormData({
                        name: doctor.name,
                        phone: doctor.phone,
                        specialization: doctor.specialization,
                        email: doctor.email,
                      });
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!editMode ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        Dr {doctor.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-800">
                        {doctor.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-800">
                        {doctor.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Stethoscope className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Specialization</p>
                      <p className="font-semibold text-gray-800">
                        {doctor.specialization || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          doctor.status === "approved"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white py-3 rounded-xl font-semibold hover:bg-gray-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Patient Appointments
                </h2>
                <span className="text-sm text-gray-500">
                  {appointments.length} total
                </span>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No appointments found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Appointments will appear here once patients book
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Patient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map((a) => (
                        <tr
                          key={a._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {a.patientId?.name?.charAt(0) || "P"}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {a.patientId?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {a.patientId?.email || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {a.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {a.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                a.status === "approved"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : a.status === "rejected"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              }`}
                            >
                              {a.status === "approved" && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {a.status === "rejected" && (
                                <XCircle className="w-3 h-3" />
                              )}
                              {a.status === "pending" && (
                                <Clock className="w-3 h-3" />
                              )}
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {a.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateStatus(a._id, "approved")
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatus(a._id, "rejected")
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
