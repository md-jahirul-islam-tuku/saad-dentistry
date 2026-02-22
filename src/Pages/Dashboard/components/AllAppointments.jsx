import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { MdCancel } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import Loader from "../../../Loader/Loader";

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

      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200 text-sm">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Doctor</th>
              <th>Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="">
                <td className="font-semibold">{appointment.name}</td>
                <td className="text-sm text-gray-500">{appointment.email}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.date}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="btn btn-info btn-xs text-white text-lg"
                      title="Payment"
                    >
                      <GiPayMoney />
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="btn btn-error btn-xs text-white text-lg"
                      title="Cancel appointment"
                    >
                      <MdCancel />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAppointments;
