import React, { useContext, useEffect, useState } from "react";
import { MdOutlineViewCarousel } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const AllUsers = () => {
  const { data } = useLoaderData();
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  const handleReject = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be rejected.",
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
        setUsers((prev) => prev.filter((doctor) => doctor._id !== id));

        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: "User has been rejected",
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
    <div className="w-full">
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          All Users : {filteredUsers.length}
        </h2>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="select select-bordered select-info select-sm font-bold"
        >
          <option value="all">All</option>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* ===== Desktop Table ===== */}
      <div className="hidden md:block w-full overflow-x-auto bg-white shadow rounded-lg dark:bg-info/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-primary/30 text-gray-700 dark:text-base-content capitalize text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden md:table-cell">Created</th>
              <th className="px-4 py-3 hidden md:table-cell">Last Login</th>
              <th className="px-4 py-3 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-primary/30">
            {filteredUsers.map((doctor) => (
              <tr
                key={doctor._id}
                className="hover:bg-gray-50 dark:hover:bg-info/30"
              >
                <td className="px-4 py-3">
                  <img
                    src={doctor.photoURL}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-semibold">{doctor.name}</td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {new Date(doctor.createdAt).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
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
                    {doctor.role === "super-admin" ? "Super" : doctor.role}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/dashboard/user-details/${doctor._id}`}
                      className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition tooltip tooltip-accent"
                      data-tip="View"
                    >
                      <MdOutlineViewCarousel className="text-blue-600 text-2xl" />
                    </Link>

                    {user.email === "tukuwebian@gmail.com" &&
                      doctor.email !== "tukuwebian@gmail.com" && (
                        <button
                          onClick={() => handleReject(doctor._id)}
                          className="p-1 rounded bg-red-100 hover:bg-red-200 transition tooltip tooltip-warning"
                          data-tip="Reject"
                        >
                          ❌
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No Users Found 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Mobile Card View ===== */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white dark:bg-info/10 shadow-md rounded-xl p-4 border dark:border-primary/30"
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

            <div className="mt-2 text-sm space-y-1">
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

              {user.email === "tukuwebian@gmail.com" &&
                doctor.email !== "tukuwebian@gmail.com" && (
                  <button
                    onClick={() => handleReject(doctor._id)}
                    className="btn btn-error btn-sm text-white flex-1"
                  >
                    Reject
                  </button>
                )}
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No Users Found 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
