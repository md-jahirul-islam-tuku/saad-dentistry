import React, { useContext, useEffect, useState } from "react";
import bgImg from "../../Assets/img/bg-img.jpg";
import { IoMdArrowDropdown } from "react-icons/io";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const Appointment = () => {
  const { user } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

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

  // Fetch Doctors
  useEffect(() => {
    fetch("http://localhost:5000/doctors-all")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  }, []);

  // Fetch Services
  useEffect(() => {
    fetch("http://localhost:5000/services")
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  const handleServiceChange = (e) => {
    const service = services.find((s) => s._id === e.target.value);
    setSelectedService(service || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedService) {
      Swal.fire({
        icon: "error",
        title: "Please select doctor and service",
      });
      return;
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

    try {
      const response = await fetch(
        "http://localhost:5000/appointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointment),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Swal.fire({
        icon: "success",
        title: "Appointment Success!",
        text: data.message,
      });

      // Reset
      setFormData({ name: "", date: "" });
      setSelectedDoctor(null);
      setSelectedService(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
      });
    }
  };

  return (
    <div className="my-10">
      <div
        className="hero lg:flex rounded-xl shadow-lg"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="card w-full lg:w-1/3 lg:left-20">
          <div className="card-body py-20">
            <h3 className="text-2xl font-semibold text-accent">
              Book Your Visit At
            </h3>
            <h1 className="text-4xl font-bold text-info">
              SaaDDentistry
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered bg-blue-100 w-full my-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                required
              />

              {/* Email */}
              <input
                type="email"
                value={user?.email ?? ""}
                readOnly
                className="input input-bordered bg-blue-100 w-full my-2"
              />

              {/* Date */}
              <input
                type="date"
                className="input input-bordered bg-blue-100 w-full my-2"
                value={formData.date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                required
              />

              {/* Service */}
              <select
                value={selectedService?._id || ""}
                onChange={handleServiceChange}
                className="select bg-blue-100 w-full my-2"
              >
                <option value="" disabled>
                  Select Service
                </option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.title} - ${service.price}
                  </option>
                ))}
              </select>

              {/* Doctor Dropdown */}
              <div className="relative w-full my-2">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="w-full flex justify-between px-4 py-3 bg-blue-100 rounded-lg"
                >
                  {selectedDoctor
                    ? selectedDoctor.name
                    : "Select Doctor"}
                  <IoMdArrowDropdown />
                </button>

                {open && (
                  <ul className="absolute z-10 w-full bg-white shadow-md mt-2">
                    {doctors.map((doctor) => {
                      const available =
                        doctor.availability?.includes(today);

                      return (
                        <li
                          key={doctor._id}
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-blue-200 cursor-pointer flex justify-between"
                        >
                          {doctor.name}
                          <span
                            className={`text-xs ${
                              available
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            {available
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                disabled={!user}
                className="btn btn-info w-full mt-4 text-white"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;