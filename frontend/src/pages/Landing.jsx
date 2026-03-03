import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/landing/Hero";
import Team from "../components/landing/Team";
import Features from "../components/landing/Features";
import Stats from "../components/landing/Stats";
import HowItWorks from "../components/landing/HowItWorks";
import CTA from "../components/landing/CTA";
import Footer from "../components/Footer";
import "../styles/landing.css";

const Landing = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Team />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
};

export default Landing;