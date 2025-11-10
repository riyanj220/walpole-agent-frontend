// src/layouts/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AuthLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Outlet />
      </div>
    </>
  );
}
