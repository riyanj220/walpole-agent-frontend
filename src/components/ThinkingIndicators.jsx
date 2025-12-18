import { useState, useEffect } from "react";
import { Bot } from "lucide-react";

const ThinkingIndicator = () => {
  const [step, setStep] = useState(0);

  // These steps mimic your actual backend pipeline
  const steps = [
    "Analyzing your intent...", // Router
    "Searching Walpole textbook...", // Vector DB
    "Reading relevant sections...", // Retrieval
    "Synthesizing answer...", // Generation
    "Finalizing formatting...", // LaTeX cleanup
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 p-4 justify-start animate-pulse">
      <div className="hidden md:flex shrink-0 bg-gray-100 p-2 rounded-full h-10 w-10 items-center justify-center">
        <Bot className="w-6 h-6 text-gray-400" />
      </div>
      <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg rounded-bl-none border border-gray-100">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
        </div>
        <span className="text-sm text-gray-500 font-medium min-w-[180px]">
          {steps[step]}
        </span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
