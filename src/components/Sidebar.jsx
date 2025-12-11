import {
  Plus,
  Settings,
  Menu,
  X,
  LogOut,
  LogIn,
  History,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Hardcoded for now, will be fetched from Supabase later
const chatHistory = [
  { id: 1, title: "Bayes' Theorem explanation" },
  { id: 2, title: "P-value interpretation" },
  { id: 3, title: "Central Limit Theorem" },
  { id: 4, title: "Hypothesis testing steps" },
  { id: 5, title: "Type I vs Type II Errors" },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth"); // Optional: Redirect after logout
  };

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
          <span
            className={`truncate transition-opacity ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            New Chat
          </span>
        </button>

        {/* 6. Previous Conversations / Login Prompt */}
        {isSidebarOpen && (
          <div className="mt-6 flex flex-1 flex-col min-h-0">
            <h3
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
              {user ? (
                // SCENARIO A: USER LOGGED IN - SHOW HISTORY
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
                        <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                        <span
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
              ) : (
                // SCENARIO B: USER LOGGED OUT - SHOW LOGIN BUTTON
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <History className="h-8 w-8 text-slate-300" />
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 leading-tight">
                      Sign in to save your chat history
                    </p>
                    <button
                      onClick={() => navigate("/auth")}
                      className="text-xs text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded shadow-sm hover:bg-slate-50 hover:text-teal-600 transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <LogIn className="h-3 w-3" />
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* 9. Bottom Section (Settings or Sign Out) */}
      <div className="shrink-0 border-t border-slate-300 pt-4">
        {user && (
          <button
            onClick={handleSignOut}
            className={`flex w-full items-center gap-3 cursor-pointer rounded-md p-2 text-red-600 hover:bg-red-50 ${
              isSidebarOpen
                ? "justify-start"
                : "justify-center md:justify-start"
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span
              className={`text-sm truncate transition-opacity ${
                isSidebarOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Sign Out
            </span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
