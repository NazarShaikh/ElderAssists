import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const activeStyle = "bg-blue-600 text-white px-4 py-2 rounded";
  const normalStyle = "text-gray-700 px-4 py-2 rounded hover:bg-gray-200";

  return (
    <div className="w-60 h-screen bg-gray-100 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Helper Panel</h2>
        <nav className="flex flex-col gap-2">
          <NavLink to="/helper/dashboard" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/helper/pending" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
            Pending Requests
          </NavLink>
          <NavLink to="/helper/accepted" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
            Accepted Requests
          </NavLink>
          <NavLink to="/helper/completed" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
            Completed / Cancelled
          </NavLink>
          <NavLink to="/helper/profile" className={({ isActive }) => isActive ? activeStyle : normalStyle}>
            Profile
          </NavLink>
        </nav>
      </div>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
