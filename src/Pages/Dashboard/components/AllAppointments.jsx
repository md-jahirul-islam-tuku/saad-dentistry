import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";

const AllAppointments = () => {
  const { user, dbUser, loading } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  console.log(user,dbUser)

  useEffect(() => {
    if (!dbUser?.data?.role) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/appointments?role=${dbUser.data.role}&email=${user.email}`
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {dbUser?.data?.role === "admin" && "All Appointments"}
        {dbUser?.data?.role === "user" && "My Appointments"}
        {dbUser?.data?.role === "doctor" && "Doctor Appointments"}
      </h2>

      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="p-4 border rounded mb-3 shadow text-start"
        >
          <p><strong>Name:</strong> {appointment.name}</p>
          <p><strong>Email:</strong> {appointment.email}</p>
          <p><strong>Doctor:</strong> {appointment.doctorName}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
        </div>
      ))}

      {appointments.length === 0 && (
        <p className="text-gray-500">No appointments found</p>
      )}
    </div>
  );
};

export default AllAppointments;
