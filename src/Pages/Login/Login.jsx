import React, { useContext, useState } from "react";
import bgImg from "../../Assets/img/bg-appointment.png";
import google from "../../Assets/Icons/google.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import useTitle from "../../hooks/useTitle";
import Swal from "sweetalert2";
import Loader from "../../Loader/Loader";

const Login = () => {
  const { userLogin, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  useTitle("Login");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // ✅ Empty validation
    if (!email || !password) {
      return Swal.fire("Error", "Email & Password required", "error");
    }

    try {
      const result = await userLogin(email, password);
      const user = result.user;

      // Save user to DB (if not exists)
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      // ✅ Save JWT
      const res = await fetch("http://localhost:5000/jwt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      localStorage.setItem("saad-token", data.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      if (err.message.includes("wrong-password")) {
        Swal.fire("Error", "Wrong Password 😠", "error");
      } else if (err.message.includes("user-not-found")) {
        Swal.fire("Error", "User Not Found. Please Sign Up 🙄", "error");
      } else {
        Swal.fire("Error", err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      const user = result.user;

      // Save user to DB (if not exists)
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      });

      // JWT
      const res = await fetch("http://localhost:5000/jwt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      localStorage.setItem("saad-token", data.token);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful 🚀",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire("Error", "Google Login Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 bg-info/5 lg:pt-0">
      <div
        className="hero min-h-screen flex"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="card lg:w-1/3 w-[90%] mx-auto lg:mx-0 lg:left-20">
          <form onSubmit={handleLogin} className="card-body">
            <h1 className="text-4xl font-bold text-info">Please Login</h1>
            <div className="divider"></div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Your Email
                </span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Your email"
                className="input input-bordered bg-blue-100 dark:bg-base-100"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-semibold">
                  Password
                </span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input input-bordered bg-blue-100 dark:bg-base-100"
              />
            </div>
            <div className="my-2 flex items-center">
              <h4 className="font-semibold">Forget password?</h4>
              <button className="font-bold text-info text-lg ml-2">
                Reset
              </button>
            </div>
            <div className="form-control">
              <button
                type="submit"
                className="btn font-bold text-white bg-gradient-to-r from-info to-accent border-0 hover:shadow-lg hover:shadow-accent/40 hover:scale-[1.02] text-lg"
              >
                {loading ? <Loader /> : "Log in"}
              </button>
            </div>
          </form>
          <div className="divider px-8">Login with social accounts</div>
          <button
            onClick={handleGoogleLogin}
            className="btn-ghost px-3 py-2 rounded-lg mx-auto"
          >
            <img className="h-8" src={google} alt="google" />
          </button>
          <div className="mx-auto flex items-center mt-3">
            <h4 className="font-semibold">Don't have an account?</h4>
            <Link to="/signup">
              <button className="font-bold text-info text-lg ml-2">
                Sign up
              </button>
            </Link>
          </div>
        </div>
        <div className="w-1/2 hidden lg:block"></div>
      </div>
    </div>
  );
};

export default Login;
