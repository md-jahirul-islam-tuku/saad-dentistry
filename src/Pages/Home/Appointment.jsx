import React, { useEffect, useState } from "react";
import bgImg from "../../Assets/img/bg-img.jpg";
import { IoMdArrowDropright } from "react-icons/io";

const Appointment = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  useEffect(() => {
    fetch("http://localhost:5000/lalumia")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  return (
    <div className="my-10">
      <div
        className="hero lg:flex rounded-xl shadow-lg"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="card w-full lg:w-1/3 lg:left-20">
          <div className="card-body">
            <h3 className="text-2xl font-semibold text-accent text-left">
              Book Your Visit At
            </h3>
            <h1 className="text-4xl font-bold text-info text-left">
              SaaDDentistry
            </h1>
            <hr></hr>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Your Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered bg-blue-100"
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
                placeholder="Your email"
                className="input input-bordered bg-blue-100"
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
                placeholder="Appointment date"
                className="input input-bordered bg-blue-100"
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
              <button className="btn btn-info font-semibold text-white hover:bg-gradient-to-r from-info to-accent border-0">
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-1/2"></div>
      </div>
    </div>
  );
};

export default Appointment;
