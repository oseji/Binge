import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

type favMediaType = {
  heading: string;
  subHeading: string;
}[];

const Favorites = () => {
  const favMedia: favMediaType = [
    {
      heading: "New & Classics",
      subHeading: "Series",
    },
    {
      heading: "Popular",
      subHeading: "Movie",
    },
    {
      heading: "New & Classics",
      subHeading: "Series",
    },
  ];

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
              backgroundImage: `url("/film${index + 1}.png")`,
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
