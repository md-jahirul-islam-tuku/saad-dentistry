import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Doctor from "./Doctor";

const fetchDoctors = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/doctors-all`);

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
};

export default function Doctors() {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ React Query
  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false,
  });

  // ✅ Only approved doctors
  const approvedDoctors = useMemo(() => {
    return doctors.filter((doctor) => doctor.permission === "approved");
  }, [doctors]);

  // ✅ Search filter
  const filteredDoctors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return approvedDoctors;

    return approvedDoctors.filter((d) => d.name.toLowerCase().includes(term));
  }, [approvedDoctors, searchTerm]);

  // ✅ Auto scroll when searching
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
        <h2 className="text-3xl font-bold text-primary">Our Best Doctors</h2>
      </div>

      <p className="text-center mt-5 lg:px-20 mb-10">
        Our platform connects you with verified, experienced doctors across
        various specialties — all at your convenience.
      </p>

      {/* 🔍 Search */}
      <div className="md:flex justify-center">
        <input
          className="h-10 w-80 rounded-full pl-4 mb-8 border-2 border-primary bg-base-100"
          type="text"
          placeholder="Search any doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 bg-base-200 rounded-2xl animate-pulse"
            >
              <div className="h-64 w-full rounded-t-lg rounded-b-none bg-gray-300 dark:bg-gray-700"></div>
              <div className="space-y-4 p-4">
                <div className="flex justify-between">
                  <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex justify-between">
                  <div className="h-7 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-7 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ Error */}
      {isError && (
        <p className="text-center text-red-500 font-semibold py-10">
          Failed to load doctors!
        </p>
      )}

      {/* ✅ No Doctors */}
      {!isLoading && !isError && visibleDoctors.length === 0 && (
        <p className="text-center text-2xl text-red-500 font-semibold py-20 bg-info/10 border-2 border-info/30 rounded-2xl">
          No doctors found!
        </p>
      )}

      {/* ✅ Doctors Grid */}
      {!isLoading && !isError && visibleDoctors.length > 0 && (
        <div
          key={searchTerm + showAll}
          className={`grid gap-4 ${
            visibleDoctors.length === 1
              ? "grid-cols-1 justify-items-center"
              : visibleDoctors.length === 2
                ? "grid-cols-1 md:grid-cols-2 md:px-40"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {visibleDoctors.map((doctor) => (
            <Doctor key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

      {/* ✅ View All Button */}
      {filteredDoctors.length > 6 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-primary rounded-full text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            {showAll ? "View Less" : "View All Doctors"}
          </button>
        </div>
      )}
    </section>
  );
}
