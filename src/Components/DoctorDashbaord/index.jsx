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
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

function Profile() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    status: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        // const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/doctors/profile", {
          withCredentials: true
          ,
        });
        console.log(res);
        setDoctor(res.data);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/appointments/doctor/${doctor?._id}`,
          // { headers: { Authorization: `Bearer ${token}` } }
          {withCredentials: true}

        );
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    // const token = localStorage.getItem("token");
    // if (doctor?._id && token) {
    fetchAppointments();
    // }
  }, [doctor]);

  const updateStatus = async (id, status) => {
    try {
      // const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/appointments/${id}/status`,
        { status },
        // { headers: { Authorization: `Bearer ${token}` } }
          {withCredentials: true}

      );

      setMessage({ type: "success", text: `Appointment ${status}!` });

      const res = await axios.get(
        `http://localhost:5000/appointments/doctor/${doctor._id}`,
        // { headers: { Authorization: `Bearer ${token}` } }
          {withCredentials: true}

      );

      setAppointments(res.data);
    } catch (err) {
      console.error("Error updating status:", err);
      setMessage({ type: "error", text: "Failed to update appointment" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      

      const res = await axios.put(
        `http://localhost:5000/doctors/update/${doctor._id}`, // remove /:id because backend uses token
        formData,
        {
          withCredentials: true
        }
      );

      setMessage({
        type: "success",
        text: res.data.message || "Profile updated successfully!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      // Update UI with new doctor info
      setDoctor((prev) => ({ ...prev, ...res.data.doctor }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  


 const handleLogout = async () => {
  try {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    setMessage({ type: "success", text: "Logged out successfully!" });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);

    console.log("Logged out and cookie cleared");

  } catch (err) {
    console.error("Error clearing cookie:", err);
  }
}

  

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
        title: "Rejected",
        value: appointments.filter((a) => a.status === "rejected").length,
        icon: XCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-600",
      },
    ],
    [appointments]
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                Doctor Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your profile and appointments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{doctor.name}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                {doctor.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Message */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-8 pt-6">
          <div
            className={`flex items-center gap-3 p-4 rounded-xl shadow-sm ${
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

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Profile Information
                  </h2>
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              
              {!editMode ? (
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">
                        {doctor.name}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">
                        {doctor.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-semibold text-gray-900">
                        {doctor.phone}
                      </p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Specialization</p>
                      <p className="font-semibold text-gray-900">
                        {doctor.specialization || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          doctor.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mt-6"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
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
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>

                
                </div>
              )}
            </div>
          </div>

          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Patient Appointments
                  </h2>
                </div>
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
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {a.patientId?.name?.charAt(0) || "P"}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {a.patientId?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {a.patientId?.email || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {a.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {a.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                                a.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : a.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
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
                          <td className="px-6 py-4">
                            {a.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    updateStatus(a._id, "approved")
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    updateStatus(a._id, "rejected")
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
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
