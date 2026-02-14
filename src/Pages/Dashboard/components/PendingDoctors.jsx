import React, { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { MdOutlineViewCarousel } from "react-icons/md";
import { FcApprove } from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";

const PendingDoctors = () => {
  const data = useLoaderData();

  // ✅ Proper State
  const [doctors, setDoctors] = useState([]);

  // ✅ Filter pending initially
  useEffect(() => {
    const pending = data.filter((doctor) => doctor.permission === "pending");
    setDoctors(pending);
  }, [data]);

  const handleApprove = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This doctor will be approved.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve",
      });

      // If user cancels → stop here
      if (!confirmResult.isConfirmed) return;

      const response = await fetch(`http://localhost:5000/lalumia/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permission: "approved",
        }),
      });

      if (!response.ok) {
        throw new Error("Approve failed");
      }

      const result = await response.json();

      if (result.modifiedCount > 0) {
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));

        Swal.fire("Approved!", "Doctor has been approved.", "success");
      }
    } catch (error) {
      console.error("Approve Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This doctor will be rejected.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Reject",
      });

      if (!confirmResult.isConfirmed) return;

      const response = await fetch(`http://localhost:5000/lalumia/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permission: "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error("Reject failed");
      }

      const result = await response.json();

      if (result.modifiedCount > 0) {
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));

        Swal.fire("Rejected!", "Doctor has been rejected.", "success");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
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

                  <button
                    onClick={() => handleReject(doctor._id)}
                    className="p-2 rounded bg-red-100 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <RiDeleteBin5Line className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-500">
                No Pending Doctors 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingDoctors;
