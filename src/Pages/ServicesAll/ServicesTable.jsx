import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ServicesTable = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);
  return (
    <div className="overflow-x-auto col-span-1 mb-5 md:mb-0 md:mr-5">
      <h1 className="text-3xl font-bold text-info my-4">
        Total services {services.length}
      </h1>
      <div>
        {services.map((service) => (
          <div key={service._id}>
            <NavLink
              to={`/services/${service._id}`}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 mb-2 text-primary font-semibold ${
                  isActive
                    ? "bg-primary/30 border-r-4 border-primary"
                    : "bg-primary/10 hover:bg-primary/30"
                }`
              }
            >
              {service.title}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTable;
