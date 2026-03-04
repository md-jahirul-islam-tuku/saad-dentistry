import React, { useContext, useState } from "react";
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
  const [hide, setHide] = useState("hidden");

  // ✅ Fetch Reviews with React Query
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", _id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/review?service=${_id}`
      );
      return res.json();
    },
  });

  // ✅ Delete Review Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
        }
      );
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["reviews", _id]);
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // ✅ Post Review Mutation
  const postMutation = useMutation({
    mutationFn: async (review) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/reviews`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(review),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Review submitted 🚀",
        timer: 1500,
        showConfirmButton: false,
      });
      setHide("hidden");
      queryClient.invalidateQueries(["reviews", _id]);
    },
  });

  const handlePostReview = (e) => {
    e.preventDefault();
    const form = e.target;

    const review = {
      service: _id,
      date: new Date().toLocaleString(),
      serviceName: title,
      name: user.displayName,
      image: user.photoURL,
      email: user.email,
      rating: form.rating.value,
      text: form.text.value,
    };

    postMutation.mutate(review);
  };

  const userReview = reviews.find(
    (review) => review?.email === user?.email
  );

  const handleNavigate = () => { navigate("/"); setTimeout(() => { scroller.scrollTo("appointment", { smooth: true, duration: 2000, offset: -80, }); }, 500); };

  return (
    <div className="mb-20 col-span-3">
      <ScrollToTop smooth />

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
        <h1 className="text-2xl text-gray-400">
          No reviews were added
        </h1>
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
            />
          ))}

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        {user ? (
          <button
            onClick={() => setHide("")}
            disabled={userReview}
            className="btn btn-accent text-white"
          >
            Add Your Review
          </button>
        ) : (
          <Link to="/login" className="btn btn-accent text-white">
            Add Your Review
          </Link>
        )}

        {user ? (
          <button
            onClick={handleNavigate}
            className="btn btn-accent text-white"
          >
            Book Appointment
          </button>
        ) : (
          <Link to="/login" className="btn btn-accent text-white">
            Book Appointment
          </Link>
        )}
      </div>

      {/* Review Form */}
      <form
        onSubmit={handlePostReview}
        className={`shadow-xl p-5 rounded-xl my-10 ${hide}`}
      >
        <input
          name="rating"
          type="number"
          max="5"
          placeholder="Rating (max 5)"
          className="w-full border p-2 mb-3"
          required
        />

        <textarea
          name="text"
          placeholder="Your comments"
          className="w-full border p-2 mb-3"
          required
        />

        <button className="btn btn-accent text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ServiceDetails;