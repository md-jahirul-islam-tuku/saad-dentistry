import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";
import Review from "./Review";
import Swal from "sweetalert2";
import ScrollToTop from "react-scroll-to-top";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
      if (!token) return null;

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${user.email}`,
        {
          headers: { authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return null;

      const data = await res.json();
      return data?.data?.role || null;
    },
    staleTime: 1000 * 60 * 10,
  });

  /* ---------------- FETCH REVIEWS ---------------- */

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", user?.email, role],
    enabled: !!user?.email && !roleLoading,

    queryFn: async () => {
      const token = localStorage.getItem("saad-token");

      const url =
        role === "admin"
          ? `${process.env.REACT_APP_API_BASE_URL}/reviews-all`
          : `${process.env.REACT_APP_API_BASE_URL}/reviews?email=${user.email}`;

      const res = await fetch(url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        logOut();
        return [];
      }

      return res.json();
    },
  });

  /* ---------------- DELETE MUTATION ---------------- */

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

  /* ---------------- UPDATE MUTATION ---------------- */

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
      text: "This review will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",

      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        confirmButton: "btn btn-error mx-2",
        cancelButton: "btn btn-success mx-2",
      },

      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  /* ---------------- EDIT HANDLER ---------------- */

  const handleEdit = (id, rating, text) => {
    updateMutation.mutate({ id, rating, text });
  };

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="pt-32 px-3 md:px-10 lg:px-56 min-h-screen lg:mb-10">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />

      <h1 className="text-xl font-bold text-primary">
        {role === "admin" ? "All reviews" : "Your Review"} : {reviews.length}
      </h1>

      <div>
        {reviews
          .slice(0)
          .reverse()
          .map((review) => (
            <Review
              key={review._id}
              review={review}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
      </div>

      {reviews.length === 0 && (
        <h1 className="text-3xl font-semibold text-gray-300">
          No reviews were added
        </h1>
      )}
    </div>
  );
};

export default MyReviews;
