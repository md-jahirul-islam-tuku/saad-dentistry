import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { MdOutlineViewCarousel } from "react-icons/md";
import { FcApprove } from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";

const PendingDoctors = () => {
  const data = useLoaderData();
  const pendingData = data.filter((doctor) => doctor.permission === "pending");
  const { doctors, setDoctors } = useState(pendingData);
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/lalumia/${id}/approve`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (data.modifiedCount > 0) {
        alert("Doctor Approved Successfully ✅");
      }
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white shadow rounded-lg">
      <table className="w-full text-left border-collapse">
        {/* ===== Table Head ===== */}
        <thead className="bg-gray-100 text-gray-700 capitalize text-sm">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>

            {/* Hidden on Mobile */}
            <th className="px-4 py-3 hidden md:table-cell">Created At</th>

            <th className="px-4 py-3 hidden md:table-cell">Status</th>

            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* ===== Table Body ===== */}
        <tbody className="divide-y">
          {pendingData?.map((doctor) => (
            <tr key={doctor._id} className="hover:bg-gray-50">
              {/* Image */}
              <td className="px-4 py-3">
                <img
                  src={doctor.doctorImage}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
                />
              </td>

              {/* Name */}
              <td className="px-4 py-3 font-semibold">{doctor.name}</td>

              {/* Created At (Desktop Only) */}
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                {new Date(doctor.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              {/* Status (Desktop Only) */}
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    doctor.permission === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {doctor.permission}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-center align-middle">
                <div className="flex flex-row items-center justify-center gap-2">
                  <button
                    className="p-2 rounded bg-blue-100 hover:bg-blue-200 transition"
                    title="View"
                  >
                    <MdOutlineViewCarousel className="text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      handleApprove(doctor._id);
                    }}
                    className="p-2 rounded bg-green-100 hover:bg-green-200 transition"
                    title="Approve"
                  >
                    <FcApprove />
                  </button>

                  <button
                    className="p-2 rounded bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <RiDeleteBin5Line className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingDoctors;
