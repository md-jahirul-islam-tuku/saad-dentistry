import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";
import useTitle from "../../hooks/useTitle";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const BeDoctor = () => {
  useTitle("Registration");
  const { user } = useContext(AuthContext);
  const userEmail = user?.email;

  const navigate = useNavigate();
  const fileRef = useRef(null);

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
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
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
  // Image handlers
  // --------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image must be under 2MB", "error");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  console.log(imageFile);
  const handleCancelImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // --------------------
  // Upload to imgbb
  // --------------------
  const uploadImageToImgbb = async () => {
    if (!imageFile) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=b425c34f0debd616d9ceb086ef1f326c`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!data.success) {
      console.error(data);
      throw new Error("Image upload failed");
    }

    return data.data.url;
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

    let photoURL = "";
    try {
      if (imageFile) {
        photoURL = await uploadImageToImgbb();
      }
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "Image upload failed", "error");
      return;
    }

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
      email: userEmail,
    };

    fetch(`http://localhost:5000/lalumia`, {
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
          handleCancelImage();
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
        <label className="cursor-pointer mb-6 inline-block">
          {preview ? (
            <div className="flex gap-4 items-center">
              <img
                src={preview}
                alt="doctor"
                className="w-24 h-24 rounded-full border-4 border-info object-cover"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="text-red-500 underline font-semibold"
              >
                Change image
              </button>
            </div>
          ) : (
            <FaUserCircle className="text-6xl text-gray-400 hover:text-info" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {/* Inputs */}
        {[
          ["name", "Name", "Dr. Arif Hossain"],
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
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BeDoctor;
