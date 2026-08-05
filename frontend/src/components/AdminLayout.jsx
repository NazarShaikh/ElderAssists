// import { Outlet } from "react-router-dom";
// import AdminSidebar from "../components/AdminSidebar";

// const AdminLayout = () => {
//   return (
//     <div className="flex bg-slate-100 min-h-screen">
//       <AdminSidebar />
//       {/* Main content with margin-left = sidebar width */}
//       {/* <div className="ml-64 p-6 min-h-screen bg-gray-100"> */}
//       <div className="ml-64 p-8 w-full">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;







import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-100">
      
      {/* Sidebar */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow">
        <button onClick={() => setOpen(true)}>☰</button>
        <h1 className="font-bold">Admin Panel</h1>
      </div>

      {/* Main Content */}
      <div className="ml-0 md:ml-64 h-screen overflow-y-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;