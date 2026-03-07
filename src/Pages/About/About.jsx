import { FaUserMd, FaCalendarCheck, FaClock, FaStar } from "react-icons/fa";
import ScrollToTop from "react-scroll-to-top";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-12">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          Dental Doctor Appointment System
        </h1>
        <p className="text-lg opacity-80 max-w-3xl mx-auto">
          A modern and user-friendly platform where patients can easily find
          dentists, book appointments, leave reviews, and manage their dental
          care online.
        </p>
      </div>

      {/* Project Overview */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md my-12">
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          Project Overview
        </h2>

        <p className="leading-relaxed opacity-90">
          The Dental Doctor Appointment System helps patients schedule dental
          appointments quickly and efficiently. Instead of calling clinics or
          waiting in queues, users can browse available services, choose a
          doctor, select a suitable time, and confirm appointments instantly.
        </p>

        <p className="leading-relaxed mt-4 opacity-90">
          The platform also allows patients to view their appointment history,
          submit reviews, and make secure online payments.
        </p>
      </div>

      {/* How It Works */}
      <div className="my-12">
        <h2 className="text-2xl font-semibold text-primary text-center mb-8">
          How To Use The System
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-md border border-primary/20">
            <div className="card-body items-center text-center">
              <FaUserMd className="text-3xl text-primary" />
              <h3 className="font-semibold text-lg">Find Service</h3>
              <p className="text-sm opacity-80">
                Browse available dental services and select the treatment you
                need.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-primary/20">
            <div className="card-body items-center text-center">
              <FaCalendarCheck className="text-3xl text-primary" />
              <h3 className="font-semibold text-lg">Book Appointment</h3>
              <p className="text-sm opacity-80">
                Choose a convenient date and confirm your appointment instantly.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-primary/20">
            <div className="card-body items-center text-center">
              <FaClock className="text-3xl text-primary" />
              <h3 className="font-semibold text-lg">Manage Schedule</h3>
              <p className="text-sm opacity-80">
                View and manage your booked appointments from your dashboard.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-primary/20">
            <div className="card-body items-center text-center">
              <FaStar className="text-3xl text-primary" />
              <h3 className="font-semibold text-lg">Leave Review</h3>
              <p className="text-sm opacity-80">
                Share your experience and help other patients choose the best
                service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="my-12 bg-white dark:bg-info/10 border border-primary/20 rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            ✔ Easy appointment booking
          </div>

          <div className="flex items-start gap-2">
            ✔ Secure online payment system
          </div>

          <div className="flex items-start gap-2">
            ✔ View and manage personal appointments
          </div>

          <div className="flex items-start gap-2">
            ✔ Patient review and rating system
          </div>

          <div className="flex items-start gap-2">
            ✔ Responsive design for mobile and desktop
          </div>

          <div className="flex items-start gap-2">
            ✔ Authentication and protected routes
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <h2 className="text-2xl font-semibold text-primary text-center mb-6 my-12">
          Technologies Used
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <span className="badge badge-primary badge-outline p-4">React</span>

          <span className="badge badge-primary badge-outline p-4">
            React Query
          </span>

          <span className="badge badge-primary badge-outline p-4">
            Tailwind CSS
          </span>

          <span className="badge badge-primary badge-outline p-4">DaisyUI</span>

          <span className="badge badge-primary badge-outline p-4">Node.js</span>

          <span className="badge badge-primary badge-outline p-4">
            Express.js
          </span>

          <span className="badge badge-primary badge-outline p-4">MongoDB</span>

          <span className="badge badge-primary badge-outline p-4">
            Stripe Payment
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
