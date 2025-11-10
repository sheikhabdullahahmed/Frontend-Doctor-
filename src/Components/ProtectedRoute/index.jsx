// import React from "react";
// import { Navigate } from "react-router-dom";

// // role: "doctor", "patient", "admin"
// const ProtectedRoute = ({ children, role }) => {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role"); // store role in localStorage after login

//   if (!token) {
//     // Not logged in
//     return <Navigate to="/" replace />;
//   }

//   if (role && role !== userRole) {
//     // Logged in but wrong role
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
