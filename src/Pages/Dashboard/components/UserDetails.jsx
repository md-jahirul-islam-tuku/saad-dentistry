import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString(); // date + time
};

const UserDetails = () => {
  const [dataUser, setDataUser] = useState(null);
  const [role, setRole] = useState("");
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userData = useLoaderData();
  const users = userData?.data;
  const email = dataUser?.email;

  useEffect(() => {
    const foundUser = users.find((user) => user._id === id);
    setDataUser(foundUser);
  }, [users, id]);
  const userRole = dataUser?.role;
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/doctors-all`)
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
        text: "This user will be Admin.",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Make",
      });
      if (!confirmResult.isConfirmed) return;

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify({
            role: "admin",
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Something went wrong",
        );
      }

      if (result.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Role updated to admin.",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
        setDataUser((prev) => ({
          ...prev,
          role: "admin",
          roleUpdateAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    }
  };
  const handleCancelAdmin = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This Admin authority will be rejected.",
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
        `${process.env.REACT_APP_API_BASE_URL}/user/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify({
            role: role,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Something went wrong",
        );
      }

      if (result.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Admin authority rejected.",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
        setDataUser((prev) => ({
          ...prev,
          role: "user",
          roleUpdateAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
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
    <div className="max-w-xs mx-auto bg-white dark:bg-info/10 shadow rounded-lg p-6">
      {/* User Image */}
      <div className="flex justify-center">
        <img
          src={dataUser?.photoURL}
          alt="User"
          className="w-24 h-24 rounded-full border border-primary object-cover"
        />
      </div>

      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-bold">{dataUser?.name}</h2>
        <p className="text-gray-400">{dataUser?.email}</p>

        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 dark:bg-primary/30 text-primary my-2 font-bold capitalize">
          {dataUser?.role}
        </span>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-1">
          <span className="font-bold">Created At:</span>
          <span>{formatDateTime(dataUser?.createdAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Last Login:</span>
          <span>{formatDateTime(dataUser?.lastLoginAt)}</span>
        </div>

        <div className="flex justify-between gap-1">
          <span className="font-bold">Role Updated:</span>
          <span>{formatDateTime(dataUser?.roleUpdateAt)}</span>
        </div>
      </div>
      {email !== "tukuwebian@gmail.com" && (
        <div className="mt-5">
          {userRole !== "admin" ? (
            <button
              onClick={() => handleMakeAdmin(dataUser._id)}
              className="btn btn-sm btn-info btn-outline font-bold"
              disabled={user.email !== "tukuwebian@gmail.com"}
            >
              Make admin
            </button>
          ) : (
            <button
              onClick={() => handleCancelAdmin(dataUser._id)}
              className="btn btn-sm btn-error btn-outline font-bold"
              disabled={user.email !== "tukuwebian@gmail.com"}
            >
              Cancel admin
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetails;
