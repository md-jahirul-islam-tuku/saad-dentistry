import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import logo from "../../navLogo.png";
import { scroller } from "react-scroll";
import { IoMdLogOut } from "react-icons/io";
import { ThemeContext } from "../../context/ThemeContext";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log(user);

  // 👉 outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/doctors-all")
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, []);
  const thisUserData = userData.find((doctor) => doctor.email === user?.email);
  const email = user?.email;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!email) return;
    fetch(`http://localhost:5000/users/${email}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [email]);
  const userPhoto = data?.data?.photoURL;
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
    setTimeout(() => {
      scroller.scrollTo("appointment", {
        smooth: true,
        duration: 2000,
        offset: -80,
      });
    }, 500);
  };
  const menu = (
    <>
      <li>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `px-3 py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `px-3 py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Services
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/myreviews"
          className={({ isActive }) =>
            `px-3 py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Reviews
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `px-3 py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Blog
        </NavLink>
      </li>
    </>
  );
  const get = (
    <>
      <div className="flex bg-slate-200 dark:bg-white/10 p-1 rounded-full">
        <button
          onClick={() => setTheme("light")}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all tooltip tooltip-bottom tooltip-info ${
            theme === "light"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-400 dark:text-slate-300"
          }`}
          data-tip="Light Mode"
        >
          <FaSun />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all tooltip tooltip-bottom tooltip-info ${
            theme === "dark"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-400 dark:text-slate-300"
          }`}
          data-tip="Dark Mode"
        >
          <FaMoon />
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all tooltip tooltip-bottom tooltip-info ${
            theme === "system"
              ? "bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
              : "text-slate-400 dark:text-slate-300"
          }`}
          data-tip="System Default"
        >
          <FaDesktop />
        </button>
      </div>
      {user ? (
        <>
          {/* <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <button onClick={() => setTheme("light")}>🌞 Light</button>
              </li>
              <li>
                <button onClick={() => setTheme("dark")}>🌙 Dark</button>
              </li>
              <li>
                <button onClick={() => setTheme("system")}>💻 System</button>
              </li>
            </ul>
          </div> */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />{" "}
                </svg>
                <span className="badge badge-xs badge-success indicator-item">
                  2
                </span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-56 shadow"
            >
              <div className="card-body">
                <span className="text-info bg-info-content py-2 rounded-lg font-semibold">
                  Registration under review. Please wait for update 🔍
                </span>
                <span className="text-info bg-info-content py-2 rounded-lg font-semibold">
                  Doctor active now ✅
                </span>
              </div>
            </div>
          </div>
          <li>
            <button
              onClick={handleNavigate}
              className="btn btn-sm font-semibold hidden md:flex text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
            >
              Book
            </button>
          </li>
          <div
            ref={dropdownRef}
            className={`dropdown dropdown-end ${open ? "dropdown-open" : ""}`}
            onMouseEnter={() => setOpen(true)}
          >
            <div className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={user?.displayName}
                  src={user?.photoURL || userPhoto}
                />
              </div>
            </div>

            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-60 p-2 shadow font-bold text-gray-500">
              <li>
                <Link className="text-primary text-lg font-semibold">
                  {user.displayName}
                </Link>
              </li>
              <li>
                <Link
                  to={
                    thisUserData?.permission === "approved" ||
                    thisUserData?.permission === "pending" ||
                    thisUserData?.permission === "rejected"
                      ? null
                      : "/be-doctor"
                  }
                  className="justify-between"
                >
                  {thisUserData?.permission === "approved" ||
                  thisUserData?.permission === "pending" ||
                  thisUserData?.permission === "rejected"
                    ? "Doctor"
                    : "Registration"}

                  <span
                    className={`badge ${
                      thisUserData?.permission === "approved"
                        ? "badge-success text-green-700 font-semibold"
                        : thisUserData?.permission === "pending"
                          ? "badge-warning"
                          : thisUserData?.permission === "rejected"
                            ? "badge-error"
                            : "badge-info"
                    }`}
                  >
                    {thisUserData?.permission === "approved"
                      ? "Active"
                      : thisUserData?.permission === "pending"
                        ? "Pending"
                        : thisUserData?.permission === "rejected"
                          ? "Rejected"
                          : "Doctor"}
                  </span>
                </Link>
              </li>

              <li>
                <Link to={"/dashboard"}>Dashboard</Link>
              </li>

              <li>
                <Link
                  className="text-info font-semibold"
                  to="/"
                  onClick={logOut}
                >
                  Log Out <IoMdLogOut />
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <Link
            className="btn btn-sm font-semibold  text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
            to="/signup"
          >
            Sign Up
          </Link>
          <Link
            className="btn btn-sm font-semibold  text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
            to="/login"
          >
            Login
          </Link>
        </>
      )}
    </>
  );
  return (
    <div className="bg-base-100 opacity-90 shadow-md fixed z-40 lg:px-20 w-full">
      <div className="navbar max-w-[1120px] mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 font-bold"
            >
              {menu}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case p-0">
            <img className="h-10" src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex items-center">
          <ul className="menu menu-horizontal p-0 font-semibold text-info dark:text-base-content">
            {menu}
          </ul>
        </div>
        <div className="navbar-end">
          <ul className="flex items-center gap-1">{get}</ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
