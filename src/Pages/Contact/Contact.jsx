import { useState, useRef } from "react";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import Loader from "../../Loader/Loader";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const Contact = () => {
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";

    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_mbqd7qo",
        "template_eog9pgd",
        formRef.current,
        "3BJ0Rz1QiydsvKtlC",
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Message sent successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Failed to send message",
          text: error.text || "Something went wrong",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>

        <p className="max-w-2xl mx-auto opacity-80">
          Have questions about dental services or appointments? Send us a
          message and our team will respond as soon as possible.
        </p>
      </div>

      {/* Contact Card */}
      <div className="bg-white dark:bg-info/10 border border-primary/20 rounded-3xl shadow-lg overflow-hidden my-12 text-start">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left Info */}
          <div className="lg:col-span-2 bg-info text-white p-10">
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>

            <p className="opacity-90 mb-8">
              If you have any questions about our dental services, appointments,
              or payments, feel free to contact us.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-sm opacity-80">Email</p>
                  <p className="font-semibold">mdjahirulislamtuku@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaPhoneAlt />
                </div>

                <div>
                  <p className="text-sm opacity-80">Phone</p>
                  <p className="font-semibold">+966 50 716 9939</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-sm opacity-80">Location</p>
                  <p className="font-semibold">Madinah, KSA</p>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 dark:text-white/60 mb-6">
                  Follow My Work
                </p>
                <div className="flex space-x-4">
                  <a
                    href={"https://github.com/md-jahirul-islam-tuku"}
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="GitHub"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaGithub className="text-2xl" />
                  </a>
                  <a
                    href={"https://www.linkedin.com/in/md-jahirul-islam-tuku"}
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaLinkedin className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 p-10">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold mb-1 block">Full Name</label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your name"
                    className={`input input-bordered w-full ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold mb-1 block">Email</label>

                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Your email"
                    className={`input input-bordered w-full ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold mb-1 block">Subject</label>

                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Subject"
                  className={`input input-bordered w-full ${
                    errors.subject ? "border-red-500" : ""
                  }`}
                />

                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="font-semibold mb-1 block">Message</label>

                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className={`textarea textarea-bordered w-full ${
                    errors.message ? "border-red-500" : ""
                  }`}
                ></textarea>

                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02] text-white ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? <Loader /> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
