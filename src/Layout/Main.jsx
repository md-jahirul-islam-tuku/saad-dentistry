import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Pages/Shared/Footer";
import Navbar from "../Pages/Shared/Navbar";
import ScrollTo from "../utils/ScrollTo";

const Main = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollTo />
      <Navbar />

      <div className="flex-1 max-w-[1120px] mx-auto w-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Main;
