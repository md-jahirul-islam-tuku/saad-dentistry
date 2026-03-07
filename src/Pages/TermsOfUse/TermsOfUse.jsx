import React from "react";
import {
  FaUserShield,
  FaCalendarCheck,
  FaCreditCard,
  FaInfoCircle,
} from "react-icons/fa";
import ScrollToTop from "react-scroll-to-top";

const TermsOfUse = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-12 text-start">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />
      {/* Header */}
      <div className="space-y-4 p-8">
        <h1 className="text-4xl font-bold text-primary">Terms of Use</h1>

        <p className="opacity-80 text-lg">
          Please read these terms carefully before using the Dental Doctor
          Appointment System. By accessing or using this platform, you agree to
          comply with the following terms and conditions.
        </p>
      </div>

      {/* Acceptance */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md mb-12 text-start">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaUserShield /> Acceptance of Terms
        </h2>

        <p className="opacity-90 leading-relaxed">
          By using this website, you confirm that you accept these terms and
          agree to follow them. If you do not agree with any part of these
          terms, please do not use the platform.
        </p>
      </div>

      {/* Responsibilities */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12 text-start">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          User Responsibilities
        </h2>

        <ul className="space-y-3 opacity-90 text-start">
          <li>
            ✔ Provide accurate personal information when booking appointments.
          </li>
          <li>✔ Respect doctors and clinic staff while using the platform.</li>
          <li>✔ Do not misuse the system for false or spam appointments.</li>
          <li>✔ Maintain the security of your account credentials.</li>
        </ul>
      </div>

      {/* Appointment Policy */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaCalendarCheck /> Appointment Policy
        </h2>

        <p className="opacity-90 leading-relaxed">
          Patients can browse services, select a doctor, and schedule
          appointments through the platform. Appointment availability depends on
          the doctor's schedule and may change at any time.
        </p>

        <ul className="mt-4 space-y-2 opacity-90 text-start">
          <li>✔ Book appointments based on available dates.</li>
          <li>✔ Arrive on time for scheduled visits.</li>
          <li>✔ Inform the clinic if you cannot attend.</li>
        </ul>
      </div>

      {/* Payment Policy */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaCreditCard /> Payment Policy
        </h2>

        <p className="opacity-90 leading-relaxed">
          Some services may require secure online payments. Payments are
          processed through trusted third-party payment providers to ensure
          safety and reliability.
        </p>

        <ul className="mt-4 space-y-2 opacity-90 text-start">
          <li>✔ All payments must be completed before confirmation.</li>
          <li>✔ Transaction details will be recorded for reference.</li>
          <li>✔ Refund policies may depend on clinic rules.</li>
        </ul>
      </div>

      {/* Cancellation */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Cancellation Policy
        </h2>

        <p className="opacity-90 leading-relaxed">
          Users may cancel appointments through their dashboard. However,
          cancellations should be done responsibly to avoid inconvenience to
          doctors and other patients.
        </p>

        <ul className="mt-4 space-y-2 opacity-90 text-start">
          <li>✔ Cancel appointments in advance whenever possible.</li>
          <li>✔ Repeated cancellations may affect booking privileges.</li>
        </ul>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaInfoCircle /> Privacy & Data Protection
        </h2>

        <p className="opacity-90 leading-relaxed">
          We respect your privacy and handle your personal data responsibly.
          Your information will only be used for appointment management and
          communication purposes within the platform.
        </p>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-3">Need Help?</h2>

        <p className="opacity-90">
          If you have any questions about these Terms of Use, please contact our
          support team through the website.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
