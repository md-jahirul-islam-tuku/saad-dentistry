import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";
import Review from "./Review";
import Swal from "sweetalert2";
import ScrollToTop from "react-scroll-to-top";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyReviews = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useTitle("My Reviews");

  /* ---------------- FETCH USER ROLE ---------------- */

  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = localStorage.getItem("saad-token");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${user.email}`,
        { headers: { authorization: `Bearer ${token}` } },
      );

      const data = await res.json();
      return data?.data?.role || null;
    },
  });

  /* ---------------- FETCH REVIEWS ---------------- */

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", user?.email, role],
    enabled: !!user?.email && !roleLoading,

    queryFn: async () => {
      const token = localStorage.getItem("saad-token");

      const url =
        role === "admin" || role === "super-admin"
          ? `${process.env.REACT_APP_API_BASE_URL}/reviews-all`
          : `${process.env.REACT_APP_API_BASE_URL}/reviews?email=${user.email}`;

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        logOut();
        return [];
      }

      return res.json();
    },
  });

  /* ---------------- DELETE ---------------- */

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
      queryClient.invalidateQueries(["reviews"]);

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    },
  });

  /* ---------------- UPDATE ---------------- */

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
      queryClient.invalidateQueries(["reviews"]);

      Swal.fire({
        icon: "success",
        title: "Review Updated 🚀",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    },
  });

  /* ---------------- DELETE HANDLER ---------------- */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This review will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes delete it",
      confirmButtonColor: "#d33",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  /* ---------------- EDIT MODAL ---------------- */

  const handleEditModal = async (review) => {
    const { _id, rating, text, serviceName } = review;

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
      showCancelButton: true,
      confirmButtonText: "Next",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },

      didOpen: () => {
        const stars = document.querySelectorAll("#swal-stars .star");
        const ratingInput = document.getElementById("swal-rating");

        const setStars = (ratingValue) => {
          stars.forEach((star, index) => {
            star.style.color = index < ratingValue ? "#facc15" : "#d1d5db";
          });
        };

        setStars(ratingInput.value);

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
          Swal.showValidationMessage("All fields required");
          return false;
        }

        return { ratingValue, textValue };
      },
    });

    if (!formValues) return;

    const confirm = await Swal.fire({
      title: "Confirm Update?",
      html: `
        <p><b>Service:</b> ${serviceName}</p>
        <p><b>Rating:</b> ${formValues.ratingValue}</p>
        <p><b>Comment:</b> ${formValues.textValue}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes Update",
      confirmButtonColor: "#16a34a",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    });

    if (confirm.isConfirmed) {
      updateMutation.mutate({
        id: _id,
        rating: formValues.ratingValue,
        text: formValues.textValue,
      });
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <ScrollToTop smooth color="white" />

      <h1 className="text-xl font-bold text-primary mb-6">
        {role === "admin" || role === "super-admin"
          ? "All Reviews"
          : "Your Reviews"}{" "}
        : {reviews.length}
      </h1>

      {/* MOBILE CARD VIEW */}

      <div className="md:hidden space-y-4">
        {reviews
          .slice()
          .reverse()
          .map((review) => (
            <Review
              key={review._id}
              review={review}
              handleDelete={handleDelete}
              handleEdit={() => handleEditModal(review)}
            />
          ))}
      </div>

      {/* DESKTOP TABLE VIEW */}

      <div className="hidden md:block overflow-x-auto bg-white dark:bg-info/10 shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 dark:bg-primary/30 dark:text-base-content text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-primary/30">
            {reviews
              .slice()
              .reverse()
              .map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-50 dark:hover:bg-info/30"
                >
                  <td className="px-4 py-3">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full border-2 border-yellow-500 object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 font-semibold">{review.name}</td>

                  <td className="px-4 py-3 font-semibold">
                    {review.serviceName}
                  </td>

                  <td className="px-4 py-3">
                    ⭐ {review.ratingSub || review.rating}
                  </td>

                  <td className="px-4 py-3 max-w-xs truncate">
                    {review.textSub || review.text}
                  </td>

                  <td className="px-4 py-3 text-gray-600 dark:text-base-content">
                    {new Date(review.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {user?.email === review.email && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditModal(review)}
                          className="p-1 bg-blue-100 hover:bg-blue-200 rounded tooltip tooltip-info"
                          data-tip="Edit"
                        >
                          <FaEdit className="text-blue-600 text-2xl" />
                        </button>

                        <button
                          onClick={() => handleDelete(review._id)}
                          className="p-1 bg-red-100 hover:bg-red-200 rounded tooltip tooltip-error"
                          data-tip="Delete"
                        >
                          <FaTrash className="text-red-600 text-2xl" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No Reviews Found 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyReviews;
