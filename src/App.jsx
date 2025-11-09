import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isSidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        {/* 7. Main content area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-slate-400 md:scrollbar-thumb-transparent md:hover:scrollbar-thumb-slate-400">
          <Home isSidebarOpen={isSidebarOpen} />
        </main>
      </div>
    </div>
  );
}

export default App;
