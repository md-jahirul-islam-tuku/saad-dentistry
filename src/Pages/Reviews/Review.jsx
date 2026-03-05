import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";

const Review = ({ review, handleDelete, handleEdit }) => {
  const { _id, date, name, image, rating, text, email, serviceName } = review;
  const { user } = useContext(AuthContext);

  const handleEditModal = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Edit Your Review",
    html: `
      <div style="width:100%; display:flex; flex-direction:column; gap:15px;">
        
        <div id="swal-stars" style="font-size:32px; text-align:center; cursor:pointer;">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>

        <input type="hidden" id="swal-rating" value="${rating}" />

        <textarea
          id="swal-text"
          class="swal2-textarea"
          style="width:100%; margin:0;"
        >${text}</textarea>

      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Next",
    cancelButtonText: "Cancel",
    customClass: {
      popup:
        "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
    },

    didOpen: () => {
      const stars = document.querySelectorAll("#swal-stars .star");
      const ratingInput = document.getElementById("swal-rating");
      const textarea = document.getElementById("swal-text");

      textarea.focus();

      const setStars = (ratingValue) => {
        stars.forEach((star, index) => {
          if (index < ratingValue) {
            star.style.color = "#facc15";
          } else {
            star.style.color = "#d1d5db";
          }
        });
      };

      const currentRating = Number(ratingInput.value);
      setStars(currentRating);

      stars.forEach((star) => {
        star.addEventListener("click", () => {
          const value = Number(star.dataset.value);
          ratingInput.value = value;
          setStars(value);
        });
      });
    },

    preConfirm: () => {
      const ratingValue = document.getElementById("swal-rating").value;
      const textValue = document.getElementById("swal-text").value;

      if (!ratingValue || !textValue) {
        Swal.showValidationMessage("All fields are required");
        return false;
      }

      return { ratingValue, textValue };
    },
  });

  if (!formValues) return;

  const confirm = await Swal.fire({
    title: "Confirm Update?",
    html: `
      <div class="flex justify-center">
        <div style="text-align:left">
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Rating:</strong> ${formValues.ratingValue}</p>
          <p><strong>Comment:</strong> ${formValues.textValue}</p>
        </div>
      </div>
    `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Update",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#d33",
    customClass: {
      popup:
        "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
    },
  });

  if (confirm.isConfirmed) {
    handleEdit(_id, formValues.ratingValue, formValues.textValue);
  }
};

  return (
    <div className="mt-5 container bg-info/10 shadow-lg flex flex-col p-6 mx-auto divide-y rounded-lg divide-gray-700">
      <div className="flex justify-between p-4">
        <div className="flex space-x-4">
          <img
            src={image}
            alt="User"
            className="object-cover w-12 h-12 rounded-full border border-info"
          />
          <div>
            <h4 className="font-bold">{name}</h4>
            <span className="text-xs">{date}</span>
          </div>
        </div>

        <div className="flex items-center">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="font-semibold text-info dark:text-base-content">
            {rating}
          </span>
        </div>
      </div>

      <div className="p-4 text-justify space-y-2">
        {user?.email === email && (
          <h1 className="text-2xl font-semibold text-center text-accent">
            {serviceName}
          </h1>
        )}
        <p>{text}</p>
      </div>

      {user?.email === email && (
        <div className="pt-5 space-x-3">
          <button
            onClick={handleEditModal}
            className="btn btn-accent mr-3 text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(_id)}
            className="btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
