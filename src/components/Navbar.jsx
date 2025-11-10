import { BsChatQuote } from "react-icons/bs";
import { PiUserCircle } from "react-icons/pi";
import { Menu } from "lucide-react"; // 1. Import the Menu icon
import { Link } from "react-router-dom";

// 2. Accept `toggleSidebar` as a prop
const Navbar = ({ toggleSidebar }) => {
  return (
    // 3. Add sticky and z-index to keep it on top of content
    <nav className="sticky top-0 z-10 w-full bg-slate-100/80 px-4 py-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center justify-between">
        {/* 4. Left Side: Logo and Title */}
        <div className="flex items-center gap-3">
          {/* 5. Mobile-only Menu button */}
          <button
            onClick={toggleSidebar}
            className="p-1 text-slate-700 hover:text-slate-900 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <BsChatQuote className="hidden text-3xl text-teal-600 sm:block" />
          <span className="text-xl font-bold text-slate-800">
            Walpole Agent
          </span>
        </div>

        {/* 6. Right Side: Nav Links and User Icon */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            to=""
            className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
          >
            Chat
          </Link>
          {/* <a
            href="#"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
          >
            About
          </a> */}
          <Link to="/auth" className="text-slate-500">
            <PiUserCircle className="text-3xl hover:text-slate-700" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
