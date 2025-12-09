import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { SendHorizontal, User, Bot } from "lucide-react";
import axiosClient from "../api/axiosClient";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const Header = () => (
  <header className="text-center mb-10">
    <h1 className="text-4xl font-bold text-gray-900 mb-3">
      Welcome to Walpole Tutor
    </h1>
    <p className="text-lg text-gray-600 max-w-xl mx-auto">
      Your AI-powered study companion for probability and statistics. Ask me
      anything about concepts from the Walpole textbook.
    </p>
  </header>
);

const ExamplePrompts = ({ onPromptClick }) => {
  const prompts = [
    "Explain Binomial Probability Distribution",
    "What is a exercise 3.4?",
    "Please tell the answer of exercise 4.13",
    "What is conditional probability?",
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <p className="text-center text-gray-500 mb-4">Try these examples:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="text-left text-black cursor-pointer p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
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
          className="flex-1 text-black rounded-lg border-2 border-transparent bg-gray-100 px-5 py-3 transition-all duration-200 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        <button
          type="submit"
          className="rounded-lg bg-teal-600 p-3 cursor-pointer text-white shadow-md hover:bg-teal-700"
        >
          <SendHorizontal className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
};

const ChatMessage = ({ message, isLast }) => {
  const { role, content } = message;
  const isUser = role === "user";
  const [displayedContent, setDisplayedContent] = useState(
    isUser ? content : ""
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    const isUserMessage = role === "user";

    // User messages: no typing effect
    if (isUserMessage) {
      setDisplayedContent(content);
      return;
    }

    // Already animated once for this message
    if (hasAnimated.current) {
      setDisplayedContent(content);
      return;
    }

    let i = 0;
    const len = content.length;
    let hasSeenMath = false; // becomes true after first math block

    const intervalId = setInterval(() => {
      if (i >= len) {
        clearInterval(intervalId);
        hasAnimated.current = true;
        return;
      }

      const ch = content[i];

      // Normal character → type a chunk
      if (ch !== "$") {
        const step = hasSeenMath ? 3 : 1; // faster after math
        i = Math.min(i + step, len);
        setDisplayedContent(content.slice(0, i));
        return;
      }

      // We hit a $ → decide if it's $...$ or $$...$$
      let delim = "$";
      if (i + 1 < len && content[i + 1] === "$") {
        delim = "$$";
      }

      let j = i + delim.length;
      let foundClosing = false;

      while (j < len) {
        if (content.startsWith(delim, j)) {
          j += delim.length; // include closing delimiter
          foundClosing = true;
          break;
        }
        j += 1;
      }

      // If no closing delimiter, treat this '$' as a normal char
      if (!foundClosing) {
        i += 1;
        setDisplayedContent(content.slice(0, i));
        return;
      }

      // Jump over the whole math block and reveal it at once
      hasSeenMath = true;
      i = j;
      setDisplayedContent(content.slice(0, i));
    }, 15);

    return () => clearInterval(intervalId);
  }, [content, role]);

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
        className={`max-w-xl p-4 rounded-lg text-left ${
          isUser
            ? "bg-teal-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
        }`}
      >
        {/* Use ReactMarkdown to render bolding, lists, and newlines correctly */}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
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
  }, [messages, messages.length]); // Scroll when messages change

  return (
    <div className="max-w-3xl mx-auto w-full">
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLast={index === messages.length - 1}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

function normalizeMathMarkdown(text) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();

      // If the whole line is like: $ ... $
      if (
        trimmed.startsWith("$") &&
        trimmed.endsWith("$") &&
        !trimmed.startsWith("$$") &&
        !trimmed.endsWith("$$")
      ) {
        // Convert: $...$  ->  $$...$$
        return trimmed.replace(/^\$(.*)\$/, (_, inner) => `$$${inner}$$`);
      }

      return line;
    })
    .join("\n");
}

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
      const response = await axiosClient.post("/ask/", { query: message });
      console.log(response?.data?.answer);
      const rawAnswer = response?.data?.answer || "Sorry, I didn't get that.";
      const normalizedAnswer = normalizeMathMarkdown(rawAnswer);
      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: normalizedAnswer,
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
