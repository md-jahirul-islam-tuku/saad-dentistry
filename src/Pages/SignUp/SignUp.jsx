import React, { useContext, useRef, useState } from "react";
import bgImg from "../../Assets/img/signup-bg.png";
import google from "../../Assets/Icons/google.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { updateProfile } from "firebase/auth";
import useTitle from "../../hooks/useTitle";
import { setAuthToken } from "../../API/auth";
import Swal from "sweetalert2";
import { FaUserCircle } from "react-icons/fa";
import Loader from "../../Loader/Loader";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const SignUp = () => {
  const { userSignUp, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  useTitle("Sign Up");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showEmailRules, setShowEmailRules] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const emailChecks = {
    hasTextBeforeAt: /^[^\s@]+/.test(emailValue),
    hasAt: /@/.test(emailValue),
    hasDomain: /\.[^\s@]+$/.test(emailValue),
  };

  const isEmailValid =
    emailChecks.hasTextBeforeAt && emailChecks.hasAt && emailChecks.hasDomain;

  const rules = {
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /\d/.test(passwordValue),
    special: /[@$!%*?&#]/.test(passwordValue),
    length: passwordValue.length >= 8,
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      // 🔎 Step 1: Check email first
      const checkRes = await fetch(
        `http://localhost:5000/users/check/${email}`,
      );

      const checkData = await checkRes.json();
      console.log("email check", checkRes);

      if (!checkRes.ok) {
        setLoading(false);
        setPreview(null);
        form.reset();
        return Swal.fire("Error Check Email", checkData.message, "error");
      }

      // ✅ Step 2: Only now upload image
      let photoURL = "";
      if (imageFile) {
        photoURL = await uploadImageToImgbb();
      }
      console.log("image check", imageFile, photoURL);

      // ✅ Step 3: Firebase signup
      const result = await userSignUp(email, password);
      console.log(result);
      await updateProfile(result.user, {
        displayName: name,
        photoURL,
      }).then((res)=>{console.log("update res",res)}).catch((error)=>{console.log("error mes",error)});

      // ✅ Step 4: Save to DB
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          photoURL,
        }),
      });

      setAuthToken(result.user);

      form.reset();
      setLoading(false);

      Swal.fire("Success!", "Account created successfully", "success");
      navigate("/");
    } catch (error) {
      setLoading(false);
      Swal.fire("Error Total", error.message, "error");
    }
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then(async (result) => {
        const { email, displayName, photoURL } = result?.user;
        try {
          const response = await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: displayName,
              email: email,
              photoURL: photoURL,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to create user");
          }

          console.log("User saved:", data);
        } catch (error) {
          console.error("User Save Error:", error);
        }

        const user = result.user;
        const currentUser = {
          email: user.email,
        };
        console.log(currentUser);
        fetch("http://localhost:5000/jwt", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(currentUser),
        })
          .then((res) => res.json())
          .then((data) => {
            localStorage.setItem("saad-token", data.token);
            navigate(from, { replace: true });
          });
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="bg-info/5">
      <div
        className="hero min-h-screen flex"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="w-1/2 hidden lg:block"></div>
        <div className="card lg:w-1/3 w-[90%] mx-auto lg:mx-0 lg:left-20">
          <form onSubmit={handleSignUp} className="card-body pb-0 space-y-0  dark:bg-base-100 dark:border-blue-200/10">
            <h1 className="text-3xl font-bold text-info">Please Sign Up</h1>
            <div className="divider"></div>
            {/* Image */}
            <label className="cursor-pointer inline-block">
              {preview ? (
                <div className="flex gap-4 items-center">
                  <img
                    src={preview}
                    alt="doctor"
                    className="w-20 h-20 rounded-full border-4 border-info object-cover"
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
                <span className="label-text font-semibold">Your Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="p-2 rounded-md border border-blue-200 bg-blue-100 dark:bg-base-100 dark:border-blue-200/10 text-info"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Your Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="p-2 rounded-md border border-blue-200 bg-blue-100  dark:bg-base-100 dark:border-blue-200/10 text-info"
                required
                onChange={(e) => setEmailValue(e.target.value)}
                onFocus={() => {
                  if (!isEmailValid) setShowEmailRules(true);
                }}
                onBlur={() => setShowEmailRules(false)}
              />

              {showEmailRules && !isEmailValid && (
                <ul className="mt-2 space-y-1 text-start text-sm">
                  <li
                    className={
                      emailChecks.hasTextBeforeAt
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    ✔ Characters before @
                  </li>
                  <li
                    className={
                      emailChecks.hasAt ? "text-green-500" : "text-red-500"
                    }
                  >
                    ✔ Contains @ symbol
                  </li>
                  <li
                    className={
                      emailChecks.hasDomain ? "text-green-500" : "text-red-500"
                    }
                  >
                    ✔ Valid domain (.com, .net, etc.)
                  </li>
                </ul>
              )}
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative text-info">
                <input
                  name="password"
                  type={passwordShow ? "text" : "password"}
                  placeholder="Password"
                  className="p-2 rounded-md border border-blue-200 bg-blue-100  dark:bg-base-100 dark:border-blue-200/10 w-full dark:text-base-content"
                  required
                  onChange={(e) => setPasswordValue(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={(e) => {
                    if (
                      !e.relatedTarget ||
                      !e.relatedTarget.classList.contains("toggle-password")
                    ) {
                      setShowPasswordRules(false);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPasswordShow(!passwordShow)}
                  className="absolute top-3 right-3 text-lg cursor-pointer toggle-password dark:text-base-content"
                >
                  {passwordShow ? <PiEyeClosedBold /> : <PiEyeBold />}
                </button>
              </div>

              {showPasswordRules && !isPasswordValid && (
                <ul className="mt-2 space-y-1 text-start text-sm">
                  <li
                    className={
                      rules.uppercase ? "text-green-500" : "text-red-500"
                    }
                  >
                    ✔ Uppercase letter
                  </li>
                  <li
                    className={
                      rules.lowercase ? "text-green-500" : "text-red-500"
                    }
                  >
                    ✔ Lowercase letter
                  </li>
                  <li
                    className={rules.number ? "text-green-500" : "text-red-500"}
                  >
                    ✔ Number
                  </li>
                  <li
                    className={
                      rules.special ? "text-green-500" : "text-red-500"
                    }
                  >
                    ✔ Special character
                  </li>
                  <li
                    className={rules.length ? "text-green-500" : "text-red-500"}
                  >
                    ✔ At least 8 characters
                  </li>
                </ul>
              )}
            </div>
            <div className="form-control mt-5">
              <button
                type="submit"
                disabled={!isEmailValid || !isPasswordValid || loading}
                className="p-2 mt-8 rounded-md border-blue-200 font-bold text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg text-lg hover:shadow-accent/40 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="divider mt-8 px-8 font-semibold">
            Sign up with social accounts
          </div>
          <button
            onClick={handleGoogleLogin}
            className="btn-ghost rounded-lg mx-auto"
          >
            <img className="h-8" src={google} alt="google" />
          </button>
          <div className="mx-auto flex items-center">
            <h4 className="font-semibold">Have an account?</h4>
            <Link to="/login">
              <button className="font-bold text-info text-lg ml-2">
                Log in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
