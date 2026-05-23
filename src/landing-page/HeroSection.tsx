import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const HeroSection = () => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(badgeRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
      .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
      .fromTo(btnsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
  }, []);

  return (
    <section className="HeroSection">
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("/heroSection-bg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Layered overlays for cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#09090F]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-5 md:px-10 pb-16 pt-24 md:pt-0">

        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9B51E0] animate-pulse" />
          <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase">
            Discover your next obsession
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="font-bold leading-none tracking-tight mb-6"
          style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)", textShadow: "0 2px 40px rgba(0,0,0,0.95)" }}
        >
          <span className="block" style={{ color: "#F0E6FF" }}>Welcome to</span>
          <span className="block text-gradient">Binge</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className="text-white/60 max-w-md mx-auto text-lg leading-relaxed mb-10"
        >
          Discover thousands of movies and series. Find what to watch next, explore trailers, and never run out of ideas.
        </p>

        {/* CTAs */}
        <div ref={btnsRef} className="flex flex-col items-center gap-3 w-full">
          <Link to={"/RegistrationPage"} className="w-full flex justify-center">
            <button
              className="heroSectionBtns text-white"
              style={{
                background: "linear-gradient(135deg, #9B51E0 0%, #7B3FC0 100%)",
              }}
            >
              Get started — it's free
            </button>
          </Link>
          <Link to={"/Plans"} className="w-full flex justify-center">
            <button className="heroSectionBtns border border-white/20 text-white/80 hover:text-white hover:border-white/40 bg-white/5 backdrop-blur-sm">
              Start 7-day free trial
            </button>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex items-center gap-6 mt-12 text-white/30 text-xs font-medium uppercase tracking-wider">
          <span>Free to use</span>
          <span className="w-px h-3 bg-white/20" />
          <span>1M+ titles</span>
          <span className="w-px h-3 bg-white/20" />
          <span>Trailers & ratings</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
