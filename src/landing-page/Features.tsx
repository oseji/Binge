import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";

import feature1 from "../assets/feature1.png";
import feature2 from "../assets/feature2.png";
import feature3 from "../assets/feature3.png";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      const text = new SplitType(headingRef.current, { types: "chars,words" });

      const tl = gsap.timeline();

      tl.fromTo(
        text.chars,
        { scale: 0.2, opacity: 0, y: -20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 1,
          duration: 1,

          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 2,
          },
        }
      );
    }
  }, []);

  return (
    <section className="featuresSection">
      <h1 className="sectionHeading">
        Our Prominent{" "}
        <span className=" text-[#9B51E0] inline-block" ref={headingRef}>
          Features
        </span>
      </h1>

      <p className="sectionSubHeading">
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="featuresGrp">
        <div className="featuresBox">
          <img src={feature1} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Access your Favourites Movies</h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>

        <div className="featuresBox">
          <img src={feature2} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Explore Watch Party </h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>

        <div className="featuresBox">
          <img src={feature3} alt="Feature" className="featureImg" />

          <h2 className="featureHeading">Convenient Payment Options</h2>

          <p className="featureText">
            Lorem ipsum dolor sit amet consectetur. Aenean augue eu bibendum
            morbi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
