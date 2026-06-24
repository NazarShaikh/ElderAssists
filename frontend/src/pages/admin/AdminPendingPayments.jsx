import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminPendingPayments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    const res = await api.get("/requests/pending-payments");
    setPayments(res.data);
  };

  const confirmPayment = async (id) => {
    await api.put(`/requests/${id}/payment-confirm`);
    alert("Payment confirmed");
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Payments</h2>

      {payments.map((p) => (
        <div key={p._id} className="border p-4 rounded mb-3">
          <p><b>User:</b> {p.userName}</p>
          <p><b>Email:</b> {p.userEmail}</p>
          <p><b>Amount:</b> ₹{p.amount}</p>
          <p><b>Request ID:</b> {p._id}</p>

          <button
            onClick={() => confirmPayment(p._id)}
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
          >
            Confirm Payment
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPendingPayments;
