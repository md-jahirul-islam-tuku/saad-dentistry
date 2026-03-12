import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Loader from "../../Loader/Loader";
import PageLoader from "../../Loader/PageLoader";

const EditDoctor = () => {
  const { dbUser } = useContext(AuthContext);
  const user = dbUser?.data;
  const email = user?.email;
  const navigate = useNavigate();

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

  const [doctor, setDoctor] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------
  // Fetch doctor
  // --------------------
  useEffect(() => {
    if (!email) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/doctor-by-email/${email}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Doctor not found");
        }
        return res.json();
      })
      .then((data) => {
        setDoctor(data);
        setSelectedDays(data?.availability || []);
      })
      .catch((err) => console.error(err));
  }, [email]);

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
  // Submit update
  // --------------------
  const handleUpdateDoctor = (e) => {
    e.preventDefault();

    if (selectedDays.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Select at least one available day",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
      return;
    }

    setLoading(true);

    const form = e.target;

    const updatedDoctor = {
      doctorImage: user?.photoURL,
      name: form.name.value,
      education: form.education.value,
      registrationNumber: form.registrationNumber.value,
      specialty: form.specialty.value,
      workingAt: form.workingAt.value,
      experience: Number(form.experience.value),
      fee: Number(form.fee.value),
      availability: selectedDays,
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/doctors-all/${doctor._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
      body: JSON.stringify(updatedDoctor),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Updated",
            text: "Doctor information updated successfully",
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup:
                "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
            },
          });

          navigate("/dashboard");
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
          timer: 1500,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
          showConfirmButton: false,
        });
      })
      .finally(() => setLoading(false));
  };

  if (!doctor) {
    return <div className="mt-10"><PageLoader /></div>;
  }

  return (
    <div className="">
      <h1 className="text-center text-xl font-bold m-5">
        Edit your doctor profile
      </h1>
      <form
        onSubmit={handleUpdateDoctor}
        className="card-body bg-gray-100 dark:bg-info/10 shadow-xl rounded-xl mx-auto mb-20 lg:w-4/6"
      >
        <h1 className="text-3xl font-bold pb-6">Edit Doctor</h1>

        {/* Image */}
        <div className="flex gap-4 items-center">
          <img
            src={doctor?.doctorImage}
            alt="doctor"
            className="w-24 h-24 rounded-full border-4 border-info object-cover"
          />
        </div>

        {/* Name */}
        <label className="label font-semibold">Name</label>
        <input
          name="name"
          defaultValue={doctor?.name}
          className="input input-bordered"
          required
        />

        {/* Inputs */}
        {[
          ["education", "Education"],
          ["registrationNumber", "Registration No"],
          ["specialty", "Specialty"],
          ["workingAt", "Working At"],
        ].map(([name, label]) => (
          <div key={name} className="form-control">
            <label className="label font-semibold">{label}</label>
            <input
              name={name}
              defaultValue={doctor?.[name]}
              className="input input-bordered"
              required
            />
          </div>
        ))}

        {/* Availability */}
        <fieldset className="mt-4">
          <label className="font-semibold">Select up to 4 Available Days</label>

          <div className="grid grid-cols-2 gap-3 mt-2 border dark:border-primary/30 p-4 rounded-lg bg-white dark:bg-info/20">
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
            defaultValue={doctor?.experience}
            placeholder="Experience (years)"
            className="input input-bordered w-1/2"
            required
          />

          <input
            name="fee"
            type="number"
            defaultValue={doctor?.fee}
            placeholder="Fee $"
            className="input input-bordered w-1/2"
            required
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="btn btn-info btn-sm mt-6 rounded-full text-lg text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
        >
          {loading ? <Loader /> : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditDoctor;
