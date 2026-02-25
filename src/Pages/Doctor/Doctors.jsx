import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Doctor from "./Doctor";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function Doctors() {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [dataDB, setDataDB] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/doctors-all")
      .then((res) => res.json())
      .then((data) => setDataDB(data));
  }, []);
  const data = dataDB.filter((doctor) => doctor.permission === "approved");

  // ✅ FILTER (derived state)
  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data;

    return data.filter((d) => d.name.toLowerCase().includes(term));
  }, [data, searchTerm]);

  // ✅ AUTO SCROLL on search
  useEffect(() => {
    if (!searchTerm) return;
    const el = document.getElementById("bestDoctors");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchTerm]);

  const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 6);

  return (
    <section id="bestDoctors" className="py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Our Best Doctors</h2>
      </div>
      <p className="text-center mt-5 lg:px-20 mb-10">
        Our platform connects you with verified, experienced doctors across
        various specialties — all at your convenience. Whether it's a routine
        checkup or urgent consultation, book appointments in minutes and receive
        quality care you can trust.
      </p>
      <div className="md:flex justify-center">
        <input
          className="text-blue-600
          h-10 w-80 rounded-full pl-4 mb-8
          border-2 border-primary
          focus:outline-none focus:border-blue-600
          placeholder:text-primary
          focus:placeholder:text-blue-300
          transition-colors duration-300 bg-base-100"
          type="text"
          placeholder="Search any doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
      </div>
      {visibleDoctors.length === 0 ? (
        <p className="text-center text-2xl text-red-500 font-semibold py-20 bg-white rounded-2xl">
          No doctors found!
        </p>
      ) : (
        <motion.div
          key={searchTerm + showAll} // ✅ retrigger animation
          variants={container}
          initial="hidden"
          animate="show"
          className={` 
        ${
          visibleDoctors.length === 1
            ? "grid-cols-1 justify-items-center"
            : "grid gap-4"
        }
        ${
          visibleDoctors.length === 2
            ? "grid-cols-1 md:grid-cols-2 justify-items-stretch md:px-40"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } 
      `}
        >
          {visibleDoctors.map((doctor) => (
            <motion.div key={doctor._id} variants={item} layout>
              <Doctor doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredDoctors.length > 6 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-primary rounded-full px-8"
          >
            {showAll ? "View Less" : "View All Doctors"}
          </button>
        </div>
      )}
    </section>
  );
}
