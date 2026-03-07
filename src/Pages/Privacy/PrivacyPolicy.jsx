import React from "react";
import {
  FaUserShield,
  FaDatabase,
  FaLock,
  FaCookieBite,
  FaUserCheck,
} from "react-icons/fa";
import ScrollToTop from "react-scroll-to-top";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 pt-24 text-start">
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
        <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>

        <p className="text-lg opacity-80">
          Your privacy is important to us. This Privacy Policy explains how the
          Dental Doctor Appointment system collects, uses, and protects your
          personal information when you use our platform.
        </p>
      </div>

      {/* Information We Collect */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaDatabase /> Information We Collect
        </h2>

        <p className="max-w-3xl text-start opacity-90 leading-relaxed">
          When you use our platform, we may collect certain personal information
          to provide better services and manage appointments.
        </p>

        <ul className="max-w-3xl mt-4 space-y-2 opacity-90">
          <li>✔ Name and contact information</li>
          <li>✔ Email address</li>
          <li>✔ Appointment details</li>
          <li>✔ Payment related information</li>
          <li>✔ Usage data for improving the platform</li>
        </ul>
      </div>

      {/* How We Use Information */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaUserCheck /> How We Use Your Information
        </h2>

        <p className="opacity-90 leading-relaxed">
          The information we collect helps us improve the platform and provide
          better healthcare service management.
        </p>

        <ul className="mt-4 space-y-2 opacity-90">
          <li>✔ Manage and confirm appointments</li>
          <li>✔ Process secure payments</li>
          <li>✔ Send notifications and updates</li>
          <li>✔ Improve website functionality</li>
          <li>✔ Provide customer support</li>
        </ul>
      </div>

      {/* Data Protection */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaLock /> Data Protection
        </h2>

        <p className="max-w-3xl opacity-90 leading-relaxed">
          We take appropriate security measures to protect your personal
          information from unauthorized access, misuse, or disclosure. Sensitive
          information such as payment data is handled through secure third-party
          payment providers.
        </p>
      </div>

      {/* Cookies */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaCookieBite /> Cookies and Tracking
        </h2>

        <p className="max-w-3xl opacity-90 leading-relaxed">
          Our platform may use cookies to enhance user experience, remember
          preferences, and analyze website usage for performance improvements.
        </p>
      </div>

      {/* Third Party */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Third-Party Services
        </h2>

        <p className="max-w-3xl opacity-90 leading-relaxed">
          We may use trusted third-party services such as payment providers or
          authentication systems. These services follow their own privacy
          policies and security standards.
        </p>
      </div>

      {/* User Rights */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
          <FaUserShield /> Your Rights
        </h2>

        <ul className="space-y-2 opacity-90">
          <li>✔ Access your personal information</li>
          <li>✔ Request correction of incorrect data</li>
          <li>✔ Request deletion of your account data</li>
          <li>✔ Contact support for privacy related concerns</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md mt-12">
        <h2 className="text-2xl font-semibold text-primary mb-3">Contact Us</h2>

        <p className="opacity-90">
          If you have any questions about this Privacy Policy or how your
          information is handled, please contact our support team through the
          platform.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
