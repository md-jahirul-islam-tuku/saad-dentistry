import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import ScrollToTop from "react-scroll-to-top";

const FAQ = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-12">
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
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Frequently Asked Questions
        </h1>

        <p className="max-w-3xl mx-auto text-lg opacity-80">
          Find answers to common questions about booking dental appointments,
          payments, and using the platform.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        {/* FAQ 1 */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 dark:bg-info/20 border border-primary/20 rounded-lg my-4"
        >
          <div className="collapse-title font-semibold text-primary flex items-center gap-2">
            <FaQuestionCircle />
            How do I book a dental appointment?
          </div>
          <div className="collapse-content text-sm opacity-90">
            Browse available dental services, choose your preferred doctor,
            select a convenient date, and confirm your appointment.
          </div>
        </div>

        {/* FAQ 2 */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 dark:bg-info/20 border border-primary/20 rounded-lg my-4"
        >
          <div className="collapse-title font-semibold text-primary flex items-center gap-2">
            <FaQuestionCircle />
            Can I cancel my appointment?
          </div>
          <div className="collapse-content text-sm opacity-90">
            Yes. Go to your dashboard, open the "My Appointments" section, and
            click the cancel button for the appointment.
          </div>
        </div>

        {/* FAQ 3 */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 dark:bg-info/20 border border-primary/20 rounded-lg my-4"
        >
          <div className="collapse-title font-semibold text-primary flex items-center gap-2">
            <FaQuestionCircle />
            How do I pay for an appointment?
          </div>
          <div className="collapse-content text-sm opacity-90">
            After booking an appointment click the "Pay" button and complete the
            payment securely using Stripe.
          </div>
        </div>

        {/* FAQ 4 */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 dark:bg-info/20 border border-primary/20 rounded-lg my-4"
        >
          <div className="collapse-title font-semibold text-primary flex items-center gap-2">
            <FaQuestionCircle />
            Is my payment information secure?
          </div>
          <div className="collapse-content text-sm opacity-90">
            Yes. All payments are processed through Stripe with secure
            encryption and protection.
          </div>
        </div>

        {/* FAQ 5 */}
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-100 dark:bg-info/20 border border-primary/20 rounded-lg my-4"
        >
          <div className="collapse-title font-semibold text-primary flex items-center gap-2">
            <FaQuestionCircle />
            Can I leave a review?
          </div>
          <div className="collapse-content text-sm opacity-90">
            Yes. After receiving treatment you can leave ratings and reviews to
            help other patients.
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold text-primary mb-3">
          Need More Help?
        </h2>

        <p className="opacity-90">
          If you still have questions, feel free to contact our support team
          through the contact page.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
