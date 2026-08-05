// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// const PaymentVerification = () => {
//   const [userPayments, setUserPayments] = useState([]);
//   const [helperPayments, setHelperPayments] = useState([]);

//   // Fetch user pending payments
//   const fetchUserPayments = async () => {
//     try {
//       const res = await api.get("/requests/pending-payments");
//       console.log("Fetched user payments:", res.data);
//       setUserPayments(res.data);
//     } catch (err) {
//       console.error("Error fetching user payments:", err);
//     }
//   };

//   // Fetch helper pending payments
//   const fetchHelperPayments = async () => {
//     try {
//       const res = await api.get("/requests/helper-pending-payments");
//       setHelperPayments(res.data);
//     } catch (err) {
//       console.error("Error fetching helper payments:", err);
//     }
//   };

//   // Confirm user payment
//   const confirmUserPayment = async (id) => {
//     try {
//       await api.put(`/requests/${id}/payment-confirm`);
//       alert("User payment confirmed");
//       fetchUserPayments();
//     } catch (err) {
//       console.error("Error confirming user payment:", err);
//     }
//   };

//   // Confirm helper payment
//   const confirmHelperPayment = async (helperId) => {
//     try {
//       await api.put(`/users/helper/${helperId}/payment-confirm`);
//       alert("Helper payment confirmed");
//       fetchHelperPayments();
//     } catch (err) {
//       console.error("Error confirming helper payment:", err);
//     }
//   };

//   useEffect(() => {
//     fetchUserPayments();
//     fetchHelperPayments();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Pending User Payments</h2>
//       {userPayments.length === 0 && <p>No pending user payments</p>}
//       {userPayments.map((p) => (
//         <div key={p._id} className="border p-4 rounded mb-3">
//           <p><b>User:</b> {p.userName}</p>
//           <p><b>Email:</b> {p.userEmail}</p>
//           <p><b>Amount:</b> ₹{p.amount}</p>
//           <p><b>Request ID:</b> {p._id}</p>
//           <button
//             onClick={() => confirmUserPayment(p._id)}
//             className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
//           >
//             Confirm User Payment
//           </button>
//         </div>
//       ))}

      
//     </div>
//   );
// };

// export default PaymentVerification;