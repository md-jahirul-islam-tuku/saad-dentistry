import React, { useContext, useState } from "react";
import bgImg from "../../Assets/img/bg-appointment.png";
import { IoMdArrowDropdown } from "react-icons/io";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Loader from "../../Loader/Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = process.env.REACT_APP_API_BASE_URL;

const Appointment = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // ✅ Fetch Doctors
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await fetch(`${API}/doctors-all`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // ✅ Fetch Services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(`${API}/services`);
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // ✅ Create Appointment Mutation
  const appointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      const res = await fetch(`${API}/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("saad-token")}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      return data;
    },

    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Appointment Success 🚀",
        text: data.message,
        timer: 1500,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
        showConfirmButton: false,
      });

      // reset form
      setFormData({ name: "", date: "" });
      setSelectedDoctor(null);
      setSelectedService(null);

      // invalidate if needed
      queryClient.invalidateQueries(["appointments"]);
    },

    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedService) {
      return Swal.fire({
        title: "Error",
        text: "Please select doctor and service",
        icon: "error",
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    }

    const appointment = {
      name: formData.name,
      email: user?.email,
      date: formData.date,
      doctorName: selectedDoctor.name,
      doctorEmail: selectedDoctor.email,
      serviceName: selectedService.title,
      price: selectedService.price,
      serviceId: selectedService._id,
    };

    // ✅ Confirmation Alert
    const result = await Swal.fire({
      title: "Confirm Appointment?",
      html: `
      <div class="flex justify-center">
        <div style="text-align:left">
          <p><strong>Patient:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Service:</strong> ${selectedService.title}</p>
          <p><strong>Doctor:</strong> ${selectedDoctor.name}</p>
          <p><strong>Date:</strong> ${formData.date}</p>
          <p><strong>Price:</strong> $${selectedService.price}</p>
        </div>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Book it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    });

    if (!result.isConfirmed) return;

    // ✅ Only runs if confirmed
    appointmentMutation.mutate(appointment);
  };

  return (
    <div className="my-10">
      <div
        className="hero bg-info/5 lg:flex rounded-xl bg-no-repeat"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="card w-full lg:w-1/3 lg:left-20">
          <div className="card-body py-20">
            <h3 className="text-2xl font-semibold text-accent">
              Book Your Visit At
            </h3>
            <h1 className="text-4xl font-bold text-info">SaaDDentistry</h1>

            {doctorsLoading || servicesLoading ? (
              <div className="flex flex-col gap-4 rounded-2xl animate-pulse mt-2">
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered bg-blue-100 dark:bg-base-100 w-full my-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                {/* Email */}
                <input
                  type="email"
                  value={user?.email ?? ""}
                  placeholder="Your Email"
                  readOnly
                  className="input input-bordered bg-blue-100 dark:bg-base-100 w-full my-2"
                />

                {/* Date */}
                <input
                  type="date"
                  className={`input input-bordered bg-blue-100 dark:bg-base-100 w-full my-2 ${formData.date ? "text-black" : "text-gray-400"}`}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />

                {/* Service */}
                <select
                  value={selectedService?._id || ""}
                  onChange={(e) => {
                    const service = services.find(
                      (s) => s._id === e.target.value,
                    );
                    setSelectedService(service || null);
                  }}
                  className={`select bg-blue-100 dark:bg-base-100 font-normal input-bordered w-full my-2 transition-colors duration-200 ${selectedService?._id ? "text-black dark:text-base-content" : "text-gray-400"}`}
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  {services.map((service) => (
                    <option
                      className="text-black dark:text-base-content"
                      key={service._id}
                      value={service._id}
                    >
                      {service.title} - ${service.price}
                    </option>
                  ))}
                </select>

                {/* Doctor Dropdown */}
                <div className="relative w-full my-2">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`w-full flex items-center justify-between px-4 py-3 bg-blue-100 dark:bg-base-100 border border-slate-300 dark:border-slate-100/10 rounded-lg ${selectedDoctor ? "text-black dark:text-base-content" : "text-gray-400"}`}
                  >
                    {selectedDoctor ? selectedDoctor.name : "Select Doctor"}
                    <IoMdArrowDropdown />
                  </button>

                  {open && (
                    <ul className="absolute z-10 w-full bg-white dark:bg-base-100 dark:text-base-content shadow-md mt-2">
                      {doctors.map((doctor) => {
                        const available = doctor.availability?.includes(today);

                        return (
                          <li
                            key={doctor._id}
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-blue-200 dark:hover:bg-blue-200/10 cursor-pointer flex justify-between items-center"
                          >
                            {doctor.name}
                            <span
                              className={`text-xs ${available ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-100/10 px-2 py-1 rounded" : "text-red-600 bg-red-100 px-2 py-1 rounded"}`}
                            >
                              {" "}
                              {available ? "Available" : "Unavailable"}{" "}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <button
                  disabled={!user || appointmentMutation.isPending}
                  className="btn w-full mt-4 text-white  bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
                >
                  {appointmentMutation.isPending ? (
                    <Loader />
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
