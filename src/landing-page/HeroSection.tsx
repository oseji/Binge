import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const headingRef = useRef(null);

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
            <Link to={"/RegistrationPage"} className=" w-full">
              <button className="heroSectionBtns bg-[#9B51E0] rounded-md">
                Wanna Join Binge? Sign Up
              </button>
            </Link>

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
