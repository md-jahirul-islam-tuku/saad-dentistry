import React, { useMemo } from "react";
import { FaRegRegistered } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Doctor = React.memo(({ doctor }) => {
  const {
    _id,
    doctorImage,
    name,
    education,
    registrationNumber,
    experience,
    availability = [],
  } = doctor;

  // ✅ Stable today value (computed once per render)
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
      }),
    [],
  );

  // ✅ Memoized availability check
  const isAvailableToday = useMemo(
    () => availability.includes(today),
    [availability, today],
  );

  return (
    <div className="card bg-info/10 rounded-t-lg rounded-b-none text-start h-full flex flex-col">
      <figure>
        <div className="aspect-[4/5] w-full overflow-hidden rounded-t-xl">
          <img
            src={doctorImage}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy" // ✅ performance boost
          />
        </div>
      </figure>

      <div className="card-body flex flex-col flex-grow">
        <p className="text-xs font-semibold text-center mb-5">
          {isAvailableToday ? (
            <span className="bg-green-100 px-3 py-1 rounded-full border border-green-300 text-green-600">
              Available
            </span>
          ) : (
            <span className="bg-red-100 px-3 py-1 rounded-full border border-red-300 text-red-600">
              Not Available
            </span>
          )}

          <span className="bg-blue-100 px-3 py-1 rounded-full border border-blue-300 text-blue-600 ml-2">
            {experience} Years Experience
          </span>
        </p>

        <h2 className="card-title text-2xl font-bold">{name}</h2>

        <p className="text-lg text-gray-400 font-semibold">{education}</p>

        <hr className="border-dashed border border-gray-400" />

        <p className="text-lg text-gray-400 font-semibold flex items-center">
          <FaRegRegistered className="mr-2" />
          Reg No: {registrationNumber}
        </p>

        <div className="card-actions w-full mt-auto">
          <Link
            to={`/doctor/${_id}`}
            className="btn btn-sm w-full text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

export default Doctor;
