import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ===== Sidebar ===== */}
      <div
        className={`fixed md:static z-20 mt-16 top-0 left-0 w-64 bg-white transform 
        ${isOpen ? "translate-x-0 h-full" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-5 font-bold text-lg border-b text-start">
          Dashboard
        </div>

        <ul className="flex flex-col space-y-1 text-start text-lg font-semibold mt-2">
          <li>
            <Link
              to="/dashboard/pending-doctors"
              className="block px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              🕒 Pending Dr
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/active-doctors"
              className="block px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              ✅ Active Dr
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/rejected-doctors"
              className="block px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              ❌ Rejected Dr
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              👤 Profile
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/settings"
              className="block px-4 py-2 rounded hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </Link>
          </li>
        </ul>
      </div>
      {/* ===== Overlay (Mobile only) ===== */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 z-0 md:hidden
        transition-opacity duration-300
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* ===== Main Content ===== */}
      <div className="flex-1">
        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center p-4 bg-white shadow mt-16">
          <button onClick={() => setIsOpen(true)} className="text-2xl mr-3">
            ☰
          </button>
          <h2 className="font-bold text-lg">Dashboard</h2>
        </div>

        <div className="md:mt-20 mt-3 flex items-start mx-5 rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
