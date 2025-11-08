// src/components/Sidebar.jsx

import {
  Plus,
  MessageCircle,
  Settings,
  Menu, // For the desktop toggle
  X, // For the mobile close button
} from "lucide-react";

// (Your chatHistory array remains the same)
const chatHistory = [
  { id: 1, title: "Bayes' Theorem explanation" },
  { id: 2, title: "P-value interpretation" },
  { id: 3, title: "Central Limit Theorem" },
  { id: 4, title: "Hypothesis testing steps" },
  { id: 5, title: "Type I vs Type II Errors" },
  { id: 6, title: "Understanding Confidence Intervals" },
  { id: 7, title: "Understanding Confidence Intervals" },
  { id: 8, title: "Understanding Confidence Intervals" },
  { id: 9, title: "Understanding Confidence Intervals" },
  { id: 10, title: "Understanding Confidence Intervals" },
  { id: 11, title: "Understanding Confidence Intervals" },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-30 flex h-screen flex-col justify-between bg-slate-100 p-4 shadow-lg transition-all duration-300
      
      {/* Mobile (default): Overlay drawer */}
      w-64 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      
      {/* Desktop (md:): Fixed, expanding bar */}
      md:translate-x-0 ${isSidebarOpen ? "md:w-64" : "md:w-20"}
      `}
    >
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* 3. Header Section (Toggle + New Chat) */}
        <div
          className={`mb-6 flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          } md:justify-start`}
        >
          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden cursor-pointer rounded p-2 text-slate-700 hover:bg-slate-200 md:block"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={toggleSidebar}
            className="rounded p-2 text-slate-700 hover:bg-slate-200 md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 4. New Chat Button */}
        <button
          className={`flex w-full items-center gap-2 cursor-pointer rounded-lg bg-teal-600 py-3 px-4 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-teal-700
          ${isSidebarOpen ? "justify-start" : "justify-center"}
          `}
        >
          <Plus className="h-5 w-5 shrink-0 pl-0.5" />
          {/* 5. Conditionally render text */}
          <span
            className={`truncate transition-opacity ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            New Chat
          </span>
        </button>

        {/* 6. Previous Conversations */}
        {isSidebarOpen && (
          <div className="mt-6 flex flex-1 flex-col min-h-0">
            {/* 7. Conditionally render heading */}
            <h3
              // ---------------------------------------------------------------
              // FIX 2 (Continued):
              // 1. Added `truncate` to clip "Previous Conversations".
              // 2. Removed `md:hidden` from the conditional classes.
              // ---------------------------------------------------------------
              className={`truncate text-xs font-semibold uppercase tracking-wider text-slate-500 transition-all ${
                isSidebarOpen
                  ? "mb-3 text-left"
                  : "mb-0 text-center text-[10px]"
              }`}
            >
              {isSidebarOpen && "Previous Conversations"}
            </h3>

            <nav
              className={`flex-1 overflow-y-auto overflow-x-hidden pr-2 ${
                isSidebarOpen
                  ? "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-slate-400 md:scrollbar-thumb-transparent md:hover:scrollbar-thumb-slate-400"
                  : "scrollbar-none"
              }`}
            >
              <ul className="flex flex-col gap-1">
                {chatHistory.map((chat) => (
                  <li key={chat.id}>
                    <a
                      href="#"
                      className={`group flex items-center gap-3 rounded-md p-2 text-slate-700 hover:bg-slate-200 ${
                        isSidebarOpen
                          ? "justify-start"
                          : "justify-center md:justify-start"
                      }`}
                    >
                      <span
                        // -----------------------------------------------------
                        // FIX 2 (Continued):
                        // 1. Changed `transition-all` to `transition-opacity` to be specific.
                        // 2. Removed `md:hidden`. The `truncate` class (which
                        //    you already had) will handle the clipping.
                        // -----------------------------------------------------
                        className={`text-sm truncate transition-opacity ${
                          isSidebarOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {chat.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* 9. Bottom Section (Settings) */}
      <div className="shrink-0 border-t border-slate-300 pt-4">
        <a
          href="#"
          className={`flex items-center gap-3 rounded-md p-2 text-slate-700 hover:bg-slate-200 ${
            isSidebarOpen ? "justify-start" : "justify-center md:justify-start"
          }`}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span
            // ---------------------------------------------------------------
            // FIX 2 (Continued):
            // 1. Added `truncate`
            // 2. Removed `md:hidden`
            // ---------------------------------------------------------------
            className={`text-sm truncate transition-opacity ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Settings
          </span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
