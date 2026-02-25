import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer";
import Navbar from "../Pages/Shared/Navbar";

const Main = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      // style={{ backgroundImage: "url('/images/bg_main.jpg')" }}
    >
      <Navbar />

      <div className="flex-1 max-w-[1120px] mx-auto w-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Main;
