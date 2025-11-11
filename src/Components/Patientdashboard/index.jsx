import React, { useState } from "react";
import {
  User,
  Calendar,
  Clock,
  FileText,
  LogOut,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Users,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Doctor Profile
        const resProfile = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true, // send cookies automatically
        });
        setProfile(resProfile.data);

        console.log(resProfile.data);

        // Doctors List
        const resDoctors = await axios.get(`${BASE_URL}/doctors`, {
          withCredentials: true,
        });
        setDoctors(resDoctors.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };

    fetchData();
  }, []);

  const fetchAppointments = async (patientId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/appointments/patient/${patientId}`,
        {
          withCredentials: true, // optional — agar cookies/session use ho raha hai
        }
      );
      setAppointments(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    if (profile?.profile?._id) {
      fetchAppointments(profile.profile._id);
    }
  }, [profile?.profile?._id]);

  const handleAppointment = async () => {
    if (!selectedDoctor || !date || !time) {
      setMessage({ type: "error", text: "Please fill all required fields!" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies/session info
        body: JSON.stringify({
          doctorId: selectedDoctor,
          patientId: profile?.profile?._id,
          date,
          time,
          description,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Appointment booked successfully!",
        });
        fetchAppointments(profile?.profile?._id);

        // reset form fields
        setSelectedDoctor("");
        setDate("");
        setTime("");
        setDescription("");

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Error booking appointment",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error booking appointment" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      setMessage({ type: "success", text: "Logged out successfully!" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error clearing cookie:", err);
      setMessage({ type: "error", text: "Logout failed!" });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    const icons = {
      approved: <CheckCircle2 className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 rounded-xl p-2">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Patient Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {profile.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 rounded-xl p-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="bg-blue-50 rounded-full p-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Doctors</p>
            <p className="text-3xl font-bold text-gray-800">{doctors.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-50 rounded-xl p-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="bg-purple-50 rounded-full p-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Appointments</p>
            <p className="text-3xl font-bold text-gray-800">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-green-50 rounded-xl p-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="bg-green-50 rounded-full p-2">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-gray-800">
              {appointments.filter((a) => a.status === "approved").length}
            </p>
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Profile Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800">
                      {profile?.profile?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800">
                      {profile?.profile?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-semibold text-gray-800">
                      {profile?.profile?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                My Appointments
              </h2>
              {appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 rounded-full p-2">
                            <Stethoscope className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              Dr. {appt.doctorId?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appt.doctorId?.specialization || "Specialist"}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(appt.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{appt.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{appt.time}</span>
                        </div>
                      </div>
                      {appt.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 flex items-start gap-2">
                            <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{appt.description}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No appointments yet.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Book Appointment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Book Appointment
              </h2>

              <div className="space-y-4">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name} ({doc.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                {/* Appointment Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        const today = new Date().toISOString().split("T")[0]; // today yyyy-mm-dd
                        if (selectedDate < today) {
                          toast.error("You cannot select past date!");
                          setDate(""); // reset field
                        } else {
                          setDate(selectedDate);
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Appointment Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(":");
                        const selectedTime = new Date();
                        selectedTime.setHours(hours, minutes);

                        const now = new Date();
                        if (
                          date === new Date().toISOString().split("T")[0] &&
                          selectedTime < now
                        ) {
                          toast.success("Time cannot be in the past!");
                          setTime("");
                        } else {
                          setTime(e.target.value);
                        }
                      }}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="Describe your problem briefly"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAppointment}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
