// src/App.jsx

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";

function App() {
  // 1. Add state for the sidebar (closed by default)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 2. Create a function to toggle the state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 3. Pass state and toggle function to the Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* 4. Add a backdrop for mobile (dims the background) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* 5. Main content wrapper that gets "pushed" by the sidebar */}
      {/*
        - On mobile (default): No padding, sidebar is an overlay.
        - On desktop (md:): 'pl-20' (80px) when closed, 'pl-64' (256px) when open.
      */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        {/* 6. Pass toggle function to Navbar for the mobile menu button */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* 7. Main content area */}
        <main className="flex-1 p-4 md:p-8">
          {/* 8. Pass state to Home so it can adjust the chat input bar */}
          <Home isSidebarOpen={isSidebarOpen} />
        </main>
      </div>
    </div>
  );
}

export default App;
