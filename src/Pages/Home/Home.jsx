import React from "react";
import useTitle from "../../hooks/useTitle";
import Appointment from "./Appointment";
import Contact from "./Contact";
import Header from "./Header";
import Services from "./Services";
import Doctors from "./Doctors";

const Home = () => {
  useTitle("Home");
  return (
    <div className="px-3">
      <Header />
      <Services />
      <Doctors />
      <Appointment></Appointment>
      <Contact />
    </div>
  );
};

export default Home;
