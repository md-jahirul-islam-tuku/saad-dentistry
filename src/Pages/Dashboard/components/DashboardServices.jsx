import React from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import PageLoader from "../../../Loader/PageLoader";

const DashboardServices = () => {
  const queryClient = useQueryClient();

  // Fetch Services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/services`);
      return res.json();
    },
  });

  // Update Service
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
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });

        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
  });

  // Delete Service
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
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    },
  });

  const handleDeleteButton = (id) => {
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
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEditButton = async (service) => {
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

        <input type="hidden" id="swal-rating" value="${service.rating}" />

        <input id="title" class="input input-bordered w-full" value="${service.title}">
        <input id="price" class="input input-bordered w-full" value="${service.price}">
        <input id="img" class="input input-bordered w-full" value="${service.img}">

        <textarea id="description" class="textarea textarea-bordered w-full">${service.description}</textarea>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",

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

        setStars(Number(ratingInput.value));

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
      updateMutation.mutate({
        id: service._id,
        updatedData: formValues,
      });
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold">Total Services : {services.length}</h2>

      {/* Desktop Table */}

      <div className="hidden md:block overflow-x-auto bg-white dark:bg-info/10 shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 dark:bg-primary/30 dark:text-base-content text-sm">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-primary/30">
            {services.map((service) => (
              <tr
                key={service._id}
                className="hover:bg-gray-50 dark:hover:bg-info/30"
              >
                <td className="px-4 py-3">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-12 h-12 rounded border-2 border-info object-cover"
                  />
                </td>

                <td className="px-4 py-3 font-semibold">{service.title}</td>

                <td className="px-4 py-3">${service.price}</td>

                <td className="px-4 py-3">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {service.rating}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditButton(service)}
                      className="p-1 bg-blue-100 hover:bg-blue-200 rounded tooltip tooltip-info"
                      data-tip="Edit"
                    >
                      <FaEdit className="text-blue-600 text-2xl" />
                    </button>

                    <button
                      onClick={() => handleDeleteButton(service._id)}
                      className="p-1 bg-red-100 hover:bg-red-200 rounded tooltip tooltip-error"
                      data-tip="Delete"
                    >
                      <FaTrash className="text-red-600 text-2xl" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}

      <div className="md:hidden grid gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white dark:bg-info/10 shadow-md rounded-xl overflow-hidden border dark:border-primary/30"
          >
            <img
              src={service.img}
              alt={service.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-bold">{service.title}</h3>

              <div className="flex items-center justify-center gap-1 text-yellow-500">
                <FaStar />
                <span>{service.rating}</span>
              </div>

              <p className="text-info font-semibold">${service.price}</p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEditButton(service)}
                  className="btn btn-info btn-sm font-bold text-white flex-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteButton(service._id)}
                  className="btn btn-error font-bold btn-sm text-white flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardServices;
