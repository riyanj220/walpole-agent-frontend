// src/pages/AuthPage.jsx
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { LogOut } from "lucide-react"; // Assuming you have lucide-react installed, or use a simple text

const AuthPage = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg transition-all text-center">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {user ? "Welcome Back!" : "Welcome to Walpole Tutor"}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          {user
            ? "You are currently signed in."
            : "Sign in to start your personalized study journey."}
        </p>

        {user ? (
          // LOGGED IN STATE
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={signOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        ) : (
          // LOGGED OUT STATE
          <>
            <button
              onClick={signInWithGoogle}
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
            >
              <FcGoogle className="h-6 w-6" />
              Continue with Google
            </button>

            <p className="mt-6 text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
