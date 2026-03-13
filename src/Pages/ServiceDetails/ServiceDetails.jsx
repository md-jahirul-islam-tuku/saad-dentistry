import React, { useContext } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PhotoViewer from "../Shared/PhotoViewer";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import Review from "../Reviews/Review";
import ScrollToTop from "react-scroll-to-top";
import { scroller } from "react-scroll";

const ServiceDetails = () => {
  const { _id, title, img, rating, price, description } = useLoaderData();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* =============================
      Fetch Reviews
  ============================== */

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", _id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/review?service=${_id}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
        },
      );
      return res.json();
    },
  });

  /* =============================
      Update Review
  ============================== */

  const updateMutation = useMutation({
    mutationFn: async ({ id, rating, text }) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify({
            ratingSub: rating,
            textSub: text,
          }),
        },
      );

      return res.json();
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Review updated successfully 🚀",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });

      queryClient.invalidateQueries(["reviews", _id]);
    },
  });

  /* =============================
      Delete Review
  ============================== */

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
        },
      );

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", _id]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
      }
    });
  };

  const handleEdit = (id, rating, text) => {
    updateMutation.mutate({ id, rating, text });
  };

  /* =============================
      Post Review
  ============================== */

  const postMutation = useMutation({
    mutationFn: async (review) => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("saad-token")}`,
        },
        body: JSON.stringify(review),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      return data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Review submitted 🚀",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });

      queryClient.invalidateQueries(["reviews", _id]);
    },
  });

  /* =============================
      Add Review SweetAlert
  ============================== */

  const handlePostReview = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Your Review",

      html: `
      <div style="width:100%;display:flex;flex-direction:column;gap:10px">

        <div id="swal-stars" style="font-size:32px;text-align:center">
          <span class="star" style="color:#d1d5db" data-value="1">★</span>
          <span class="star" style="color:#d1d5db" data-value="2">★</span>
          <span class="star" style="color:#d1d5db" data-value="3">★</span>
          <span class="star" style="color:#d1d5db" data-value="4">★</span>
          <span class="star" style="color:#d1d5db" data-value="5">★</span>
        </div>

        <input type="hidden" id="swal-rating"/>

        <textarea
        id="swal-text"
        placeholder="Your comments"
        class="swal2-textarea"
        style="width:100%;margin:0"
        ></textarea>

      </div>
      `,

      didOpen: () => {
        const stars = document.querySelectorAll(".star");
        const ratingInput = document.getElementById("swal-rating");

        stars.forEach((star) => {
          star.style.cursor = "pointer";

          star.addEventListener("click", () => {
            const value = star.getAttribute("data-value");

            ratingInput.value = value;

            stars.forEach((s, index) => {
              if (index < value) {
                s.style.color = "#facc15";
              } else {
                s.style.color = "#d1d5db";
              }
            });
          });
        });
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Next",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },

      preConfirm: () => {
        const rating = document.getElementById("swal-rating").value;
        const text = document.getElementById("swal-text").value;

        if (!rating || !text) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }

        return { rating, text };
      },
    });

    if (!formValues) return;

    const confirm = await Swal.fire({
      title: "Confirm Review?",
      html: `
      <div style="text-align:left">
        <p><strong>Service:</strong> ${title}</p>
        <p><strong>Rating:</strong> ${formValues.rating}</p>
        <p><strong>Comment:</strong> ${formValues.text}</p>
      </div>
      `,
      icon: "question",
      showCancelButton: true,
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
      confirmButtonText: "Yes, Submit",
      confirmButtonColor: "#16a34a",
    });

    if (!confirm.isConfirmed) return;

    const review = {
      service: _id,
      date: new Date().toLocaleString(),
      serviceName: title,
      name: user.displayName,
      image: user.photoURL,
      email: user.email,
      rating: formValues.rating,
      text: formValues.text,
    };

    postMutation.mutate(review);
  };

  const userReview = reviews.find((review) => review?.email === user?.email);

  const handleNavigate = () => {
    navigate("/");

    setTimeout(() => {
      scroller.scrollTo("appointment", {
        smooth: true,
        duration: 2000,
        offset: -80,
      });
    }, 500);
  };

  return (
    <div className="mb-20 col-span-3">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />

      {/* Service Info */}

      <div className="p-4 shadow-lg bg-info/10 rounded-lg">
        <div className="flex justify-between pb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <span className="font-semibold">Price: ${price}</span>
        </div>

        <PhotoViewer image={img} />

        <div className="flex items-center text-yellow-500 text-lg mt-2">
          <FaStar className="mr-1" /> {rating}
        </div>

        <p className="mt-4 text-justify">{description}</p>
      </div>

      {/* Reviews */}

      <h2 className="my-8 text-lg font-semibold">Users Review</h2>

      {isLoading && (
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <h1 className="text-2xl text-gray-400">No reviews were added</h1>
      )}

      {!isLoading &&
        reviews
          .slice()
          .reverse()
          .map((review) => (
            <Review
              key={review._id}
              review={review}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}

      {/* Buttons */}

      <div className="flex justify-between mt-10">
        {user ? (
          <button
            onClick={handlePostReview}
            disabled={userReview}
            className="btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Add Your Review
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Add Your Review
          </Link>
        )}

        {user ? (
          <button
            onClick={handleNavigate}
            className="btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Appointment Guideline
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            Appointment Guideline
          </Link>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
