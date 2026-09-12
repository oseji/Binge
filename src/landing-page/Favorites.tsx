import { useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";

// Rows that actually exist on the Movies and Series pages
const favMedia = [
  { heading: "Now Playing", subHeading: "Movies", to: "/Movies", cta: "Browse movies", img: "/film1.png" },
  { heading: "Top Rated", subHeading: "Series", to: "/Series", cta: "Browse series", img: "/film2.png" },
  { heading: "Upcoming", subHeading: "Movies", to: "/Movies", cta: "Browse movies", img: "/film3.png" },
];

const Favorites = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useReveal({ heading: headingRef, sub: subRef, items: cardsRef, from: { x: 60, opacity: 0 } });

  return (
    <section className="favoritesSection">
      <h2 className="sectionHeading" ref={headingRef}>
        Find your next{" "}
        <span className="text-gradient inline-block">favourite</span>
      </h2>
      <p className="sectionSubHeading" ref={subRef}>
        Now playing, top rated, upcoming and more, across movies and series.
      </p>

      <div className="favoritesGrp">
        {favMedia.map((item, index) => (
          <Link
            to={item.to}
            className="favoritesBox"
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            style={{
              backgroundImage: `url("${item.img}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10 mb-3">
                {item.subHeading}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">{item.heading}</h3>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-6 h-0.5 bg-accent rounded-full" />
                <span className="text-xs text-fg-muted">{item.cta}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
