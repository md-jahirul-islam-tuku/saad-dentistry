import { useEffect } from "react";
import { FaRegRegistered } from "react-icons/fa6";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { scroller } from "react-scroll";

const DoctorDetails = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
    setTimeout(() => {
      scroller.scrollTo("appointment", {
        smooth: true,
        duration: 2000,
        offset: -80,
      });
    }, 500);
  };
  const { doctorId } = useParams();
  const doctors = useLoaderData();
  const doctorDetails = doctors.find((doctor) => doctor._id === doctorId);

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
    <div className="pt-20 max-w-[1170px] mx-auto px-3">
      <div className="text-center py-16 px-20 bg-white rounded-xl border-2 shadow-lg">
        <h1 className="text-4xl font-bold">{name}'s Profile Details</h1>
        <p className="py-3">
          <span className="text-lg font-semibold">{name},</span> {experience}{" "}
          years experienced. A trusted medical professional committed to
          providing expert care with compassion.
        </p>
      </div>
      <div className="card lg:card-side bg-base-100 mt-10 border-2 text-start">
        <figure className="p-4 overflow-hidden">
          <img
            src={doctorImage}
            alt=""
            className="w-62 h-72 rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </figure>
        <div className="card-body text-center md:text-start">
          <h2 className="card-title justify-center md:justify-start text-3xl">
            {name}
          </h2>
          <p className="text-lg text-gray-500 font-bold">{education}</p>
          <p className="text-lg text-gray-500 font-semibold">
            Working at:{" "}
            <span className="text-lg font-bold text-black">{workingAt}</span>
          </p>

          <hr className="border-gray-300 border-dashed mt-2" />
          <p className="text-lg text-gray-400 font-semibold flex items-center justify-center md:justify-start">
            <FaRegRegistered className="mr-2 mt-0.5" /> Reg No:{" "}
            {registrationNumber}
          </p>
          <hr className="border-gray-300 border-dashed mb-2" />
          <div className="flex flex-col md:flex-row items-center">
            <span className="text-lg mr-3 font-semibold">Availability :</span>

            <div className="grid grid-cols-2 md:grid-cols-1 md:grid-flow-col gap-5 md:gap-0 mt-3 md:mt-0">
              {availability.map((day, index) => (
                <span
                  key={index}
                  className="bg-green-100 px-3 rounded-full border border-green-300 text-green-800 font-semibold mr-2 py-1"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <p className="text-lg text-center md:flex">
            <span className="font-semibold">Consultation Fee:</span>
            <span className="text-blue-700 font-bold px-3 flex items-center justify-center">
              ${fee}
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
      <div className="mt-10 mb-20 bg-white p-7 rounded-xl border-2">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl text-center font-semibold">
            Book an Appointment
          </h1>
          <div className="">
            <span className="font-bold">Today: </span>
            {isAvailableToday ? (
              <span className="bg-green-100 px-3 rounded-full border border-green-300 text-green-800 font-semibold ml-1">
                Available
              </span>
            ) : (
              <span className="bg-red-100 px-3 rounded-full border border-red-300 text-red-600 font-semibold">
                Not Available
              </span>
            )}
          </div>
        </div>
        <hr className="border-gray-300 border-dashed" />
        <div className="my-8 text-center">
          <span className="lg:bg-yellow-100 py-1 px-3 rounded-full lg:border lg:border-yellow-300 text-yellow-500 font-semibold">
            Due to high patient volume, we are currently accepting appointments
            for today only. We appreciate your understanding and cooperation
          </span>
        </div>
        <div className="text-center">
          <button
            onClick={handleNavigate}
            className="btn btn-info shadow-none rounded-full w-full text-xl mb-7 text-white hover:bg-gradient-to-r from-info to-accent border-0"
          >
            Book Appointment Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
