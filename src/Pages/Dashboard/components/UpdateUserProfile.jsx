import React, { useContext, useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import Loader from "../../../Loader/Loader";
import { MdHideSource } from "react-icons/md";

const UpdateUserProfile = () => {
  const { user } = useContext(AuthContext);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // new preview
  };

  // upload to imgbb
  const uploadImage = async () => {
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
      throw new Error("Image upload failed");
    }

    return data.data.url;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;

    setLoading(true);

    try {
      let photoURL = user.photoURL;

      // upload new image if selected
      if (imageFile) {
        photoURL = await uploadImage();
      }

      // 🔥 Firebase update
      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      // 🔥 Backend update
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name,
          photoURL,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated 🚀",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }

    setLoading(false);
  };
  const handleProfileToggle = () => {
    setShowProfileEdit(!showProfileEdit);
  };

  return (
    <div className="mt-28">
      {showProfileEdit ? (
        <button
          onClick={handleProfileToggle}
          className="btn btn-info mb-4 mx-auto text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
        >
          Edit Your Profile
        </button>
      ) : (
        <div className="max-w-md mx-auto bg-gray-100 dark:bg-info/10 p-6 rounded-xl shadow-xl relative">
          <MdHideSource
            onClick={handleProfileToggle}
            className="absolute rounded-full border-0 right-3 top-3 text-3xl text-primary cursor-pointer hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]"
          />
          <h1 className="text-center text-gray-600 dark:text-primary text-2xl font-bold m-5">
            Edit your profile
          </h1>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* image preview */}
            <div
              className="flex justify-center cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <img
                src={preview || user?.photoURL}
                alt="user_photo"
                className="w-24 h-24 rounded-full object-cover border-4 border-info"
              />
            </div>

            {/* hidden input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {/* name */}
            <input
              name="name"
              defaultValue={user?.displayName}
              className="input input-bordered w-full"
            />

            {/* submit */}
            <button className="btn btn-info btn-sm rounded-full w-full text-lg text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02]">
              {loading ? <Loader /> : "Update Profile"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUserProfile;
