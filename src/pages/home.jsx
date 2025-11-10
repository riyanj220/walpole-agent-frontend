// src/pages/Home.jsx
import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { SendHorizontal, User, Bot } from "lucide-react";
import axiosClient from "../api/axiosClient";

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
            className="text-left text-black p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatInput = ({ onSend, isSidebarOpen }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSend(query);
    setQuery("");
  };

  return (
    <footer
      className={`fixed bottom-0 right-0 left-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        isSidebarOpen ? "md:left-64" : "md:left-20"
      }`}
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
          className="rounded-lg bg-green-500 p-3 text-white shadow-md hover:bg-green-600"
        >
          <SendHorizontal className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
};

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  const isUser = role === "user";
  return (
    <div
      className={`flex gap-4 p-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="shrink-0 bg-green-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-green-600" />
        </div>
      )}
      <div
        className={`max-w-xl p-4 rounded-lg ${
          isUser
            ? "bg-teal-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="shrink-0 bg-gray-200 p-2 rounded-full h-10 w-10 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-700" />
        </div>
      )}
    </div>
  );
};

const ChatMessages = ({ messages }) => {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="max-w-3xl mx-auto w-full">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default function Home() {
  const { isSidebarOpen } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePromptClick = (prompt) => handleSend(prompt);

  const handleSend = async (message) => {
    const userMsg = { id: Date.now(), role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);
      const response = await axiosClient.post("", { query: message });
      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: response?.data?.answer || "Sorry, I didn’t get that.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 2,
        role: "assistant",
        content:
          "There was an error connecting to the server. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full relative">
      <div className="h-full overflow-y-auto">
        <div className="p-1 md:p-8 pb-24 lg:pb-[100px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-10">
              <Header />
              <ExamplePrompts onPromptClick={handlePromptClick} />
            </div>
          ) : (
            <ChatMessages messages={messages} />
          )}

          {loading && (
            <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
              Thinking...
            </p>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSend} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}
