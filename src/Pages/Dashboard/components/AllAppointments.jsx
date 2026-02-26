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
        <table className="table w-full min-w-[800px]">
          <thead className="bg-base-200 text-sm">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Doctor</th>
              <th>Service</th>
              <th>Price</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="font-semibold text-primary">
                  {appointment.name}
                </td>
                <td className="text-sm text-info">{appointment.email}</td>
                <td className="text-primary">{appointment.doctorName}</td>
                <td className="text-info">{appointment.serviceName}</td>
                <td
                  className={`font-bold ${
                    appointment.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-error"
                  }`}
                >
                  ${appointment.price}
                </td>
                <td className="text-info">{appointment.date}</td>
                <td>
                  {appointment.paymentStatus === "paid" ? (
                    <div className="text-center font-bold text-green-600">
                      Paid
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/dashboard/payment/${appointment._id}`}
                        className="btn btn-info btn-xs text-white text-lg"
                      >
                        <GiPayMoney />
                      </Link>

                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="btn btn-error btn-xs text-white text-lg"
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
                <td colSpan="7" className="text-center py-6 text-red-500">
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
            className="bg-base-100 shadow-md rounded-xl p-4 border"
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
