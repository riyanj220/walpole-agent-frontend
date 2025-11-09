// src/pages/AuthPage.jsx
import { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon

const AuthPage = () => {
  // true = Sign Up, false = Login
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle your form submission logic here
    if (isSignUp) {
      console.log("Signing up...");
    } else {
      console.log("Logging in...");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">
          Welcome {isSignUp ? "!" : "Back"}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-600">
          {isSignUp
            ? "Create an account to start your journey"
            : "Sign in to continue your learning journey"}
        </p>

        {/* Toggle Buttons */}
        <div className="mb-6 flex rounded-md bg-slate-100 p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 rounded-md py-2 text-sm font-medium ${
              !isSignUp
                ? "bg-white shadow"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 rounded-md py-2 text-sm font-medium ${
              isSignUp ? "bg-white shadow" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your.email@university.edu"
              className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Forgot Password Link */}
        {!isSignUp && (
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm font-medium text-teal-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        )}

        {/* "OR" Separator */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-slate-300" />
          <span className="mx-4 text-sm font-medium text-slate-500">OR</span>
          <hr className="flex-grow border-slate-300" />
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <FcGoogle className="h-5 w-5" />
          {isSignUp ? "Sign up with Google" : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
