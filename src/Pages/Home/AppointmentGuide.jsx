import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaUserMd, FaNotesMedical } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const AppointmentGuide = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="my-10 py-20 rounded-lg max-w-6xl mx-auto px-4 bg-gray-100 dark:bg-info/10">
      <h2 className="text-4xl font-bold text-center text-primary mb-4">
        How To Book An Appointment
      </h2>

      <p className="text-center text-gray-500 dark:text-base-content mb-12">
        Follow these simple steps to book your dental appointment easily.
      </p>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="bg-base-100 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <FaCalendarCheck className="text-5xl text-info mx-auto mb-4" />

          <h3 className="text-xl font-semibold mb-2">Select Your Date</h3>

          <p className="text-gray-500 dark:text-gray-400">
            Choose a suitable date for your visit. Our system will show doctors
            available on that day.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-base-100 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <FaUserMd className="text-5xl text-accent mx-auto mb-4" />

          <h3 className="text-xl font-semibold mb-2">
            Choose Doctor & Service
          </h3>

          <p className="text-gray-500 dark:text-gray-400">
            Select the dental service you need and choose an available doctor
            for that day.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-base-100 shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition">
          <FaNotesMedical className="text-5xl text-info mx-auto mb-4" />

          <h3 className="text-xl font-semibold mb-2">Confirm Your Booking</h3>

          <p className="text-gray-500 dark:text-gray-400">
            Review your appointment details and confirm your booking securely.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-info/10 border border-info/20 rounded-xl p-6 mt-12 text-center">
        <h4 className="text-2xl font-semibold text-primary mb-2 flex items-center gap-2 justify-center">
          Important Tips <MdTipsAndUpdates />
        </h4>

        <p className="text-gray-600 dark:text-gray-400">
          Please make sure your contact information is correct. We will notify
          you by email of the time of your visit.{" "}
          <br className="hidden md:block" /> Arrive at least 10 minutes before
          your appointment time.
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-10">
        {user ? (
          <Link
            to="/appointment"
            className="btn text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02] px-10"
          >
            Book Appointment
          </Link>
        ) : (
          <Link
            to="/login"
            className="btn text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02] px-10"
          >
            Book Appointment
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppointmentGuide;
