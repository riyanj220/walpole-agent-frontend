import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Settings,
  Menu,
  X,
  LogOut,
  LogIn,
  History,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import supabase from "../api/supabaseClient";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  // Track which chat has its menu open (by ID)
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Ref to handle clicking outside the menu to close it
  const menuRef = useRef(null);

  // 1. Fetch Chat History
  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching chats:", error);
      else setChats(data);
    };

    fetchChats();
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleNewChat = () => {
    navigate("/"); // Navigate to root without params to reset
  };

  const handleChatClick = (chatId) => {
    navigate(`/?chatId=${chatId}`); // Update URL to trigger Home.jsx reload
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the chat selection

    // Optimistic update: Remove from UI immediately
    setChats(chats.filter((c) => c.id !== chatId));
    setActiveMenuId(null);

    const { error } = await supabase.from("chats").delete().eq("id", chatId);

    if (error) {
      console.error("Error deleting chat:", error);
      // Optional: Re-fetch or revert if critical
    } else {
      // If we deleted the currently active chat, go to new chat
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.get("chatId") === chatId) {
        navigate("/");
      }
    }
  };

  const toggleMenu = (e, chatId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === chatId ? null : chatId);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-30 flex h-screen flex-col justify-between bg-slate-100 p-4 shadow-lg transition-all duration-300
      w-64 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 ${isSidebarOpen ? "md:w-64" : "md:w-20"}
      `}
    >
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header Section */}
        <div
          className={`mb-6 flex items-center ${
            isSidebarOpen ? "justify-between" : "justify-center"
          } md:justify-start`}
        >
          <button
            onClick={toggleSidebar}
            className="hidden cursor-pointer rounded p-2 text-slate-700 hover:bg-slate-200 md:block"
          >
            <Menu className="h-6 w-6" />
          </button>

          <button
            onClick={toggleSidebar}
            className="rounded p-2 text-slate-700 cursor-pointer hover:bg-slate-200 md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
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

        {/* Previous Conversations */}
        {/* Previous Conversations - Horizontal Slide Animation */}
        <div
          className={`flex flex-col flex-1 min-h-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? "opacity-100 translate-x-0 pt-6" // Open: Visible, aligned, spaced top
              : "opacity-0 -translate-x-4 pt-0 basis-0" // Closed: Invisible, slightly left, collapsed
          }`}
        >
          <h3 className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 text-left">
            Previous Conversations
          </h3>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-slate-400">
            {user ? (
              <ul className="flex flex-col gap-1 pb-4">
                {chats.length === 0 && (
                  <li className="text-xs text-slate-400 p-2 italic">
                    No history yet.
                  </li>
                )}
                {chats.map((chat) => (
                  <li key={chat.id} className="relative">
                    <div
                      onClick={() => handleChatClick(chat.id)}
                      className="group flex items-center justify-between cursor-pointer gap-3 rounded-md p-2 text-slate-700 hover:bg-slate-200"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="text-sm truncate">
                          {chat.title || "Untitled Chat"}
                        </span>
                      </div>

                      {/* 3 Dots Menu Button */}
                      <button
                        onClick={(e) => toggleMenu(e, chat.id)}
                        className="cursor-pointer opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-300 rounded transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>

                    {/* Dropdown Menu */}
                    {activeMenuId === chat.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-8 z-50 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
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
      </div>

      {/* Bottom Section */}
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
