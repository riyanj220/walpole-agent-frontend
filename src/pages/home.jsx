import { useState, useRef, useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { SendHorizontal, User, Bot, Square } from "lucide-react";
import axiosClient from "../api/axiosClient";
import supabase from "../api/supabaseClient"; // Need Supabase to fetch history
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useAuth } from "../context/AuthContext";

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

const ChatInput = ({ onSend, isSidebarOpen, disabled, onStop, isTyping }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || disabled) return;
    onSend(query);
    setQuery("");
  };

  return (
    <footer
      className={`fixed bottom-0 right-0 left-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        isSidebarOpen ? "md:left-64" : "md:left-20"
      }`}
    >
      <div className="relative mx-auto max-w-3xl p-4">
        {/* Stop Generating Button - Centered above input */}
        {isTyping && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <button
              onClick={onStop}
              className="flex items-center cursor-pointer gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 text-sm font-medium transition-all"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop generating
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              disabled ? "Walpole is typing..." : "Ask a question..."
            }
            disabled={disabled}
            className={`flex-1 text-black rounded-lg border-2 border-transparent bg-gray-100 px-5 py-3 transition-all duration-200 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          <button
            type="submit"
            disabled={disabled || !query.trim()}
            className={`rounded-lg p-3 text-white shadow-md transition-colors ${
              disabled || !query.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 cursor-pointer"
            }`}
          >
            <SendHorizontal className="h-6 w-6" />
          </button>
        </form>
      </div>
    </footer>
  );
};

const ChatMessage = ({
  message,
  isLast,
  onTypingComplete,
  stopTypingRef,
  scrollToBottom,
}) => {
  const { role, content } = message;
  const isUser = role === "user";
  const [displayedContent, setDisplayedContent] = useState(
    isUser ? content : ""
  );
  const hasAnimated = useRef(false);
  const wasStopped = useRef(false);

  // Auto-scroll effect
  useEffect(() => {
    if (isLast && scrollToBottom) {
      scrollToBottom();
    }
  }, [displayedContent, isLast, scrollToBottom]);

  useEffect(() => {
    const isUserMessage = role === "user";

    // If it's a history message (already loaded), don't animate typing
    if (message.noAnimation) {
      setDisplayedContent(content);
      return;
    }

    if (isUserMessage) {
      setDisplayedContent(content);
      return;
    }

    if (hasAnimated.current) {
      if (!wasStopped.current) {
        setDisplayedContent(content);
      }
      return;
    }

    let i = 0;
    const len = content.length;
    let hasSeenMath = false;

    const intervalId = setInterval(() => {
      if (stopTypingRef.current) {
        clearInterval(intervalId);
        hasAnimated.current = true;
        wasStopped.current = true;
        if (isLast) onTypingComplete && onTypingComplete();
        return;
      }

      if (i >= len) {
        clearInterval(intervalId);
        hasAnimated.current = true;
        if (isLast) {
          onTypingComplete && onTypingComplete();
        }
        return;
      }

      const ch = content[i];

      if (ch !== "$") {
        const step = hasSeenMath ? 3 : 1;
        i = Math.min(i + step, len);
        setDisplayedContent(content.slice(0, i));
        return;
      }

      let delim = "$";
      if (i + 1 < len && content[i + 1] === "$") {
        delim = "$$";
      }

      let j = i + delim.length;
      let foundClosing = false;

      while (j < len) {
        if (content.startsWith(delim, j)) {
          j += delim.length;
          foundClosing = true;
          break;
        }
        j += 1;
      }

      if (!foundClosing) {
        i += 1;
        setDisplayedContent(content.slice(0, i));
        return;
      }

      hasSeenMath = true;
      i = j;
      setDisplayedContent(content.slice(0, i));
    }, 15);

    return () => clearInterval(intervalId);
  }, [
    content,
    role,
    isLast,
    onTypingComplete,
    stopTypingRef,
    message.noAnimation,
  ]);

  return (
    <div
      className={`flex gap-4 p-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="hidden md:flex shrink-0 bg-green-100 p-2 rounded-full h-10 w-10 items-center justify-center">
          <Bot className="w-6 h-6 text-green-600" />
        </div>
      )}

      <div
        className={`max-w-xl p-4 rounded-lg text-left ${
          isUser
            ? "bg-teal-600 text-white rounded-br-none"
            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none w-full"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          {!isUser && (
            <div className="float-left mr-3 mb-1 md:hidden bg-green-100 p-1.5 rounded-full h-8 w-8 flex items-center justify-center">
              <Bot className="w-5 h-5 text-green-600" />
            </div>
          )}

          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const ChatMessages = ({
  messages,
  onTypingComplete,
  stopTypingRef,
  scrollToBottom,
}) => {
  return (
    <div className="max-w-3xl mx-auto w-full">
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isLast={index === messages.length - 1}
          onTypingComplete={onTypingComplete}
          stopTypingRef={stopTypingRef}
          scrollToBottom={scrollToBottom}
        />
      ))}
    </div>
  );
};

function normalizeMathMarkdown(text) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("$") &&
        trimmed.endsWith("$") &&
        !trimmed.startsWith("$$") &&
        !trimmed.endsWith("$$")
      ) {
        return trimmed.replace(/^\$(.*)\$/, (_, inner) => `$$${inner}$$`);
      }
      return line;
    })
    .join("\n");
}

export default function Home() {
  const { isSidebarOpen } = useOutletContext();
  const { user } = useAuth();

  // URL Params to check if we are loading an old chat
  const [searchParams] = useSearchParams();
  const urlChatId = searchParams.get("chatId");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chatId from URL if present
  const [chatId, setChatId] = useState(urlChatId || null);

  const messagesEndRef = useRef(null);
  const stopTypingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =========================================================
  // 🆕 LOAD HISTORY LOGIC
  // =========================================================
  useEffect(() => {
    // If URL has a chatId, load that chat
    if (urlChatId) {
      setChatId(urlChatId);
      loadChatHistory(urlChatId);
    } else {
      // If no URL param, reset (New Chat)
      setChatId(null);
      setMessages([]);
    }
  }, [urlChatId]);

  const loadChatHistory = async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading chat:", error);
    } else if (data) {
      // Map DB messages to UI format & disable animation for history
      const history = data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        noAnimation: true, // IMPORTANT: Flag to skip typing effect
      }));
      setMessages(history);
    }
    setLoading(false);
  };
  // =========================================================

  const handlePromptClick = (prompt) => handleSend(prompt);

  const handleTypingComplete = () => {
    setIsTyping(false);
    stopTypingRef.current = false;
  };

  const handleStopTyping = () => {
    stopTypingRef.current = true;
    setIsTyping(false);
  };

  const handleSend = async (message) => {
    const userMsg = { id: Date.now(), role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    stopTypingRef.current = false;

    try {
      setLoading(true);

      const payload = {
        query: message,
        user_id: user?.id || null,
        chat_id: chatId,
      };

      const response = await axiosClient.post("/ask/", payload);

      if (response.data.chat_id) {
        setChatId(response.data.chat_id);
        // Optional: Update URL without reload to reflect new ID
        // window.history.pushState({}, '', `/?chatId=${response.data.chat_id}`);
      }

      const rawAnswer = response?.data?.answer || "Sorry, I didn't get that.";
      const normalizedAnswer = normalizeMathMarkdown(rawAnswer);

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: normalizedAnswer,
      };

      setIsTyping(true);
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: Date.now() + 2,
        role: "assistant",
        content: "There was an error connecting to the server.",
      };
      setIsTyping(true);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const isInputDisabled = loading || isTyping;

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
            <>
              <ChatMessages
                messages={messages}
                onTypingComplete={handleTypingComplete}
                stopTypingRef={stopTypingRef}
                scrollToBottom={scrollToBottom}
              />
              <div ref={messagesEndRef} />
            </>
          )}

          {loading && (
            <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
              Thinking...
            </p>
          )}
        </div>
      </div>
      <ChatInput
        onSend={handleSend}
        isSidebarOpen={isSidebarOpen}
        disabled={isInputDisabled}
        isTyping={isTyping}
        onStop={handleStopTyping}
      />
    </div>
  );
}
