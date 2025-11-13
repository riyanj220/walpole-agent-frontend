// src/pages/AuthPage.jsx
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) console.log("Signing up...");
    else console.log("Logging in...");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg transition-all">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-1">
          Welcome {isSignUp ? "!" : "Back"}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          {isSignUp
            ? "Create an account to start your journey"
            : "Sign in to continue your learning journey"}
        </p>

        {/* Toggle Buttons */}
        <div className="flex mb-8 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${
              !isSignUp
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all ${
              isSignUp
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@university.edu"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-white font-semibold shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        {!isSignUp && (
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm font-medium text-emerald-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        )}

        {/* OR Separator */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-300" />
          <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
          <div className="grow border-t border-gray-300" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          <FcGoogle className="h-5 w-5" />
          {isSignUp ? "Sign up with Google" : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
