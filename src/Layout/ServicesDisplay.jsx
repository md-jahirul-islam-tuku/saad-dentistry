import React from "react";
import { Outlet } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import ServicesTable from "../Pages/ServicesAll/ServicesTable";
import ScrollTo from "../utils/ScrollTo";

const ServicesDisplay = () => {
  useTitle("All services");
  return (
    <div className="md:grid grid-cols-4 px-3 lg:px-20 pt-32">
      <ScrollTo />
      <ServicesTable />
      <Outlet />
    </div>
  );
};

export default ServicesDisplay;
