import React, { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { MdOutlineViewCarousel } from "react-icons/md";
import { FcApprove } from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";

const PendingDoctors = () => {
  const data = useLoaderData();
  const [doctors, setDoctors] = useState([]);

  // Filter pending doctors
  useEffect(() => {
    const pending = data.filter((doctor) => doctor.permission === "pending");
    setDoctors(pending);
  }, [data]);

  // Approve Doctor
  const handleApprove = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This doctor will be approved.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
      });

      if (!confirmResult.isConfirmed) return;

      const response = await fetch(`http://localhost:5000/doctors-all/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: "approved" }),
      });

      if (!response.ok) throw new Error("Approve failed");

      const result = await response.json();

      if (result.doctorUpdate.modifiedCount > 0) {
        setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
        Swal.fire("Approved!", "Doctor has been approved.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Reject Doctor
  const handleReject = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This doctor will be rejected.",
        icon: "warning",
        showCancelButton: true,
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
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  if (doctors.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No Pending Doctors 🎉
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold">Pending Doctors</h2>

      {/* ================= Desktop Table ================= */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Status</th>
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
                    className="w-12 h-12 rounded-full border-2 border-yellow-500 object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-semibold">
                  {doctor.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(doctor.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 capitalize font-medium">
                    {doctor.permission}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/dashboard/doctor-details/${doctor._id}`}
                      className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      <MdOutlineViewCarousel className="text-blue-600" />
                    </Link>

                    <button
                      onClick={() => handleApprove(doctor._id)}
                      className="p-2 bg-green-100 rounded hover:bg-green-200"
                    >
                      <FcApprove />
                    </button>

                    <button
                      onClick={() => handleReject(doctor._id)}
                      className="p-2 bg-red-100 rounded hover:bg-red-200"
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

      {/* ================= Mobile Card Layout ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white shadow-md rounded-xl p-4 border"
          >
            <div className="flex items-center gap-4">
              <img
                src={doctor.doctorImage}
                alt={doctor.name}
                className="w-14 h-14 rounded-full border-2 border-yellow-500 object-cover"
              />

              <div>
                <h3 className="font-bold">{doctor.name}</h3>
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 capitalize font-medium">
                  {doctor.permission}
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Created:</span>{" "}
              {new Date(doctor.createdAt).toLocaleString()}
            </p>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/dashboard/doctor-details/${doctor._id}`}
                className="btn btn-info btn-sm text-white flex-1"
              >
                View
              </Link>

              <button
                onClick={() => handleApprove(doctor._id)}
                className="btn btn-success btn-sm flex-1"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(doctor._id)}
                className="btn btn-error btn-sm text-white flex-1"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingDoctors;