import React, { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.get("/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      alert("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-800">Loading audit logs...</p>;

  // 🔥 FIXED PERFORMANCE SUMMARY
  const usersLogs = logs.filter(l => l.actorRole === "user");
  const helpersLogs = logs.filter(l => l.actorRole === "helper");

const calcSummary = (arr) => {
  const completed = arr.filter(
    l =>
      l.action === "REQUEST_COMPLETED" ||
      l.relatedRequest?.status === "completed"
  ).length;

  const cancelled = arr.filter(
    l => l.relatedRequest?.status === "cancelled"
  ).length;

  const ratings = arr
    .map(l => l.rating ?? l.relatedRequest?.rating)
    .filter(r => r != null);

  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : "N/A";

  return { completed, cancelled, avgRating };
};

  const userSummary = calcSummary(usersLogs);
  const helperSummary = calcSummary(helpersLogs);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Audit Logs</h1>

      <div className="overflow-x-auto bg-white rounded shadow mb-8">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Actor (Role)</th>
              <th className="px-4 py-3 text-left">Target User</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-400">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">
                    {log.performedBy
                      ? `${log.performedBy.name} (${log.actorRole})`
                      : "System"}
                  </td>
                  <td className="px-4 py-3">
                    {log.targetUser ? log.targetUser.name : "-"}
                  </td>
                  <td className="px-4 py-3">{log.status || "-"}</td>
                  <td className="px-4 py-3">
                    {log.rating ?? log.relatedRequest?.rating ?? "-"}
                  </td>
                  <td className="px-4 py-3">{log.details || "-"}</td>
                  <td className="px-4 py-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Performance Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Users</h3>
          <p>Completed Requests: {userSummary.completed}</p>
          <p>Cancelled Requests: {userSummary.cancelled}</p>
          <p>Average Rating: {userSummary.avgRating}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Helpers</h3>
          <p>Completed Requests: {helperSummary.completed}</p>
          <p>Cancelled Requests: {helperSummary.cancelled}</p>
          <p>Average Rating: {helperSummary.avgRating}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;