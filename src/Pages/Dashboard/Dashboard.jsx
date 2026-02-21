import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";

const Dashboard = () => {
  useTitle("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { email } = user;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:5000/users/${email}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [email]);
  const role = data?.data?.role;

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
            <NavLink
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                  isActive
                    ? "bg-primary/30 border-r-4 border-primary"
                    : "bg-primary/10 hover:bg-primary/30"
                }`
              }
            >
              👤 Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                  isActive
                    ? "bg-primary/30 border-r-4 border-primary"
                    : "bg-primary/10 hover:bg-primary/30"
                }`
              }
            >
              ⚙️ Settings
            </NavLink>
          </li>
          {(role === "doctor" || role === "user") && (
            <>
              <li>
                <NavLink
                  to="/dashboard/my-appointments"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  {role === "user" && "👨‍👩‍👧 My Appointments"}
                  {role === "doctor" && "👨‍👩‍👧 Doctor Appointments"}
                </NavLink>
              </li>
            </>
          )}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/users"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  👨‍👩‍👧 All Users
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/all-appointments"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  👨‍👩‍👧 All appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/add-service"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  ➕ Add Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pending-doctors"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  🕒 Pending Dr
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/active-doctors"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  ✅ Active Dr
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/rejected-doctors"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  ❌ Rejected Dr
                </NavLink>
              </li>
            </>
          )}
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
