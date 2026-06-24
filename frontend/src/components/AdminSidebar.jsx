




// import { Link, useNavigate, useLocation } from "react-router-dom";

// const AdminSidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const links = [
//     { name: "Dashboard", path: "/admin/dashboard" },
//     { name: "Users", path: "/admin/users" },
//     { name: "Helpers", path: "/admin/helpers" },
//     { name: "Requests", path: "/admin/requests" },
//     { name: "Audit Logs", path: "/admin/audit-logs" },
//     { name: "Payment Verification", path: "/admin/payment-verification" },
//   ];

//   return (
//     <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-r from-[#8A1D53] to-[#F28C28] text-white p-6 flex flex-col shadow-2xl">
      
//       {/* Logo */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold tracking-wide">ElderAssist</h1>
//         <p className="text-sm text-blue-100 mt-1">Admin Control Panel</p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex flex-col gap-2">
//         {links.map((link) => {
//           const active = location.pathname === link.path;
//           return (
//             <Link
//               key={link.name}
//               to={link.path}
//               className={`px-4 py-3 rounded-xl font-medium transition-all
//                 ${active
//                   ? "bg-white text-indigo-700 shadow"
//                   : "hover:bg-white/20"}
//               `}
//             >
//               {link.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <button
//         onClick={logout}
//         className="mt-auto bg-red-500 hover:bg-red-600 transition rounded-xl py-3 font-semibold"
//       >
//         Logout
//       </button>
//     </aside>
//   );
// };

// export default AdminSidebar;






















import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Helpers", path: "/admin/helpers" },
    { name: "Requests", path: "/admin/requests" },
    { name: "Audit Logs", path: "/admin/audit-logs" },
    { name: "Payment Verification", path: "/admin/payment-verification" },
  ];

  return (
  <>
  {/* Overlay */}
  {open && (
    <div
      className="fixed inset-0 bg-black/40 md:hidden"
      onClick={() => setOpen(false)}
    />
  )}

  <aside
    className={`
      fixed top-0 left-0 w-64 h-screen z-50
      bg-gradient-to-r from-[#8A1D53] to-[#F28C28]
      text-white p-6 flex flex-col shadow-2xl
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
    `}
  >
    {/* Close button mobile */}
    <button
      onClick={() => setOpen(false)}
      className="md:hidden mb-4"
    >
      ✕
    </button>

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold">ElderAssist</h1>
          <p className="text-sm text-orange-100">Admin Panel</p>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl transition
                  ${active
                    ? "bg-white text-[#8A1D53]"
                    : "hover:bg-white/20"}
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-auto bg-red-500 hover:bg-red-600 rounded-xl py-3"
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;