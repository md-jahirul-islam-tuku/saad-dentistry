import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(); // date + time
};

const UserDetails = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const users = data.data;
  const dbUser = users.find((doctor) => doctor._id === id);
  const userRole = dbUser.role;
  const handleMakeAdmin = async (id) => {
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

      const response = await fetch(`http://localhost:5000/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "admin",
        }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Reject failed");
      }

      const result = await response.json();

      if (result.modifiedCount > 0) {
        Swal.fire("Success!", "Role updated to admin.", "success");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };
  const handleCancelAdmin = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This Admin authority will be cancelled.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Cancel",
      });
      if (!confirmResult.isConfirmed) return;

      const response = await fetch(`http://localhost:5000/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
        }),
      });
      if (!response.ok) {
        throw new Error("Cancel failed");
      }

      const result = await response.json();

      if (result.modifiedCount > 0) {
        Swal.fire("Success!", "Admin authority cancelled.", "success");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };
  return (
    <div className="min-w-5xl mx-auto bg-white shadow rounded-lg p-6">
      {/* User Image */}
      <div className="flex justify-center">
        <img
          src={dbUser?.photoURL}
          alt="User"
          className="w-24 h-24 rounded-full border border-primary"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">{dbUser?.name}</h2>
        <p className="text-gray-600">{dbUser?.email}</p>

        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary my-2 font-bold capitalize">
          {dbUser?.role}
        </span>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-1">
          <span className="font-bold">Created At:</span>
          <span>{formatDateTime(dbUser?.createdAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Last Login:</span>
          <span>{formatDateTime(dbUser?.lastLoginAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Role Updated:</span>
          <span>{formatDateTime(dbUser?.roleUpdateAt)}</span>
        </div>
      </div>
      <div className="mt-5">
        {userRole === "user" ? (
          <button
            onClick={() => handleMakeAdmin(dbUser._id)}
            className="btn btn-sm btn-info btn-outline font-bold"
          >
            Make admin
          </button>
        ) : (
          <button
            onClick={() => handleCancelAdmin(dbUser._id)}
            className="btn btn-sm btn-error btn-outline font-bold"
          >
            Cancel admin
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
