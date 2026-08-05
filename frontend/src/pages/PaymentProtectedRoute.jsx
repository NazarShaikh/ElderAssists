import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../services/api";

const PaymentProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [latestRequest, setLatestRequest] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const res = await api.get("/requests/latest");

        if (res.data && res.data._id) {
          setLatestRequest(res.data);
        } else {
          setLatestRequest(null);
        }
      } catch (err) {
        console.log("No request found");
        setLatestRequest(null);
      } finally {
        setLoading(false);
      }
    };

    checkPayment();
  }, [location.pathname]); // 🔥 IMPORTANT CHANGE

  if (loading) return <h2>Checking access...</h2>;

  // 🔥 BLOCK ALL USER PAGES IF PAYMENT IS PENDING
  if (
    latestRequest &&
    latestRequest.paymentStatus === "pending"
  ) {
    // allow ONLY payment page
    if (!location.pathname.includes("/user/payment")) {
      return <Navigate to={`/user/payment/${latestRequest._id}`} replace />;
    }
  }

  return children;
};

export default PaymentProtectedRoute;