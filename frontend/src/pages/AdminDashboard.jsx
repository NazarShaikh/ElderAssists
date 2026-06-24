import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyRequests, setWeeklyRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
    fetchWeeklyRequests();
  }, []);

  // Fetch main dashboard stats
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Dashboard data:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response || err.message);
      alert("Failed to fetch dashboard data");
    }
  };

  // Fetch weekly requests for the chart
  const fetchWeeklyRequests = async () => {
    try {
      const res = await api.get("/admin/stats/weekly-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Weekly Requests:", res.data);
      setWeeklyRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Weekly requests fetch error:", err.response || err.message);
    }
  };

  if (!stats)
    return <p className="text-center mt-10 text-gray-700">Loading dashboard...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Weekly Requests Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Weekly Requests
        </h2>
        {weeklyRequests.length === 0 ? (
          <p className="text-gray-500">No request data available for this week.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={weeklyRequests}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F59E0B"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.users || 0} color="text-indigo-600" />
        <StatCard title="Total Helpers" value={stats.helpers || 0} color="text-green-600" />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests || 0}
          color="text-yellow-600"
        />
      </div>

      {/* Request Status + Pending Payments */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests || 0}
          color="text-yellow-500"
        />
        <StatCard
          title="Accepted Requests"
          value={stats.acceptedRequests || 0}
          color="text-blue-500"
        />
        <StatCard
          title="Completed Requests"
          value={stats.completedRequests || 0}
          color="text-green-500"
        />
        {/* Pending Payments Card */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition-all">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Pending Payments</h3>
          <p className="text-3xl font-bold text-orange-500">
            {stats.pendingPayments || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition-all">
    <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;
