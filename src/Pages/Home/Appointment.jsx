import React, { useContext, useEffect, useState } from "react";
import bgImg from "../../Assets/img/bg-img.jpg";
import { IoMdArrowDropright } from "react-icons/io";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const Appointment = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  useEffect(() => {
    fetch("http://localhost:5000/doctors-all")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const date = form.date.value;
    const doctorName = selectedDoctor.name;
    const doctorEmail = selectedDoctor.email;
    const appointment = { name, email, date, doctorName, doctorEmail };
    try {
      const response = await fetch("http://localhost:5000/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Appointment success!",
        text: data.message,
      });

      // Reset form
      form.reset();
      setSelectedDoctor(null);
    } catch (error) {
      // Error Alert (Real Backend Message)
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
            <h3 className="text-2xl font-semibold text-accent text-left">
              Book Your Visit At
            </h3>
            <h1 className="text-4xl font-bold text-info text-left">
              SaaDDentistry
            </h1>
            <hr></hr>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Your Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="input input-bordered bg-blue-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Your Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={user?.email}
                  placeholder="Your email"
                  className="input input-bordered bg-blue-100"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Appointment date
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  placeholder="dd--mm--yy"
                  className="input input-bordered bg-blue-100"
                  required
                />
              </div>
              <div className="relative w-full">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Select your doctor
                  </span>
                </label>
                <button
                  type="button"
                  className="w-full flex justify-between items-center px-4 py-3 bg-blue-100 border border-blue-300 rounded-lg font-semibold"
                  onClick={() => setOpen(!open)}
                >
                  <span>
                    {selectedDoctor ? selectedDoctor.name : "Select doctor"}
                  </span>
                  <span>
                    <IoMdArrowDropright />
                  </span>
                </button>

                {open && (
                  <ul className="absolute z-10 mt-2 w-full bg-white border shadow-md">
                    {data.map((doctor) => {
                      const isAvailableToday =
                        doctor.availability?.includes(today);

                      return (
                        <li
                          key={doctor._id}
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setOpen(false);
                          }}
                          className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-blue-200"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={doctor.doctorImage}
                              alt=""
                              className="w-8 h-8 rounded-full overflow border border-primary p-0.5"
                            />
                            <span>{doctor.name}</span>
                          </div>
                          <span
                            className={`px-2 rounded-full text-xs font-semibold border ${
                              isAvailableToday
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-red-100 text-red-600 border-red-300"
                            }`}
                          >
                            {isAvailableToday ? "Available" : "Unavailable"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="form-control mt-6">
                <button
                  disabled={!user}
                  className={`btn btn-info font-semibold text-white border-0 hover:bg-gradient-to-r from-info to-accent`}
                >
                  Book Appointment Now
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:block w-1/2"></div>
      </div>
    </div>
  );
};

export default Appointment;
