import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const favMedia = [
  { heading: "New & Classics", subHeading: "Series", img: "/film1.png" },
  { heading: "Popular Now", subHeading: "Movie", img: "/film2.png" },
  { heading: "Critic's Choice", subHeading: "Series", img: "/film3.png" },
];

const Favorites = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
    });

    tl.fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5")
      .fromTo(
        cardsRef.current,
        { y: 70, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.14, ease: "power3.out" },
        "-=0.3"
      );
  }, []);

  return (
    <section className="favoritesSection">
      <h1 className="sectionHeading" ref={headingRef}>
        Watch your{" "}
        <span className="text-gradient inline-block">Favourites</span>
      </h1>
      <p className="sectionSubHeading" ref={subRef}>
        Handpicked categories to match every mood.
      </p>

      <div className="favoritesGrp">
        {favMedia.map((item, index) => (
          <div
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
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10 mb-3">
                {item.subHeading}
              </span>
              <h2 className="text-2xl font-bold text-white leading-tight">{item.heading}</h2>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-6 h-0.5 bg-[#9B51E0] rounded-full" />
                <span className="text-xs text-white/50">Browse collection</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
