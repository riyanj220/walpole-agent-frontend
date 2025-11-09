// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import AuthLayout from "./components/AuthLayout";
import Home from "./pages/home";
import AuthPage from "./pages/AuthPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public/Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Protected/Main App */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
