import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { FaAngleDoubleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/services`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false); // ✅ data আসলে loading false
      })
      .catch(() => {
        setLoading(false); // error হলেও loader বন্ধ
      });
  }, []);

  return (
    <div>
      <div className="pt-20">
        <h1 className="lg:text-left text-3xl text-accent">Committed to</h1>
        <div className="lg:flex justify-between items-center">
          <h1 className="text-5xl text-info font-bold">Excellence</h1>
          <Link to="/services">
            <button className="hidden lg:flex btn bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02] text-white">
              View All Services <FaAngleDoubleRight className="ml-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* ✅ Skeleton Loader */}
      {loading && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 my-10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col gap-4">
              <div className="skeleton h-40 w-full rounded-xl"></div>
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ No Service Found */}
      {!loading && services.length === 0 && (
        <div className="text-center mt-5">
          <h2 className="text-center text-2xl text-red-500 font-semibold py-20 bg-info/10 border-2 border-info/30 rounded-2xl">
            No services found!
          </h2>
        </div>
      )}

      {/* ✅ Services */}
      {!loading && services.length > 0 && (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 lg:gap-5 my-3 lg:my-10 gap-3">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service._id} info={service} />
          ))}
        </div>
      )}

      <Link to="/services">
        <button className="lg:hidden btn text-white bg-gradient-to-r from-info to-accent border-0">
          View All Services <FaAngleDoubleRight className="ml-3" />
        </button>
      </Link>
    </div>
  );
};

export default Services;