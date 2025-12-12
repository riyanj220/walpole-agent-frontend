// src/pages/AuthPage.jsx
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import {
  LogOut,
  BrainCircuit,
  History,
  UserCheck,
  Sparkles,
} from "lucide-react";

const AuthPage = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Pitch / Welcome */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {user ? "Welcome Back!" : "Master Statistics with AI"}
          </h1>
          <p className="text-lg  text-slate-600 leading-relaxed ">
            {user &&
              "Ready to continue your learning journey? Your personal tutor is waiting."}
          </p>

          {/* Feature List (Only show if NOT logged in) */}
          {!user && (
            <div className="space-y-4 pt-4">
              <FeatureItem
                icon={<BrainCircuit className="w-5 h-5 text-teal-600" />}
                text="Context-Aware Explanations"
              />
              <FeatureItem
                icon={<History className="w-5 h-5 text-teal-600" />}
                text="Save Your Chat History"
              />
              <FeatureItem
                icon={<Sparkles className="w-5 h-5 text-teal-600" />}
                text="Personalized Examples"
              />
            </div>
          )}
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all hover:shadow-2xl">
            {user ? (
              // LOGGED IN STATE
              <div className="space-y-6 text-center">
                <div className="relative mx-auto w-24 h-24">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.picture}
                      alt="Profile"
                      className="w-full h-full rounded-full border-4 border-teal-50 shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-3xl font-bold">
                      {user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"
                    title="Online"
                  ></div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {user.user_metadata?.full_name || "Student"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {user.email}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-400 border border-slate-100">
                  User ID:{" "}
                  <span className="font-mono">{user.id.slice(0, 8)}...</span>
                </div>

                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 hover:border-red-200 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              // LOGGED OUT STATE
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-8 h-8 text-teal-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Sign In
                  </h2>
                  <p className="text-sm text-slate-500">
                    Unlock full access to your personalized study history and AI
                    features.
                  </p>
                </div>

                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group cursor-pointer"
                >
                  <FcGoogle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </button>

                <p className="text-xs text-slate-400 px-4">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for feature list
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 max-w-sm md:max-w-none mx-auto md:mx-0">
    <div className="bg-teal-50 p-2 rounded-md">{icon}</div>
    <span className="text-slate-700 font-medium">{text}</span>
  </div>
);

export default AuthPage;
