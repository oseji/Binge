import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import logo from "../assets/Binge.svg";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const animateRef = useRef(null);

  useEffect(() => {
    console.log(animateRef.current);

    if (animateRef.current) {
      gsap.fromTo(
        animateRef.current,
        { y: -60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
        }
      );
    }
  }, []);

  return (
    <section className="HeroSection">
      <header>
        <ul className="headerList">
          <li>Movies</li>
          <li>Series</li>
          <li>Tv Shows</li>
        </ul>

        <img src={logo} alt="Binge Logo" />

        <ul className="headerList">
          <li>Choose your language</li>
          <li>Sign up</li>
        </ul>
      </header>

      <div className=" text-center min-h-[80dvh] flex flex-col justify-center">
        <h1 className=" text-center text-5xl font-semibold pb-2">
          Welcome to Bin
          <span className=" text-[#9B51E0] inline-block" ref={animateRef}>
            ge!
          </span>
        </h1>

        <p className="sectionSubHeading w-[435px] mx-auto">
          Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum
          morbi.
        </p>

        <div className=" flex flex-col items-center gap-3 mt-5">
          <button className="heroSectionBtns bg-[#9B51E0] rounded-md">
            Wanna Join Binge? Sign Up
          </button>

          <button className="heroSectionBtns bg-transparent text-[#9B51E0] outline-[#9B51E0] outline ">
            Start 7-day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
