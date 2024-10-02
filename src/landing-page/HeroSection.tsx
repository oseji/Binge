import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import menu from "../assets/menu.svg";
import closeMenu from "../assets/icons8-close.svg";

import logo from "../assets/Binge.svg";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const headingRef = useRef(null);
  const menuRef = useRef<HTMLImageElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);

  // menu toggle
  useEffect(() => {
    if (menuRef.current) {
      if (menuToggled) {
        menuRef.current.classList.remove("menuHidden");
      }

      if (!menuToggled) {
        menuRef.current.classList.add("menuHidden");
      }
    }
  }, [menuToggled]);

  // hero section text animation
  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: -60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
        }
      );
    }
  }, []);

  return (
    <section className="HeroSection">
      <div
        className=" absolute w-full h-full"
        style={{
          backgroundImage: `url("/heroSection-bg.jpg")`,
          backgroundSize: "100% 100%",
        }}
      >
        {/* header for tablets and desktops */}
        <header className="bigScreenHeader">
          <ul className="headerList">
            <li>Movies</li>
            <li>Series</li>
            <li>Tv Shows</li>
          </ul>

          <img src={logo} alt="Binge Logo" className="headerLogo" />

          <ul className="headerList">
            <li>Choose your language</li>
            <li>Sign up</li>
          </ul>
        </header>

        {/* header for phones */}
        <header className="smallScreenHeader ">
          <div className=" flex flex-row justify-between items-start">
            <img src={logo} alt="Binge Logo" className=" h-8" />

            <img
              src={menuToggled ? closeMenu : menu}
              alt="menu image"
              className=" h-8"
              onClick={() => setMenuToggled((prev) => !prev)}
            />
          </div>

          <div className="menuHidden " ref={menuRef}>
            <ul className="flex flex-col items-start mt-5 gap-5 bg-black">
              <li>Movies</li>
              <li>Series</li>
              <li>Tv Shows</li>
              <li>Choose your language</li>
              <li>Sign up</li>
            </ul>
          </div>
        </header>

        <div className=" text-center min-h-[80dvh] md:min-h-[100dvh] flex flex-col justify-center md:mt-5 pb-20 md:pb-0">
          <h1 className=" text-center text-6xl md:text-5xl font-semibold pb-2">
            Welcome to Bin
            <span className=" text-[#9B51E0] inline-block" ref={headingRef}>
              ge!
            </span>
          </h1>

          <p className="sectionSubHeading w-10/12 md:w-[435px] mx-auto">
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
      </div>
    </section>
  );
};

export default HeroSection;
