// src/layouts/RootLayout.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-slate-400 md:scrollbar-thumb-transparent md:hover:scrollbar-thumb-slate-400">
          <Outlet context={{ isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
