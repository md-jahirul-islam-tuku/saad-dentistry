import React from "react";
import ServiceCard from "../Home/ServiceCard";
import ScrollToTop from "react-scroll-to-top";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../Loader/PageLoader";

const ServicesAll = () => {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/services`);
      return res.json();
    },
  });
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div className="col-span-3 md:grid grid-cols-2 gap-2 md:gap-5 mb-20">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />
      {services.map((service) => (
        <ServiceCard key={service._id} info={service}></ServiceCard>
      ))}
    </div>
  );
};

export default ServicesAll;
