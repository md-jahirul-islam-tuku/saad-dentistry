import React, { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { MdOutlineViewCarousel } from "react-icons/md";
import Swal from "sweetalert2";

const ActiveDoctors = () => {
  const data = useLoaderData();

  const [doctors, setDoctors] = useState([]);

  // ✅ Filter approved initially
  useEffect(() => {
    const approved = data.filter((doctor) => doctor.permission === "approved");
    setDoctors(approved);
  }, [data]);

  const handleReject = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This doctor will be rejected.",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Reject",
      });

      if (!confirmResult.isConfirmed) return;

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/doctors-all/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify({ permission: "rejected" }),
        },
      );

      if (!response.ok) throw new Error("Reject failed");

      const result = await response.json();

      if (result.doctorUpdate.modifiedCount > 0) {
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "Doctor has been rejected.",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong.",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mt-4">
        Active Doctors : {doctors.length}
      </h2>

      {/* ================= Desktop Table ================= */}
      <div className="hidden md:block w-full overflow-x-auto bg-white dark:bg-info/10 shadow rounded-lg my-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 dark:bg-primary/30 dark:text-base-content capitalize text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Created At</th>
              <th className="px-4 py-3 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-primary/30">
            {doctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="hover:bg-gray-50 dark:hover:bg-info/30"
              >
                <td className="px-4 py-3">
                  <img
                    src={doctor.doctorImage}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-semibold">{doctor.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-base-content hidden md:table-cell">
                  {new Date(doctor.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-700">
                    {doctor.permission}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/dashboard/doctor-details/${doctor._id}`}
                      className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition tooltip tooltip-success"
                      data-tip="View"
                    >
                      <MdOutlineViewCarousel className="text-blue-600 text-2xl" />
                    </Link>

                    <button
                      onClick={() => handleReject(doctor._id)}
                      className="p-1 rounded bg-red-100 hover:bg-red-200 transition tooltip tooltip-warning"
                      data-tip="Reject"
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {doctors.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No Active Doctors 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Card View ================= */}
      <div className="md:hidden space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow-md rounded-xl p-4 border"
          >
            <div className="flex items-center gap-4">
              <img
                src={doctor.doctorImage}
                alt={doctor.name}
                className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
              />
              <div>
                <h3 className="font-bold text-primary">{doctor.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-green-100 text-green-700">
                  {doctor.permission}
                </span>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(doctor.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/dashboard/doctor-details/${doctor._id}`}
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

export default ActiveDoctors;
