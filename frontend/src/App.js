import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import UserLayout from "./components/UserLayout";
import HelperLayout from "./components/HelperLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PaymentProtectedRoute from "./pages/PaymentProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HelperDashboard from "./pages/HelperDashboard";
import RequestHelper from "./pages/RequestHelper";
import PaymentPage from "./pages/user/PaymentPage";
import FindHelper from "./pages/FindHelper";

import AdminLayout from "./components/AdminLayout";
import AdminUsers from "./pages/AdminUsers";
import AdminHelpers from "./pages/AdminHelpers";
import AdminRequests from "./pages/AdminRequests";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import PaymentVerification from "./pages/admin/PaymentVerification";
import AdminPendingPayments from "./pages/admin/AdminPendingPayments";
import CheckUser from "./pages/CheckUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Auth />} />

        {/* USER ROUTES */}
        <Route
          path="/user"
          element={
            <ProtectedRoutes role="user">
              <UserLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" 
          element={
            <PaymentProtectedRoute>
          <UserDashboard />
          </PaymentProtectedRoute>
          } />
          <Route path="request" 
          element={
            <PaymentProtectedRoute>
              <RequestHelper />
            </PaymentProtectedRoute>
          } />
          <Route path="payment/:requestId" element={<PaymentPage />} />
          <Route path="find-helper" 
          element={
            <PaymentProtectedRoute>
              <FindHelper />
            </PaymentProtectedRoute>
          } />
          {/* <Route index element={<Navigate to="dashboard" />} /> */}
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes role="admin">
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="helpers" element={<AdminHelpers />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="pending-payments" element={<AdminPendingPayments />} />
          <Route path="payment-verification" element={<PaymentVerification />} />
        </Route>

        {/* HELPER ROUTES */}
        <Route
          path="/helper"
          element={
            <ProtectedRoutes role="helper">
              <HelperLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<HelperDashboard />} />
          <Route path="check-user" element={<CheckUser />} />
         
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;