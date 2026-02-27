import React, { useContext, useEffect, useState } from "react";
import { FaStar, FaLongArrowAltRight, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import PhotoViewer from "../Shared/PhotoViewer";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

const ServiceCard = ({ info }) => {
  const { _id, title, img, rating, price, description } = info;
  const { user, loading } = useContext(AuthContext);

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    fetch(`http://localhost:5000/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data?.data?.role || null);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });
  }, [user?.email]);

  // Wait for both auth and role loading
  if (loading || roleLoading) {
    return (
      <div className="w-5 h-5 border-3 border-dashed rounded-full animate-spin border-white ml-[45%]"></div>
    );
  }
  const handleEditButton = (info) => {
    console.log(info._id);
    Swal.fire({
      title: "Update Service",
      html: `
        <div class="space-y-3">
          <input id="title" class="input input-bordered w-full" placeholder="Title" value="${info.title}">
          <input id="img" class="input input-bordered w-full" placeholder="Image URL" value="${info.img}">
          <div class="flex justify-center gap-3">
          <input id="rating" class="input input-bordered w-full" placeholder="Rating" value="${info.rating}">
          <input id="price" class="input input-bordered w-full" placeholder="Price" value="${info.price}">
          </div>
          <textarea id="description" class="textarea textarea-bordered w-full" placeholder="Description">${info.description}</textarea>
        </div>
      `,
      focusConfirm: false,
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900  dark:text-base-content rounded-xl",
        confirmButton: "btn btn-success mx-2",
        cancelButton: "btn btn-error mx-2",
      },
      buttonsStyling: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          title: document.getElementById("title").value,
          img: document.getElementById("img").value,
          rating: document.getElementById("rating").value,
          price: document.getElementById("price").value,
          description: document.getElementById("description").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/services/${info._id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(result.value),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.modifiedCount > 0) {
              Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Service updated successfully",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                  popup:
                    "bg-base-100 dark:bg-slate-900  dark:text-base-content rounded-xl",
                },
              });
            }
          });
      }
    });
  };

  return (
    <div className="card bg-info/5 rounded-t-lg rounded-b-none mb-3 md:mb-0">
      <figure>
        <PhotoViewer image={img} />
      </figure>
      <div className="card-body ">
        <div className="flex justify-between font-semibold text-accent text-lg">
          <h4>
            Price: <span>${price}</span>
          </h4>
          <h4 className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> <span>{rating}</span>
          </h4>
        </div>
        <h2 className="card-title text-3xl font-normal">{title}</h2>
        <p className="text-left font-normal">
          {description.slice(0, 70)}{" "}
          <span className="font-semibold">. . .</span>
        </p>
        <div className="card-actions justify-between">
          <Link to={`/services/${_id}`}>
            <button className="btn btn-sm font-bold text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]">
              Details <FaLongArrowAltRight className="ml-3" />
            </button>
          </Link>
          {role === "admin" && (
            <button
              onClick={() => handleEditButton(info)}
              className="btn btn-sm font-bold text-white  bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
            >
              Edit <FaEdit className="ml-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
