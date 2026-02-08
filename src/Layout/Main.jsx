import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer";
import Navbar from "../Pages/Shared/Navbar";

const Main = () => {
  return (
    <div className="" style={{ backgroundImage: "url('/images/bg_main.jpg')" }}>
      <Navbar />
      <div className="max-w-[1120px] mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
