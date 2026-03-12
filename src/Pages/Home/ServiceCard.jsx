import React, { useContext } from "react";
import { FaStar, FaLongArrowAltRight, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

const ServiceCard = ({ info }) => {
  const { _id, title, img, rating, price, description } = info;
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const location = useLocation();
  const isEditServicePage = location.pathname.includes(
    "/dashboard/edit-service",
  );

  // ✅ Fetch Role with React Query
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
    staleTime: 1000 * 60 * 10, // 10 min cache
  });

  // ✅ Update Service Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/services/${id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify(updatedData),
        },
      );
      return res.json();
    },
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Service updated successfully",
          timer: 1500,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
          showConfirmButton: false,
        });

        // Auto refresh services list
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
  });

  // ✅ Delete Mutation with Optimistic UI
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/services/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
        },
      );
      return res.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["services"] });
      const previousServices = queryClient.getQueryData(["services"]);

      queryClient.setQueryData(["services"], (old = []) =>
        old.filter((service) => service._id !== id),
      );

      return { previousServices };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["services"], context.previousServices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Service deleted successfully",
        timer: 1500,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
        showConfirmButton: false,
      });
    },
  });

  const handleDeleteButton = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(_id);
      }
    });
  };

  const handleEditButton = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Update Service",
      html: `
      <div style="width:100%; display:flex; flex-direction:column; gap:15px;">
        
        <div id="swal-stars" style="font-size:30px; text-align:center; cursor:pointer;">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>
        
        <input type="hidden" id="swal-rating" value="${rating}" />

        <div class="flex gap-4">
          <input id="title" class="input input-bordered w-full" placeholder="Title" value="${title}">

          <input id="price" class="input input-bordered w-full" placeholder="Price" value="${price}">
        </div>
     
        <input id="img" class="input input-bordered w-full" placeholder="Image URL" value="${img}">
        
        <textarea id="description" class="textarea textarea-bordered w-full">${description}</textarea>

      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Update",
      focusConfirm: false,
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },

      didOpen: () => {
        const stars = document.querySelectorAll("#swal-stars .star");
        const ratingInput = document.getElementById("swal-rating");

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

      preConfirm: () => ({
        title: document.getElementById("title").value,
        img: document.getElementById("img").value,
        rating: document.getElementById("swal-rating").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
      }),
    });

    if (formValues) {
      updateMutation.mutate({ id: _id, updatedData: formValues });
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="card bg-info/10 rounded-t-lg rounded-b-none mb-4 md:mb-0">
      <figure>
        <img
          src={img}
          alt={title}
          className="w-full h-72 object-cover rounded-t-md"
        />
      </figure>

      <div className="card-body">
        <div className="flex justify-between font-semibold text-accent text-lg">
          <h4>Price: ${price}</h4>
          <h4 className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {rating}
          </h4>
        </div>

        <h2 className="card-title text-3xl font-normal text-start">{title}</h2>

        <p className="text-start">
          {description.slice(0, 65)}
          <span className="font-semibold">...</span>
        </p>

        <div className="text-start mt-2">
          {!isEditServicePage && (
            <Link to={`/services/${_id}`}>
              <button className="btn btn-sm text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]">
                Details <FaLongArrowAltRight className="ml-2" />
              </button>
            </Link>
          )}

          {isEditServicePage &&
            (role === "admin" || role === "super-admin") && (
              <div className="flex justify-between">
                <button
                  onClick={handleEditButton}
                  className="btn btn-sm text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
                >
                  Edit <FaEdit className="ml-2" />
                </button>

                <button
                  onClick={handleDeleteButton}
                  className="btn btn-sm text-white bg-gradient-to-r from-error to-red-500 border-0 hover:shadow-lg hover:shadow-red-400/40 hover:scale-[1.02]"
                >
                  Delete <FaTrash className="ml-2" />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
