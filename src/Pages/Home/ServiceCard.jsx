import React, { useContext } from "react";
import { FaStar, FaLongArrowAltRight, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import Swal from "sweetalert2";

const ServiceCard = ({ info }) => {
  const { _id, title, img, rating, price, description } = info;
  const { user, loading } = useContext(AuthContext);
  const queryClient = useQueryClient();

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
          headers: { "content-type": "application/json" },
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

        // ✅ Auto refresh services list
        queryClient.invalidateQueries(["services"]);
      }
    },
  });

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  const handleEditButton = () => {
    Swal.fire({
      title: "Update Service",
      html: `
        <div class="space-y-3">
          <input id="title" class="input input-bordered w-full" placeholder="Title" value="${title}">
          <input id="img" class="input input-bordered w-full" placeholder="Image URL" value="${img}">
          <div class="flex gap-3">
            <input id="rating" class="input input-bordered w-full" placeholder="Rating" value="${rating}">
            <input id="price" class="input input-bordered w-full" placeholder="Price" value="${price}">
          </div>
          <textarea id="description" class="textarea textarea-bordered w-full">${description}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      customClass: {
        popup:
          "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
      },
      focusConfirm: false,
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
        updateMutation.mutate({
          id: _id,
          updatedData: result.value,
        });
      }
    });
  };

  return (
    <div className="card bg-info/5 rounded-t-lg rounded-b-none mb-4 md:mb-0">
      <figure>
        <img
          src={img}
          alt="img"
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

        <div className="card-actions justify-between">
          <Link to={`/services/${_id}`}>
            <button className="btn btn-sm text-white  bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]">
              Details <FaLongArrowAltRight className="ml-2" />
            </button>
          </Link>

          {role === "admin" && (
            <button
              onClick={handleEditButton}
              className="btn btn-sm text-white  bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
            >
              Edit <FaEdit className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
