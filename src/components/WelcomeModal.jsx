import { useState, useEffect } from "react";
import { BookOpen, X, FileText } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenWelcome");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300  flex flex-col">
        {/* Header */}
        <div className="bg-teal-600 p-5 md:p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-1">Welcome! </h2>
            <p className="text-teal-100 text-xs md:text-sm">
              Your Personal Walpole Tutor
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-teal-100 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-teal-700/50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            This AI Agent has read the entire{" "}
            <span className="font-semibold text-teal-700">
              Probability & Statistics for Engineers & Scientists
            </span>{" "}
            (Walpole).
          </p>

          <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm text-teal-600 shrink-0">
                <BookOpen size={20} />
              </div>
              <p className="font-semibold text-teal-800">Capabilities:</p>
            </div>

            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold shrink-0 mt-0.5">
                  •
                </span>
                <span>Ask for specific exercises (e.g., "6.14")</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold shrink-0 mt-0.5">
                  •
                </span>
                <span>
                  Get examples from book (e.g., "What is example 1.1?")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold shrink-0 mt-0.5">
                  •
                </span>
                <span>Get definitions & theory explanations from book</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 font-bold shrink-0 mt-0.5">
                  •
                </span>
                <span>Verify answers directly from the book</span>
              </li>
            </ul>
          </div>

          {/* PDF Link */}
          <div className="pt-2">
            <p className="text-xs text-center text-gray-400 mb-2 uppercase tracking-wider font-semibold">
              Source Material
            </p>
            <a
              href="https://drive.google.com/file/d/1iv1hpyFw_wg95llqX-tseanOQKGFZ1d-/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all group text-sm md:text-base"
            >
              <FileText
                size={18}
                className="text-red-500 group-hover:scale-110 transition-transform shrink-0"
              />
              <span>View Textbook PDF</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium shadow-sm shadow-teal-200 transition-all cursor-pointer text-sm md:text-base"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}
