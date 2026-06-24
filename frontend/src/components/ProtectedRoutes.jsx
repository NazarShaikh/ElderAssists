// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Please login first");
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    alert("Unauthorized access");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
