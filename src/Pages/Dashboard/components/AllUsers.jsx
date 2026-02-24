import React, { useEffect, useState } from "react";
import { MdOutlineViewCarousel } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const AllUsers = () => {
  const { data } = useLoaderData();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    setDoctors(data);
  }, [data]);

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

      const response = await fetch(`http://localhost:5000/doctors-all/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: "rejected" }),
      });

      if (!response.ok) throw new Error("Reject failed");

      const result = await response.json();

      if (result.doctorUpdate.modifiedCount > 0) {
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
        Swal.fire("Rejected!", "Doctor has been rejected.", "success");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      {/* ======= Desktop Table ======= */}
      <div className="hidden md:block w-full overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 capitalize text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Created</th>
              <th className="px-4 py-3 hidden md:table-cell">Last Login</th>
              <th className="px-4 py-3 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={doctor.photoURL}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-semibold">{doctor.name}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                  {new Date(doctor.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                  {new Date(doctor.lastLoginAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-700">
                    {doctor.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/dashboard/user-details/${doctor._id}`}
                      className="p-2 rounded bg-blue-100 hover:bg-blue-200 transition"
                      title="View"
                    >
                      <MdOutlineViewCarousel className="text-blue-600" />
                    </Link>

                    <button
                      onClick={() => handleReject(doctor._id)}
                      className="p-2 rounded bg-red-100 hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <RiDeleteBin5Line className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {doctors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No Active Doctors 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======= Mobile Card View ======= */}
      <div className="md:hidden space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow-md rounded-xl p-4 border"
          >
            <div className="flex items-center gap-4">
              <img
                src={doctor.photoURL}
                alt={doctor.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
              />
              <div>
                <h3 className="font-bold text-primary">{doctor.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-700">
                    {doctor.role}
                  </span>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(doctor.createdAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <span className="font-semibold">Last Login:</span>{" "}
                {new Date(doctor.lastLoginAt).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/dashboard/user-details/${doctor._id}`}
                className="btn btn-info btn-sm text-white flex-1"
              >
                View
              </Link>

              <button
                onClick={() => handleReject(doctor._id)}
                className="btn btn-error btn-sm text-white flex-1"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {doctors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No Active Doctors 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
