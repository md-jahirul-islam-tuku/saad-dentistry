import React, { useEffect } from "react";
import useTitle from "../../hooks/useTitle";
import ScrollToTop from "react-scroll-to-top";
import Appointment from "./Appointment";
import Contact from "./Contact";
import Header from "./Header";
import Services from "./Services";
import { Element, scroller } from "react-scroll";
import Doctors from "../Doctor/Doctors";
import { useLocation } from "react-router-dom";

const Home = () => {
  useTitle("Home");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToAppointment) {
      // DOM render হওয়ার পরে scroll কর
      setTimeout(() => {
        scroller.scrollTo("appointment", {
          smooth: true,
          duration: 2000,
          offset: -80,
        });
      }, 500); // delay দিতে হবে
    }
  }, [location.state]);
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
