import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import logo from "../../navLogo.png";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/lalumia")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  const thisUserData = data.find((doctor) => doctor.email === user?.email);

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
          to="/add-service"
          className={({ isActive }) =>
            `px-3 py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Add Service
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
      {user ? (
        <>
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
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt={user?.displayName} src={user?.photoURL} />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link className="text-primary">{user.displayName}</Link>
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
                          ? "badge-warning disabled"
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
                <Link>Settings</Link>
              </li>
              <li>
                <Link className="text-info" to="/" onClick={logOut}>
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <Link className="btn btn-sm font-semibold text-info" to="/signup">
            Sign Up
          </Link>
          <Link className="btn btn-sm font-semibold text-info" to="/login">
            Login
          </Link>
        </>
      )}
      <li>
        <Link
          to="/#appointment"
          className="btn btn-sm btn-info font-semibold hover:bg-gradient-to-r from-info to-accent border-0 hidden md:flex"
        >
          Book
        </Link>
      </li>
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
          <ul className="menu menu-horizontal p-0 font-semibold text-info">
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
