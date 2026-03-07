import React, { useEffect, useState } from "react";
import logo from "../../logo.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);
  const menu = (
    <>
      <li>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Home
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Services
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/myreviews"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Reviews
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          About
        </NavLink>
      </li>
    </>
  );
  const legal = (
    <>
      <li>
        <NavLink
          to="/terms"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Terms of use
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/privacy"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          Privacy policy
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            `py-2 ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          FAQ
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `py-2 text-info ${isActive ? "text-primary font-semibold" : ""}`
          }
        >
          CONTACT
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="mt-10 md:mt-0 bg-info/10">
      <footer className="md:justify-between max-w-[1120px] px-3 mx-auto footer py-10 lg:py-20 text-black md:py-10">
        <div className="flex flex-col items-center mx-auto md:mx-0">
          <img className="h-8 md:h-10 lg:h-14" src={logo} alt="Logo" />
          <p className="text-lg text-base-content font-semibold">
            <span className="text-info font-bold text-3xl">SaaD Dentistry</span>
            <br />
            Providing reliable dental
            <br />
            Care since 2012
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start mx-auto text-base-content list-none">
          <span className="footer-title text-info dark:text-base-content">
            Services
          </span>
          {services.slice(0, 4).map((service) => (
            <NavLink
              to={`/services/${service._id}`}
              className={({ isActive }) =>
                `${isActive ? "text-primary font-semibold" : ""}`
              }
            >
              {service.title}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-col items-center md:items-start mx-auto text-base-content list-none">
          <span className="footer-title text-info dark:text-base-content">
            Explore
          </span>
          {menu}
        </div>
        <div className="flex flex-col items-center md:items-start mx-auto text-base-content list-none">
          <span className="footer-title text-info dark:text-base-content">
            legal
          </span>
          {legal}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
