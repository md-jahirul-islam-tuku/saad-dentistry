import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";
import ScrollToTop from "react-scroll-to-top";

const Dashboard = () => {
  useTitle("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { email } = user;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!email) return;
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${email}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [email]);
  const role = data?.data?.role;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-info/10">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />
      {/* ===== Sidebar ===== */}
      <div
        className={`fixed md:static z-20 mt-16 top-0 left-0 w-64 bg-white dark:bg-base-100 transform 
        ${isOpen ? "translate-x-0 h-full" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out md:pr-3 px-3 min-h-screen md:px-0`}
      >
        <div className="p-5 font-bold text-lg border-b text-start dark:border-primary/50">
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
                  👨‍👩‍👧 Appointments
                </NavLink>
              </li>
            </>
          )}
          {(role === "admin" || role === "super-admin") && (
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
                  👨‍👩‍👧 Appointments
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
                <NavLink
                  to="/dashboard/edit-service"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                      isActive
                        ? "bg-primary/30 border-r-4 border-primary"
                        : "bg-primary/10 hover:bg-primary/30"
                    }`
                  }
                >
                  📝 Edit Service
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
        <div className="md:hidden flex items-center p-4 bg-white dark:bg-primary/30 shadow mt-16">
          <button onClick={() => setIsOpen(true)} className="text-2xl mr-3">
            ☰
          </button>
          <h2 className="font-bold text-lg">Dashboard</h2>
        </div>

        <div className="md:mt-20 mt-3 mx-5 rounded-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
