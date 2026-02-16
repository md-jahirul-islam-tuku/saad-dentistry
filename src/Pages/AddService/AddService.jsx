import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useTitle from "../../hooks/useTitle";
import Loader from "../../Loader/Loader";
import { FaUserCircle } from "react-icons/fa";

const AddService = () => {
  // useTitle("Add Service");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image must be under 2MB", "error");
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
      `https://api.imgbb.com/1/upload?key=b425c34f0debd616d9ceb086ef1f326c`,
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

    return data.data.url;
  };
  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    let photoURL = "";
    try {
      if (imageFile) {
        photoURL = await uploadImageToImgbb();
      }
    } catch (err) {
      Swal.fire("Error", "Image upload failed", "error");
      return;
    }
    const form = e.target;
    const title = form.title.value;
    const rating = form.rating.value;
    const price = form.price.value;
    const description = form.description.value;

    const service = {
      title: title,
      img: photoURL,
      rating: rating,
      price: price,
      description: description,
    };
    fetch(`http://localhost:5000/services`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(service),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.acknowledged) {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Your New Service added successfully",
            showConfirmButton: false,
            timer: 2000,
          });
          form.reset();
          setLoading(false);
          navigate("/services");
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="mx-auto">
      <form
        onSubmit={handleAddService}
        className="card-body bg-gray-100 shadow-xl rounded-xl mx-auto"
      >
        <h1 className="text-3xl font-bold my-5 text-start">Add New Service</h1>
        {/* Image */}
        <label className="cursor-pointer mb-6 inline-block">
          {preview ? (
            <div className="flex gap-4 items-center">
              <img
                src={preview}
                alt="doctor"
                className="w-24 h-24 rounded-full border-4 border-info object-cover"
              />
              <button
                type="button"
                onClick={handleCancelImage}
                className="text-red-500 underline font-semibold"
              >
                Change image
              </button>
            </div>
          ) : (
            <FaUserCircle className="text-6xl text-gray-400 hover:text-info" />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Title</span>
          </label>
          <input
            name="title"
            type="Text"
            placeholder="Title"
            className="input input-bordered"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Rating</span>
            </label>
            <input
              name="rating"
              type="Text"
              placeholder="Rating"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text text-lg font-semibold">Price</span>
            </label>
            <input
              name="price"
              type="Text"
              placeholder="Price"
              className="input input-bordered"
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">
              Description
            </span>
          </label>
          <input
            name="description"
            type="Text"
            placeholder="Description"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn btn-info text-lg font-bold text-white"
          >
            {loading ? <Loader /> : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
