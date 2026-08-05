import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const PaymentPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentSent, setPaymentSent] = useState(false); // 🔥 NEW

  const phoneNumber = "8626074005";

  // 🔥 Load saved state (persist after refresh)
  useEffect(() => {
    const stored = localStorage.getItem(`paymentSent_${requestId}`);
    if (stored === "true") {
      setPaymentSent(true);
    }
  }, [requestId]);

  // 🔥 Fetch request
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/${requestId}`);
        setRequest(res.data);
        setAmount(res.data.amount);
        setPaymentStatus(res.data.paymentStatus);
      } catch (err) {
        console.error(err);
        navigate("/user/request");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) fetchRequest();
  }, [requestId, navigate]);

  // 🔥 Auto redirect when confirmed
  useEffect(() => {
    if (paymentStatus === "confirmed") {
      localStorage.removeItem(`paymentSent_${requestId}`); // cleanup
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1500);
    }
  }, [paymentStatus, navigate, requestId]);

  if (loading || !request) {
    return <p className="text-center mt-20">Loading request details...</p>;
  }

  const whatsappMessage = `
Hello, I want to pay for my service request.

Request ID: ${request._id}
Service Address: ${request.address}
Duration: ${request.duration}
Description: ${request.description}
Helper: ${request.helperName} (${request.helperEmail})
Amount: ₹${amount}

Please confirm payment.
  `;

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // 🔥 HANDLE CLICK
  const handlePaymentClick = () => {
    localStorage.setItem(`paymentSent_${requestId}`, "true");
    setPaymentSent(true);
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-pink-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>

        <div className="mb-6 text-left text-gray-700 space-y-1">
          <p><b>Request ID:</b> {request._id}</p>
          <p><b>Service Address:</b> {request.address}</p>
          <p><b>Duration:</b> {request.duration}</p>
          <p><b>Description:</b> {request.description}</p>
          <p><b>Helper:</b> {request.helperName} ({request.helperEmail})</p>
          <p><b>Amount:</b> ₹{amount}</p>
        </div>

        <p className="mb-4">
          Status:{" "}
          <span className="font-bold text-yellow-600">
            {paymentStatus === "pending"
              ? "Pending Admin Verification"
              : "Payment Confirmed"}
          </span>
        </p>

        {/* 🔥 BUTTON OR MESSAGE */}
        {paymentStatus === "pending" && !paymentSent && (
          <button
            onClick={handlePaymentClick}
            className="bg-green-500 text-white px-6 py-3 rounded-xl mb-4"
          >
            Pay via WhatsApp
          </button>
        )}

        {paymentStatus === "pending" && paymentSent && (
          <p className="text-red-600 font-bold mt-4">
            ⚠️ Wait until admin confirms your payment. <br />
            You cannot access the system until admin confirms.
          </p>
        )}

        {paymentStatus === "confirmed" && (
          <button
            onClick={() => navigate("/user/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;