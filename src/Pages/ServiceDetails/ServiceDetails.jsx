import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import PhotoViewer from "../Shared/PhotoViewer";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import Review from "../Reviews/Review";

const ServiceDetails = () => {
  const [hide, setHide] = useState("hidden");
  const [refresh, setRefresh] = useState(false);
  const { _id, title, img, rating, price, description } = useLoaderData();
  const { user } = useContext(AuthContext);
  const handleShow = () => setHide("");
  const handleClose = () => setHide("hidden");
  const handleRating = (e) => {
    if (e.target.value > 5) {
      Swal.fire("Maximum Rating Point 5");
    }
  };
  const handleDelete = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`http://localhost:5000/reviews/${id}`, {
            method: "delete",
            headers: {
              authorization: `Bearer ${localStorage.getItem("saad-token")}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data?.deletedCount > 0) {
                swalWithBootstrapButtons.fire(
                  "Deleted!",
                  "Your review has been deleted.",
                  "success",
                );
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary review is safe :)",
            "error",
          );
        }
      });
  };
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/review?service=${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setRefresh(!refresh);
      });
  }, [_id, refresh]);
  const handleReview = (e) => {
    e.preventDefault();
    const form = e.target;
    const service = _id;
    const date = new Date().toLocaleString() + "";
    const serviceName = title;
    const name = user.displayName;
    const image = user.photoURL;
    const email = user.email;
    const rating = form.rating.value;
    const text = form.text.value;
    const review = {
      service,
      date,
      serviceName,
      name,
      image,
      email,
      rating,
      text,
    };

    fetch("http://localhost:5000/reviews", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(review),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.acknowledged) {
          Swal.fire("Your review submitted successfully");
          form.reset();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="mb-20 col-span-3">
      <div className="p-4 shadow-lg dark:bg-neutral dark:text-info">
        <div className="flex justify-between pb-4 border-bottom">
          <div className="flex items-center">
            <a
              rel="noopener noreferrer"
              href="/"
              className="mb-0 capitalize font-semibold text-lg text-info"
            >
              {title}
            </a>
          </div>
          <a
            rel="noopener noreferrer"
            href="/"
            className="font-semibold text-lg"
          >
            Price: ${price}
          </a>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <PhotoViewer image={img} />
            <div className="flex items-center text-xs">
              <span className="text-yellow-500 text-lg flex items-center">
                <FaStar className="mr-1" />{" "}
                <span className="text-info font-semibold">{rating}</span>
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-black text-justify">{description}</p>
          </div>
        </div>
      </div>

      {/* All Reviews are here */}
      <div>
        {reviews.length === 0 && (
          <h1 className="text-3xl font-semibold text-gray-300 mt-7">
            No reviews were added
          </h1>
        )}
        ,
        {reviews
          .slice(0)
          .reverse()
          .map((review) => (
            <Review
              key={review?._id}
              review={review}
              hide={hide}
              handleDelete={handleDelete}
            ></Review>
          ))}
      </div>
      <div className="flex justify-between mt-10">
        {/* The button to control review form */}
        <div>
          {user ? (
            <button
              onClick={handleShow}
              className="btn btn-accent text-white"
            >
              Add Your Review
            </button>
          ) : (
            <Link to="/login">
              <label className="btn btn-accent text-white">
                Please login to add a review
              </label>
            </Link>
          )}
        </div>
        <div>
          <Link to={"/"} className="btn btn-accent text-white">
            Book appointment
          </Link>
        </div>
      </div>

      {/* Review form */}
      <form
        onSubmit={handleReview}
        className={`shadow-xl p-5 bg-neutral rounded-xl my-10 ${hide}`}
      >
        <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
          <div className="col-span-full">
            <div className="flex items-center space-x-2 justify-between">
              <div className="flex items-center">
                <img
                  src={user?.photoURL}
                  alt=""
                  className="w-10 h-10 rounded-full dark:bg-gray-500"
                />
                <h1 className="ml-2 text-xl font-semibold text-info">
                  {user?.displayName}
                </h1>
              </div>
              <label
                onClick={handleClose}
                className="btn-accent rounded-full font-semibold btn-sm text-white flex items-center cursor-pointer"
              >
                CLOSE
              </label>
            </div>
          </div>
          <div className="col-span-full sm:col-span-2">
            <input
              onBlur={handleRating}
              name="rating"
              type="text"
              placeholder="Rating point 5 (max)"
              className="text-center w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 dark:border-gray-700 dark:text-gray-900 border-2 p-2"
              required
            />
          </div>
          <div className="col-span-full sm:col-span-4">
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 dark:border-gray-700 dark:text-gray-900 border-2 p-2"
              readOnly
            />
          </div>
          <div className="col-span-full">
            <textarea
              name="text"
              placeholder="Your comments about this service"
              className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 dark:border-gray-700 dark:text-gray-900 border-2 p-2"
              required
            />
          </div>
        </div>
        <button className="btn btn-accent text-white" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ServiceDetails;
