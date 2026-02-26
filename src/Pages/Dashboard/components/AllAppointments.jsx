import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { MdCancel } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import Loader from "../../../Loader/Loader";
import { Link } from "react-router-dom";

const AllAppointments = () => {
  const { user, dbUser, loading } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!dbUser?.data?.role) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/appointments?role=${dbUser.data.role}&email=${user.email}`,
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setAppointments(data);
      } catch (error) {
        Swal.fire("Error!", error.message, "error");
      }
    };

    fetchAppointments();
  }, [dbUser, user]);

  if (loading) return <Loader />;

  const handleCancelAppointment = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/appointment/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Deleted!", "Appointment deleted.", "success");
        setAppointments((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 text-start">
        {dbUser?.data?.role === "admin" && "All Appointments"}
        {dbUser?.data?.role === "user" && "My Appointments"}
        {dbUser?.data?.role === "doctor" && "Doctor Appointments"}
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm border dark:bg-info/10 border-base-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 dark:bg-primary/30 text-base-content">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Service</th>
              <th className="p-3">Price</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* 🔥 divide-y here */}
          <tbody className="divide-y dark:divide-primary/30 text-start">
            {appointments.map((appointment) => (
              <tr
                key={appointment._id}
                className="hover:bg-info/30 transition-colors duration-200"
              >
                <td className="p-3 font-semibold text-primary">
                  {appointment.name}
                </td>

                <td className="p-3 text-info dark:text-base-content text-sm">{appointment.email}</td>

                <td className="p-3 text-primary">{appointment.doctorName}</td>

                <td className="p-3 text-info dark:text-base-content">{appointment.serviceName}</td>

                <td
                  className={`p-3 font-bold ${
                    appointment.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-error"
                  }`}
                >
                  ${appointment.price}
                </td>

                <td className="p-3 text-info dark:text-base-content">{appointment.date}</td>

                <td className="p-3">
                  {appointment.paymentStatus === "paid" ? (
                    <div className="text-center font-bold text-green-600">
                      Paid
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/dashboard/payment/${appointment._id}`}
                        className="btn btn-info btn-xs text-white text-lg tooltip tooltip-info" data-tip="Payment"
                      >
                        <GiPayMoney />
                      </Link>

                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="btn btn-error btn-xs text-white text-lg tooltip tooltip-error" data-tip="Cancel"
                      >
                        <MdCancel />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Mobile Card View  */}
      <div className="md:hidden space-y-4">
        {appointments.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No appointments found
          </div>
        )}

        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-base-100 dark:bg-info/10 shadow-md rounded-xl p-4 border dark:border-primary/30"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-primary text-lg">
                {appointment.serviceName}
              </h3>

              <span
                className={`font-bold ${
                  appointment.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-error"
                }`}
              >
                ${appointment.price}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Patient:</span>{" "}
                {appointment.name}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {appointment.doctorName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {appointment.email}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {appointment.date}
              </p>
            </div>

            {appointment.paymentStatus === "paid" ? (
              <div className="mt-3 font-bold text-green-600">Paid</div>
            ) : (
              <div className="flex gap-3 mt-4">
                <Link
                  to={`/dashboard/payment/${appointment._id}`}
                  className="btn btn-info btn-sm text-white flex-1"
                >
                  <GiPayMoney />
                  Pay
                </Link>

                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="btn btn-error btn-sm text-white flex-1"
                >
                  <MdCancel />
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
