import React, { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(); // date + time
};

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const { id } = useParams();
  const userData = useLoaderData();
  const users = userData.data;
  const email = user?.email;
  useEffect(() => {
    const foundUser = users.find((user) => user._id === id);
    setUser(foundUser);
  }, [users, id]);
  const userRole = user?.role;
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/doctors-all`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  const foundDoctor = data.find((doctor) => doctor.email === email);
  const permission = foundDoctor?.permission;

  useEffect(() => {
    if (permission === "approved") {
      setRole("doctor");
    } else {
      setRole("user");
    }
  }, [permission]);

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
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Something went wrong",
        );
      }

      if (result.modifiedCount > 0) {
        Swal.fire("Success!", "Role updated to admin.", "success");
        setUser((prev) => ({
          ...prev,
          role: "admin",
          roleUpdateAt: new Date().toISOString(),
        }));
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
          role: role,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Something went wrong",
        );
      }

      if (result.modifiedCount > 0) {
        Swal.fire("Success!", "Admin authority cancelled.", "success");
        setUser((prev) => ({
          ...prev,
          role: "user",
          roleUpdateAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Reject Error:", error);
      Swal.fire("Error!", error.message, "error");
    }
  };
  return (
    <div className="min-w-5xl mx-auto bg-white shadow rounded-lg p-6">
      {/* User Image */}
      <div className="flex justify-center">
        <img
          src={user?.photoURL}
          alt="User"
          className="w-24 h-24 rounded-full border border-primary"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>

        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary my-2 font-bold capitalize">
          {user?.role}
        </span>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-1">
          <span className="font-bold">Created At:</span>
          <span>{formatDateTime(user?.createdAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Last Login:</span>
          <span>{formatDateTime(user?.lastLoginAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Role Updated:</span>
          <span>{formatDateTime(user?.roleUpdateAt)}</span>
        </div>
      </div>
      <div className="mt-5">
        {userRole === "user" ? (
          <button
            onClick={() => handleMakeAdmin(user._id)}
            className="btn btn-sm btn-info btn-outline font-bold"
          >
            Make admin
          </button>
        ) : (
          <button
            onClick={() => handleCancelAdmin(user._id)}
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
