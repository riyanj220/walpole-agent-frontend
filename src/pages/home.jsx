// src/pages/home.jsx

import { useState } from "react";
import { Sparkles, SendHorizontal } from "lucide-react";

// (Header and ExamplePrompts components remain the same)
// ...
const Header = () => (
  <header className="text-center mb-10">{/* ... (no changes) ... */}</header>
);

const ExamplePrompts = ({ onPromptClick }) => {
  // ... (no changes) ...
  return (
    <div className="max-w-4xl mx-auto w-full">{/* ... (no changes) ... */}</div>
  );
};

/**
 * ChatInput Component
 * 1. Accept `isSidebarOpen` as a prop
 */
const ChatInput = ({ onSend, isSidebarOpen }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSend(query);
      setQuery("");
    }
  };

  return (
    // 2. Sticky footer container with dynamic classes
    <footer
      className={`fixed bottom-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300
      
      {/* Mobile (default): Full width */}
      left-0
      
      {/* Desktop (md:): Adjusts left margin based on sidebar state */}
      ${isSidebarOpen ? "md:left-64" : "md:left-20"}
      `}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-3xl items-center gap-3 p-4"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about probability or statistics..."
          className="flex-1 rounded-lg border-2 border-transparent bg-gray-100 px-5 py-3 transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-green-500 p-3 text-white shadow-md transition-colors duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Send message"
        >
          <SendHorizontal className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
};

/**
 * Main Home Component
 * 3. Accept `isSidebarOpen` as a prop
 */
function Home({ isSidebarOpen }) {
  const handlePromptClick = (prompt) => {
    console.log("Example prompt clicked:", prompt);
  };

  const handleSend = (message) => {
    console.log("Message sent:", message);
  };

  return (
    // 4. Removed min-h-screen, as App.jsx now controls the height
    <div className="flex flex-col items-center justify-center p-6 pb-32 font-sans">
      {/* pb-32 (padding-bottom) is important to prevent the 
        fixed ChatInput bar from hiding the last bits of content.
      */}

      <main className="w-full max-w-4xl">
        <Header />
        <ExamplePrompts onPromptClick={handlePromptClick} />
      </main>

      {/* 5. Pass `isSidebarOpen` down to the ChatInput */}
      <ChatInput onSend={handleSend} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default Home;
