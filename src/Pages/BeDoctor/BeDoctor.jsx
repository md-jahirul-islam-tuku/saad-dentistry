import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../hooks/useTitle";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Loader from "../../Loader/Loader";

const BeDoctor = () => {
  useTitle("Registration");
  const { user } = useContext(AuthContext);
  const { email, displayName, photoURL } = user;

  const navigate = useNavigate();
  // --------------------
  // Days
  // --------------------
  const days = [
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];
  const MAX_DAYS = 4;

  // --------------------
  // States
  // --------------------
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------
  // Availability logic
  // --------------------
  const handleDayChange = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      if (prev.length >= MAX_DAYS) return prev;
      return [...prev, day];
    });
  };
  // --------------------
  // Submit
  // --------------------
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      Swal.fire("Warning", "Select at least one available day", "warning");
      return;
    }
    setLoading(true);
    const form = e.target;
    const doctor = {
      doctorImage: photoURL,
      name: form.name.value,
      education: form.education.value,
      registrationNumber: form.registrationNumber.value,
      specialty: form.specialty.value,
      workingAt: form.workingAt.value,
      experience: Number(form.experience.value),
      fee: Number(form.fee.value),
      availability: selectedDays,
      email,
    };

    fetch(`http://localhost:5000/doctors-all`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(doctor),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.acknowledged) {
          Swal.fire("Success", "Doctor added successfully", "success");
          form.reset();
          setSelectedDays([]);
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Server error", "error");
      })
      .finally(() => setLoading(false));
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="pt-32">
      <form
        onSubmit={handleAddDoctor}
        className="card-body w-11/12 md:w-3/5 lg:w-1/2 bg-gray-100 shadow-xl rounded-xl mx-auto mb-20"
      >
        <h1 className="text-3xl font-bold pb-6">Doctor Registration</h1>

        {/* Image */}
        <div className="flex gap-4 items-center">
          <img
            src={photoURL}
            alt="doctor"
            className="w-24 h-24 rounded-full border-4 border-info object-cover"
          />
        </div>
        {/* Name */}
        <label className="label font-semibold">Name</label>
        <input
          name="name"
          defaultValue={displayName}
          className="input input-bordered"
          required
        />

        {/* Inputs */}
        {[
          ["education", "Education", "MBBS, FCPS"],
          ["registrationNumber", "Registration No", "DMC-10234"],
          ["specialty", "Specialty", "Internal Medicine"],
          ["workingAt", "Working At", "Dhaka Medical College"],
        ].map(([name, label, placeholder]) => (
          <div key={name} className="form-control">
            <label className="label font-semibold">{label}</label>
            <input
              name={name}
              placeholder={placeholder}
              className="input input-bordered"
              required
            />
          </div>
        ))}

        {/* Availability */}
        <fieldset className="mt-4">
          <label className="font-semibold">Select up to 4 Available Days</label>
          <div className="grid grid-cols-2 gap-3 mt-2 border p-4 rounded-lg bg-white">
            {days.map((day) => {
              const checked = selectedDays.includes(day);
              const disabled = !checked && selectedDays.length >= MAX_DAYS;

              return (
                <label
                  key={day}
                  className={`flex gap-3 items-center ${
                    disabled ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-info"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => handleDayChange(day)}
                  />
                  {day}
                </label>
              );
            })}
            <p className="text-info text-sm col-span-2">
              Selected {selectedDays.length}/{MAX_DAYS}
            </p>
          </div>
        </fieldset>

        {/* Experience + Fee */}
        <div className="flex gap-4 mt-4">
          <input
            name="experience"
            type="number"
            placeholder="Experience (years)"
            className="input input-bordered w-1/2"
            required
          />
          <input
            name="fee"
            type="number"
            placeholder="Fee"
            className="input input-bordered w-1/2"
            required
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="btn btn-info mt-6 text-lg text-white"
        >
          {loading ? <Loader /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BeDoctor;
