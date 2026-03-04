import React from "react";
import useTitle from "../../hooks/useTitle";
import ScrollToTop from "react-scroll-to-top";
import Appointment from "./Appointment";
import Contact from "./Contact";
import Header from "./Header";
import Services from "./Services";
import { Element } from "react-scroll";
import Doctors from "../Doctor/Doctors";

const Home = () => {
  useTitle("Home");
  return (
    <div className="px-3">
      <ScrollToTop
        color="white"
        smooth={true}
        viewBox="0 0 150 280"
        style={{
          background: "linear-gradient(135deg, #e42daa, #6a11cb)",
          borderRadius: "50%",
        }}
      />
      <Header />
      <Services />
      <Doctors />
      <Element name="appointment">
        <Appointment />
      </Element>
      <Contact />
    </div>
  );
};

export default Home;
