import { useEffect, useState } from "react";
import api from "../services/api";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("http://localhost:5000/api/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data));
  }, []);

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;

    await api.delete(
      `http://localhost:5000/api/admin/request/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Requests</h1>

      <div className="space-y-4">
        {requests.map((r) => (
          <div
            key={r._id}
            className="bg-white p-4 rounded shadow"
          >
            <p><b>User:</b> {r.userName} ({r.userEmail})</p>
            <p><b>Helper:</b> {r.helperName}</p>
            <p><b>Status:</b> {r.status}</p>
            <p><b>Description:</b> {r.description}</p>

            <button
              onClick={() => deleteRequest(r._id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRequests;
