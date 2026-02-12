import React, { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { MdOutlineViewCarousel } from "react-icons/md";
import { FcApprove } from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";

const RejectedDoctors = () => {
  const data = useLoaderData();

  // ✅ Proper State
  const [doctors, setDoctors] = useState([]);

  // ✅ Filter pending initially
  useEffect(() => {
    const rejection = data.filter((doctor) => doctor.permission === "rejected");
    setDoctors(rejection);
  }, [data]);
  // ✅ Approve Function
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/lalumia/${id}/approve`,
        {
          method: "PATCH",
        },
      );

      const result = await response.json();

      if (result.modifiedCount > 0) {
        // ✅ Remove approved doctor from pending list
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
      }
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 capitalize text-sm">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Created At</th>
            <th className="px-4 py-3 hidden md:table-cell">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {doctors.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <img
                  src={doctor.doctorImage}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
                />
              </td>

              <td className="px-4 py-3 font-semibold">{doctor.name}</td>

              <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                {new Date(doctor.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="px-4 py-3 hidden md:table-cell">
                <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-yellow-100 text-yellow-700">
                  {doctor.permission}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="p-2 rounded bg-blue-100 hover:bg-blue-200 transition"
                    title="View"
                  >
                    <Link to={`/dashboard/doctor-details/${doctor._id}`}>
                      <MdOutlineViewCarousel className="text-blue-600" />
                    </Link>
                  </button>

                  <button
                    onClick={() => handleApprove(doctor._id)}
                    className="p-2 rounded bg-green-100 hover:bg-green-200 transition"
                    title="Approve"
                  >
                    <FcApprove />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">
                No Rejected Doctors 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RejectedDoctors;
