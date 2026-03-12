import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Loader/Loader";
import { HiOutlineUpload } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  // --------------------
  // Handle Image Change
  // --------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Image must be under 2MB",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCancelImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // --------------------
  // Upload to imgbb
  // --------------------
  const uploadImageToImgbb = async () => {
    if (!imageFile) throw new Error("No image selected");

    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!data.success) {
      console.error(data);
      throw new Error("Image upload failed");
    }

    return data.data.url; // ✅ শুধু image URL
  };

  // --------------------
  // React Query Mutation
  // --------------------
  const addServiceMutation = useMutation({
    mutationFn: async (service) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/services`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("saad-token")}`,
          },
          body: JSON.stringify(service),
        },
      );

      return res.json();
    },
    onSuccess: (data) => {
      if (data?.acknowledged) {
        queryClient.invalidateQueries({ queryKey: ["services"] });

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Your New Service added successfully",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
          },
        });

        setLoading(false);
        navigate("/dashboard/edit-service");
      }
    },
    onError: (err) => {
      console.error(err);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add service",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
    },
  });

  // --------------------
  // Handle Add Service
  // --------------------
  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);

    let photoURL = "";

    try {
      if (imageFile) {
        photoURL = await uploadImageToImgbb(); // ✅ শুধুমাত্র URL
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Image upload failed",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-base-100 dark:bg-slate-900 dark:text-base-content rounded-xl",
        },
      });
      return;
    }

    const form = e.target;
    const service = {
      title: form.title.value,
      img: photoURL, // ✅ deleteURL বাদ
      rating: rating,
      price: form.price.value,
      description: form.description.value,
    };

    addServiceMutation.mutate(service);
  };

  // --------------------
  // JSX
  // --------------------
  return (
    <div className="mx-auto">
      <form
        onSubmit={handleAddService}
        className="card-body bg-gray-100 dark:bg-info/10 shadow-xl rounded-xl mx-auto lg:w-4/6"
      >
        <h1 className="text-3xl font-bold my-5 text-start">Add New Service</h1>

        {/* Image */}
        <label className="cursor-pointer mb-6 inline-block">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="doctor"
                className="w-full h-56 object-cover border-4 border-info rounded-xl border-dashed"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="text-accent font-semibold mt-2 absolute right-2 top-0 bg-white px-2 rounded-lg pb-1"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="w-full h-56 border-4 border-info/50 rounded-xl border-dashed bg-primary/10 dark:bg-info/20 text-xl font-semibold place-content-center place-items-center">
              <h1 className="flex items-center gap-2">
                <HiOutlineUpload className="text-3xl" />
                Upload image
              </h1>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Rating</span>
            </label>

            <div className="flex items-center gap-2 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <input type="hidden" name="rating" value={rating} required />
          </div>

          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Price</span>
            </label>
            <input
              name="price"
              type="text"
              placeholder="Price"
              className="input input-bordered"
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Title</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="Title"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">
              Description
            </span>
          </label>
          <input
            name="description"
            type="text"
            placeholder="Description"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn text-lg font-bold text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          >
            {loading ? <Loader /> : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
