import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import logo from "../../navLogo.png";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const menu = (
    <>
      <li>
        <Link to="/home">Home</Link>
      </li>
      <li>
        <Link to="/blog">Blog</Link>
      </li>
      <li>
        <Link to="/services">All services</Link>
      </li>
      <li>
        <Link to="/myreviews">My reviews</Link>
      </li>
      <li>
        <Link to="/add-service">Add service</Link>
      </li>
      <div className="lg:hidden items-center flex">
        {user ? (
          <>
            <Link
              className="btn btn-xs lg:btn-md font-semibold text-info"
              to="/"
              onClick={logOut}
            >
              Log Out
            </Link>
            <div
              className="my-auto tooltip tooltip-bottom tooltip-info"
              data-tip={user?.displayName}
            >
              <img
                className="h-12 w-12 ml-2 mx-auto rounded-full bg-gray-400"
                src={user?.photoURL}
                alt="User"
              />
            </div>
          </>
        ) : (
          <>
            <Link
              className="btn btn-xs lg:btn-md font-semibold text-info"
              to="/signup"
            >
              Sign Up
            </Link>
            <Link
              className="btn btn-xs lg:btn-md font-semibold text-info ml-2"
              to="/login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </>
  );
  const get = (
    <>
      {user ? (
        <>
          <Link
            className="btn btn-xs lg:btn-md font-semibold text-info"
            to="/"
            onClick={logOut}
          >
            Log Out
          </Link>
          <div
            className="my-auto tooltip tooltip-bottom tooltip-info"
            data-tip={user?.displayName}
          >
            <img
              className="h-12 w-12 rounded-full bg-gray-400"
              src={user?.photoURL}
              alt="User"
            />
          </div>
        </>
      ) : (
        <>
          <Link
            className="btn btn-xs lg:btn-md font-semibold text-info"
            to="/signup"
          >
            Sign Up
          </Link>
          <Link
            className="btn btn-xs lg:btn-md font-semibold text-info"
            to="/login"
          >
            Login
          </Link>
        </>
      )}
    </>
  );
  return (
    <div className="bg-base-100 opacity-90 shadow-md py-5 fixed z-10 lg:px-20 w-full">
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
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {menu}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <img className="h-12" src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex items-center">
          <ul className="menu menu-horizontal p-0 text-lg font-semibold text-info">
            {menu}
          </ul>
        </div>
        <div className="navbar-end lg:flex hidden">
          <ul className="flex items-center gap-1">{get}</ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
