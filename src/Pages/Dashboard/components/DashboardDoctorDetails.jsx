import { useEffect } from "react";
import { FaRegRegistered } from "react-icons/fa6";
import { useLoaderData, useParams } from "react-router";

const DashboardDoctorDetails = () => {
  const { id } = useParams();
  const doctors = useLoaderData();
  const doctorDetails = doctors.find((doctor) => doctor._id === id);
  const {
    doctorImage,
    name,
    education,
    registrationNumber,
    workingAt,
    fee,
    availability,
  } = doctorDetails;
  useEffect(() => {
    document.title = `${name} | MedicalGroup`;
  }, [name]);
  return (
    <div className="max-w-[1170px] mx-auto p-3">
      <div className="card lg:card-side bg-base-100 border-2 border-primary/30 text-start">
        <figure className="p-4 overflow-hidden">
          <img
            src={doctorImage}
            alt=""
            className="w-full h-full rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </figure>
        <div className="card-body text-center md:text-start">
          <h2 className="card-title justify-center md:justify-start text-3xl">
            {name}
          </h2>
          <p className="text-lg text-gray-500 font-bold">{education}</p>
          <p className="text-lg text-gray-500 font-semibold">
            Working at:{" "}
            <span className="text-lg font-bold text-base-content">{workingAt}</span>
          </p>

          <hr className="border-gray-300 border-dashed mt-2" />
          <p className="text-lg text-gray-400 font-semibold flex items-center justify-center md:justify-start">
            <FaRegRegistered className="mr-2 mt-0.5" /> Reg No:{" "}
            {registrationNumber}
          </p>
          <hr className="border-gray-300 border-dashed mb-2" />
          <div className="flex flex-col md:flex-row items-center">
            <span className="text-lg mr-3 font-semibold">Availability :</span>

            <div className="grid grid-cols-2 xl:grid-cols-1 xl:grid-flow-col gap-5 xl:gap-0 mt-3 xl:mt-0">
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
            <span className="text-blue-700 dark:text-primary font-bold px-3 flex items-center justify-center">
              ${fee}
            </span>
            <span className="font-semibold text-gray-500 mr-1">
              (Incl. Vat)
            </span>
            <span className="font-semibold text-blue-700 dark:text-primary">
              Per Consultation
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctorDetails;
