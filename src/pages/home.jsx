import { useState, useRef, useEffect } from "react";
import { SendHorizontal, User, Bot } from "lucide-react";

const Header = () => (
  <header className="text-center mb-10">
    <h1 className="text-4xl font-bold text-gray-900 mb-3">
      Welcome to Stats Advisor
    </h1>
    <p className="text-lg text-gray-600 max-w-xl mx-auto">
      Your AI-powered study companion for probability and statistics. Ask me
      anything about concepts from the Walpole textbook.
    </p>
  </header>
);

const ExamplePrompts = ({ onPromptClick }) => {
  const prompts = [
    "Explain Bayes' Theorem with a simple example",
    "What is a p-value and how do I interpret it?",
    "Help me understand the Central Limit Theorem",
    "What's the difference between Type I and Type II errors?",
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <p className="text-center text-gray-500 mb-4">Try these examples:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="text-left text-black p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Chat Input Component (from your code) ---
// This is always visible at the bottom

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
    <footer
      className={`fixed bottom-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300
      left-0
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
          className="flex-1 text-black rounded-lg border-2 border-transparent bg-gray-100 px-5 py-3 transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
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

// --- NEW: Chat Messages Components ---
// These are shown when there *are* messages

/**
 * Renders a single chat message
 */
const ChatMessage = ({ message }) => {
  const { role, content } = message;
  const isUser = role === "user";
  const isBot = role === "assistant";

  return (
    // A single message row
    <div
      className={`flex gap-4 p-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Bot Icon */}
      {isBot && (
        <div className="flex-shrink-0 bg-green-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-green-600" />
        </div>
      )}

      {/* Message Content Bubble */}
      <div
        className={`max-w-xl p-4 rounded-lg ${
          isUser
            ? "bg-teal-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
        }`}
      >
        {/* You can use a Markdown renderer here for bot responses */}
        {content}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="flex-shrink-0 bg-gray-200 p-2 rounded-full h-10 w-10 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-700" />
        </div>
      )}
    </div>
  );
};

/**
 * Renders the list of chat messages
 */
const ChatMessages = ({ messages }) => {
  // 3. Create a ref for the end of the messages
  const endOfMessagesRef = useRef(null);

  // 4. Add an effect to scroll to the ref whenever messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto w-full">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {/* 5. Add an empty div at the end to act as the scroll target */}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

// --- Main Home Component (The Orchestrator) ---

function Home({ isSidebarOpen }) {
  // State to hold the chat messages.
  const [messages, setMessages] = useState([]);

  const handlePromptClick = (prompt) => {
    console.log("Example prompt clicked:", prompt);
    // When a prompt is clicked, just send it as a message
    handleSend(prompt);
  };

  const handleSend = (message) => {
    console.log("Message sent:", message);

    // Add the user's message to the state
    const userMessage = { id: Date.now(), role: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // --- In a real app, you would make an API call here ---
    // For this demo, we'll just add a fake bot response after 1 second
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: `I'm processing your question about: "${message}"`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className="h-full relative">
      {/* This is the scrollable content area.
        It uses 'overflow-y-auto' to scroll *if* content is long.
        'h-full' makes it fill its parent.
      */}
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-slate-400 md:scrollbar-thumb-transparent md:hover:scrollbar-thumb-slate-400">
        {/* This inner div has the padding.
          'p-4' and 'md:p-8' match the padding we removed from App.jsx.
          'pb-32' gives extra space at the bottom so the last message
          isn't hidden by the ChatInput bar.
        */}
        <div className="p-1 md:p-8 pb-[100px] lg:pb-[100px]">
          {messages.length === 0 ? (
            // --- STATE 1: No messages (Show Welcome Screen) ---
            // This is what you see on load
            <div className="flex flex-col items-center justify-center pt-10">
              <Header />
              <ExamplePrompts onPromptClick={handlePromptClick} />
            </div>
          ) : (
            // --- STATE 2: Has messages (Show Chat List) ---
            // This is shown after you send a message
            <ChatMessages messages={messages} />
          )}
        </div>
      </div>

      {/* The ChatInput is outside the scrollable area and is fixed.
       */}
      <ChatInput onSend={handleSend} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default Home;
