import { useState, useRef, useEffect, useCallback } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import {
  SendHorizontal,
  Bot,
  Square,
  Sparkles,
  Brain,
  Search,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import supabase from "../api/supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useAuth } from "../context/AuthContext";
import WelcomeModal from "../components/WelcomeModal";
import ThinkingIndicator from "../components/ThinkingIndicators";

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
    "What is conditional probability?",
    "Exercise 3.5?",
    "Explain multinomial probability distribution",
    "Please tell the answer of exercise 3.5",
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
        {/* Stop Generating Button */}
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
              disabled ? "Walpole is thinking..." : "Ask a question..."
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

// ============================================================================
// 3. ChatMessage (Updated with Metadata Badges)
// ============================================================================
const ChatMessage = ({
  message,
  isLast,
  onTypingComplete,
  stopTypingRef,
  scrollToBottom,
}) => {
  const { role, content, metadata } = message;
  const isUser = role === "user";
  const [displayedContent, setDisplayedContent] = useState(
    isUser ? content : "",
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

    if (message.noAnimation || isUserMessage) {
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

    // Calculate a dynamic chunk size to ensure the animation finishes in ~1.5 seconds.
    // 1500ms total duration / 30ms interval = ~50 total frames/ticks.
    const dynamicStep = Math.max(3, Math.ceil(len / 50)); // Math.ceil() rounds a number up to the next largest integer.

    const intervalId = setInterval(() => {
      if (stopTypingRef.current) {
        clearInterval(intervalId); // Stops the execution of the function specified in setInterval.
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
        i = Math.min(i + dynamicStep, len); // Math.min() returns the lowest-valued number passed into it.
        setDisplayedContent(content.slice(0, i)); // String.slice() extracts a section of a string and returns it as a new string.
        return;
      }

      // Math delimiter skipping logic
      let delim = "$";
      if (i + 1 < len && content[i + 1] === "$") {
        delim = "$$";
      }

      let j = i + delim.length;
      let foundClosing = false;

      while (j < len) {
        if (content.startsWith(delim, j)) {
          // String.startsWith() determines whether a string begins with the characters of a specified string.
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

      i = j;
      setDisplayedContent(content.slice(0, i));
    }, 30); // 30ms provides a smooth frame rate for the dynamic chunks

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
      <div
        className={`p-2 sm:p-4 rounded-md text-left ${
          isUser
            ? "bg-teal-600 text-white rounded-br-none max-w-xl"
            : "bg-white text-gray-800 border border-gray-50 rounded-bl-none w-full w-full"
        }`}
      >
        <div className="prose prose-sm max-w-none">
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
    .replace(/\\\(|\\\)/g, "$") // Replaces matching LaTeX inline math brackets with standard Markdown $ symbols.
    .replace(/\\\[|\\\]/g, "$$") // Replaces matching LaTeX block math brackets with standard Markdown $$ symbols.
    .replace(/\s*\$\$\s*/g, "\n$$\n"); // Searches for $$ symbols with any surrounding whitespace and forces them onto independent lines separated by newlines.
}

// ============================================================================
// 4. Main Home Component
// ============================================================================
export default function Home() {
  const { isSidebarOpen } = useOutletContext();
  const { user } = useAuth();

  // URL Params to check if we are loading an old chat
  const [searchParams] = useSearchParams();
  const urlChatId = searchParams.get("chatId");

  const [messages, setMessages] = useState(() => {
    if (!user) {
      const saved = sessionStorage.getItem("guest_messages");

      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg) => ({ ...msg, noAnimation: true }));
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chatId from URL if present
  const [chatId, setChatId] = useState(urlChatId || null);

  const messagesEndRef = useRef(null);
  const stopTypingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem("guest_messages", JSON.stringify(messages));
    }
  }, [messages, user]);

  // Clear session storage if user logs in
  useEffect(() => {
    if (user) {
      sessionStorage.removeItem("guest_messages");
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll on new messages or when loading starts
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // =========================================================
  // LOAD HISTORY LOGIC
  // =========================================================
  useEffect(() => {
    if (urlChatId && user) {
      setChatId(urlChatId);
      loadChatHistory(urlChatId);
    } else if (!user) {
      // If guest, ensure chatID is null
      setChatId(null);
    } else {
      setChatId(null);
      setMessages([]);
    }
  }, [urlChatId, user]);

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
        noAnimation: true,
        // Note: Unless you store metadata in DB, old messages won't have badges.
        // That is expected behavior for now.
        metadata: msg.metadata || null,
      }));
      setMessages(history);
    }
    setLoading(false);
  };
  // =========================================================

  const handlePromptClick = (prompt) => handleSend(prompt);

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
    stopTypingRef.current = false;
  }, []);

  const handleStopTyping = () => {
    stopTypingRef.current = true;
    setIsTyping(false);
  };

  const handleSend = async (message) => {
    const userMsg = { id: Date.now(), role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    stopTypingRef.current = false;

    try {
      setLoading(true); // START LOADING (Triggers ThinkingIndicator)

      let guestHistory = [];
      if (!user) {
        // Take last 6 messages
        guestHistory = messages.slice(-6).map((msg) => [msg.role, msg.content]);
      }

      const payload = {
        query: message,
        user_id: user?.id || null,
        chat_id: chatId,
        chat_history: guestHistory,
      };

      const response = await axiosClient.post("/ask/", payload);

      if (response.data.chat_id) {
        setChatId(response.data.chat_id);

        // If we just started a new chat (URL doesn't have ID yet), update the URL silently
        if (!chatId) {
          const newUrl = `${window.location.pathname}?chatId=${response.data.chat_id}`;
          window.history.pushState({ path: newUrl }, "", newUrl);
        }
      }

      const rawAnswer = response?.data?.answer || "Sorry, I didn't get that.";
      console.log("RAW LLM OUTPUT:\n", rawAnswer);

      const normalizedAnswer = normalizeMathMarkdown(rawAnswer);

      // Capture metadata from backend for the badge
      const responseMetadata = {
        mode: response.data.mode,
        chapter: response.data.metadata?.chapter,
      };

      const botMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: normalizedAnswer,
        metadata: responseMetadata, // Pass it to message
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
      setLoading(false); // STOP LOADING (Removes ThinkingIndicator)
    }
  };

  const isInputDisabled = loading || isTyping;

  return (
    <div className="h-full relative">
      <WelcomeModal />
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

              {/* Thinking Indicator appears here while waiting */}
              {loading && (
                <div className="max-w-3xl mx-auto w-full">
                  <ThinkingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
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
