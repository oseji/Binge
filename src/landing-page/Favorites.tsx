import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import film1 from "../assets/film1.png";
import film2 from "../assets/film2.png";
import film3 from "../assets/film3.png";

gsap.registerPlugin(ScrollTrigger);

type favMediaType = {
  heading: string;
  subHeading: string;
  image: string;
}[];

const Favorites = () => {
  const favMedia: favMediaType = [
    {
      heading: "New & Classics",
      subHeading: "Series",
      image: film1,
    },
    {
      heading: "Popular",
      subHeading: "Movie",
      image: film2,
    },
    {
      heading: "New & Classics",
      subHeading: "Series",
      image: film3,
    },
  ];

  const headingRef = useRef(null);

  useEffect(() => {
    // gsap.set(headingRef.current, { x: 60 });

    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,

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
    <section className="favoritesSection">
      <h1 className="sectionHeading">
        Watch your{" "}
        <span className=" text-[#9B51E0] inline-block" ref={headingRef}>
          Favourites
        </span>
      </h1>

      <p className="sectionSubHeading">
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="favoritesGrp">
        {favMedia.map((element, index) => (
          <div
            className="favoritesBox"
            key={index}
            style={{
              backgroundImage: `url("src/assets/film${index + 1}.png")`,
            }}
          >
            <div className=" absolute w-full h-full top-0 left-0 bg-black bg-opacity-45"></div>

            <div className=" absolute">
              <h2 className=" font-semibold">{element.heading}</h2>
              <p>{element.subHeading}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
