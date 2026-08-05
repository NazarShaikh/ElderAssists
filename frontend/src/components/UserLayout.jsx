// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import UserSidebar from "./UserSidebar";

// const UserLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">

//       {/* Navbar */}
//       <div className="fixed top-0 left-0 w-full z-50">
//         <Navbar toggleSidebar={()=>setSidebarOpen(true)}/>
//       </div>

//       <div className="flex ">

//         {/* Desktop Sidebar */}
//         <div className="hidden md:block fixed top-20 left-0 w-64 h-[calc(100vh-80px)] shadow-xl z-40">
//           <UserSidebar />
//         </div>

//         {/* Mobile Sidebar Overlay */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 z-50 md:hidden">
            
//             {/* Dark Overlay */}
//             <div
//               className="absolute inset-0 bg-black/40"
//               onClick={() => setSidebarOpen(false)}
//             ></div>

//             {/* Slide Sidebar */}
//             <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl animate-slide">
              
//               <UserSidebar onLinkClick={() => setSidebarOpen(false)} />
//             </div>
//           </div>
//         )}

     

//         {/* Main Content */}
//         {/* <main className="flex-1 md:ml-64 p-4 sm:p-6 overflow-auto"> */}
//         <main className="flex-1 md:ml-64 mt-20 px-4 sm:px-6 pb-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UserLayout;










import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} />
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed top-20 left-0 w-64 h-[calc(100vh-80px)] shadow-xl z-40">
          <UserSidebar />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            ></div>

            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl animate-slide">
              <UserSidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 mt-20 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;