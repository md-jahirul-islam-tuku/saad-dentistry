import React, { useEffect } from "react";
import { FaRegRegistered } from "react-icons/fa6";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { TbCurrencyTaka } from "react-icons/tb";
import { addId } from "../../Utilities/addToDB";
import { toast, ToastContainer } from "react-toastify";

const DoctorDetails = () => {
  const navigate = useNavigate();
  const handleAdd = (id) => {
    const result = addId(id);

    if (result === "ID_ADDED") {
      toast.success("Booking Appointment Successful ✅");
      setTimeout(() => navigate("/bookings"), 1200);
    } else if (result === "ID_EXISTS") {
      toast.error("Already appointed ⚠️");
      setTimeout(() => navigate("/#bestDoctors"), 1000);
    } else {
      toast.error("Invalid Doctor ID ❌");
    }
  };
  const { doctorId } = useParams();
  const doctors = useLoaderData();
  const doctorDetails = doctors.find(
    (doctor) => doctor.doctorId === Number(doctorId)
  );
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isAvailableToday = doctorDetails.availability.includes(today);
  const {
    doctorImage,
    name,
    education,
    registrationNumber,
    workingAt,
    fee,
    availability,
    experience,
  } = doctorDetails;
  useEffect(() => {
    document.title = `${name} | MedicalGroup`;
  }, [name]);
  return (
    <div className="pt-20 bg-base-300 max-w-[1170px] mx-auto">
      <div className="text-center py-16 px-20 bg-white rounded-xl">
        <h1 className="text-4xl font-bold">{name}'s Profile Details</h1>
        <p className="py-3">
          <span className="text-lg font-semibold">{name}</span> {experience}{" "}
          years experienced. A trusted medical professional committed to
          providing expert care with compassion.
        </p>
      </div>
      <div className="card lg:card-side bg-base-100 mt-10">
        <figure className="rounded-xl">
          <img src={doctorImage} alt="Movie" className="p-5" />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl">{name}</h2>
          <p className="text-lg text-gray-500 font-bold">{education}</p>
          <p className="text-lg text-gray-500 font-semibold">Working at:</p>
          <h4 className="text-lg font-bold">{workingAt}</h4>
          <hr className="border-gray-300 border-dashed mt-2" />
          <p className="text-lg text-gray-400 font-semibold flex items-center">
            <FaRegRegistered className="mr-2 mt-0.5" /> Reg No:{" "}
            {registrationNumber}
          </p>
          <hr className="border-gray-300 border-dashed mb-2" />
          <p>
            <span className="text-lg mr-3 font-semibold">Availability :</span>

            {availability.map((day, index) => (
              <span
                key={index}
                className="bg-green-100 px-3 rounded-full border border-green-300 text-green-600 font-semibold mr-2 py-1"
              >
                {day}
              </span>
            ))}
          </p>
          <p className="text-lg text-center md:flex">
            <span className="font-semibold">Consultation Fee:</span>
            <span className="text-blue-700 font-bold px-1 flex items-center justify-center">
              Taka : {fee} <TbCurrencyTaka />
            </span>
            <span className="font-semibold text-gray-500 mr-1">
              (Incl. Vat)
            </span>
            <span className="font-semibold text-blue-700">
              Per Consultation
            </span>
          </p>
        </div>
      </div>
      <div className="mt-10 mb-20 bg-white p-7 rounded-xl">
        <h1 className="text-2xl text-center mb-5 font-semibold">
          Book an Appointment
        </h1>
        <hr className="border-gray-300 border-dashed" />
        <div className="flex justify-between py-5">
          <span className="font-bold">Availability</span>
          {isAvailableToday ? (
            <span className="bg-green-100 px-3 py-1 rounded-full border border-green-300 text-green-600 font-semibold">
              Available
            </span>
          ) : (
            <span className="bg-red-100 px-3 py-1 rounded-full border border-red-300 text-red-600 font-semibold">
              Not Available
            </span>
          )}
        </div>
        <hr className="border-gray-300 border-dashed" />
        <div className="py-5 text-center">
          <span className="lg:bg-yellow-100 py-1 px-3 rounded-full lg:border lg:border-yellow-300 text-yellow-500 font-semibold">
            ! Due to high patient volume, we are currently accepting
            appointments for today only. We appreciate your understanding and
            cooperation.
          </span>
        </div>
        <div className="text-center">
          <button
            onClick={() => handleAdd(doctorId)}
            className="btn btn-primary shadow-none rounded-full w-full text-xl my-7"
          >
            Book Appointment Now
          </button>
          <ToastContainer autoClose={1000} position="top-right" />
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
