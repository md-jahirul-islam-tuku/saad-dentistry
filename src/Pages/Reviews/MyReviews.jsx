import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";
import Review from "./Review";
import Swal from "sweetalert2";
import ScrollToTop from "react-scroll-to-top";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  useTitle("My reviews");
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/reviews?email=${user?.email}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("saad-token")}`,
        },
      },
    )
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          return logOut();
        }
        return res.json();
      })
      .then((data) => {
        setReviews(data);
        setRefresh(!refresh);
      });
  }, [user?.email, refresh, logOut]);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,

      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        confirmButton: "btn btn-success mx-2",
        cancelButton: "btn btn-error mx-2",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/reviews/${id}`,
            {
              method: "DELETE",
              headers: {
                authorization: `Bearer ${localStorage.getItem("saad-token")}`,
              },
            },
          );

          const data = await res.json();

          if (data?.deletedCount > 0) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your review has been deleted.",
              timer: 1500,
              showConfirmButton: false,

              customClass: {
                popup:
                  "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
              },
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Something went wrong!",

            customClass: {
              popup:
                "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
            },
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Your review is safe 🙂",

          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });
      }
    });
  };
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
      <div className="">
        {reviews
          .slice(0)
          .reverse()
          .map((review) => (
            <Review
              key={review?._id}
              review={review}
              handleDelete={handleDelete}
            ></Review>
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
