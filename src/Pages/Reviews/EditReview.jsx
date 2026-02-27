import React, { useContext } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

const EditReview = () => {
  useTitle("Review Edit");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const storedReview = useLoaderData();
  const { rating, text } = storedReview;
  const handleRating = (e) => {
    if (e.target.value > 5) {
      Swal.fire("Maximum Rating Point 5");
    }
  };
  const handleReview = (e) => {
    e.preventDefault();
    const form = e.target;
    const ratingSub = form.rating.value;
    const textSub = form.text.value;
    const reviewSub = { ratingSub, textSub };
    console.log(reviewSub);
    fetch(`http://localhost:5000/reviews/${storedReview._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("saad-token")}`,
      },
      body: JSON.stringify(reviewSub),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          Swal.fire({
            icon: "success",
            title: "Review updated successfully 🚀",
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup:
                "bg-base-100 dark:bg-slate-900  dark:text-base-content rounded-xl",
            },
          });
        }
        navigate("/myreviews");
      })
      .catch((err) => console.error(err));
  };
  const handleCancel = () => {
    Swal.fire({
      title: "Cancelled",
      text: "Your imaginary review is cancelled :)",
      icon: "error",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    });
    navigate("/myreviews");
  };
  return (
    <div className="lg:pt-56 pt-32 h-[100vh] px-3 lg:px-56">
      <form
        onSubmit={handleReview}
        className="shadow-xl p-5 bg-neutral dark:bg-info/10 rounded-xl mb-10"
      >
        <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
          <div className="col-span-full">
            <div className="flex items-center space-x-2 justify-between">
              <div className="flex items-center">
                <img
                  src={user?.photoURL}
                  alt=""
                  className="w-10 h-10 rounded-full bg-gray-500"
                />
                <h1 className="ml-2 text-xl font-semibold text-info">
                  {user?.displayName}
                </h1>
              </div>
              <label
                onClick={handleCancel}
                className="btn btn-accent btn-sm rounded-full bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
              >
                <h1 className="text-white">Close</h1>
              </label>
            </div>
          </div>
          <div className="col-span-full sm:col-span-2">
            <input
              onBlur={handleRating}
              name="rating"
              type="text"
              defaultValue={rating}
              className="text-center w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 border-gray-700 text-gray-900 dark:text-base-content border-2 p-2 dark:bg-base-100"
              required
            />
          </div>
          <div className="col-span-full sm:col-span-4">
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 border-gray-700 text-gray-900 dark:bg-base-100 dark:text-base-content border-2 p-2"
              readOnly
            />
          </div>
          <div className="col-span-full">
            <textarea
              name="text"
              defaultValue={text}
              className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:ring-violet-400 border-gray-700 text-gray-900 dark:bg-base-100 dark:text-base-content border-2 p-2"
              required
            />
          </div>
        </div>
        <button
          className="btn my-5 btn-accent text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditReview;
