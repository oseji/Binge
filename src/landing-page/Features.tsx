import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import feature1 from "../assets/feature1.png";
import feature2 from "../assets/feature2.png";
import feature3 from "../assets/feature3.png";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    img: feature1,
    heading: "Unlimited Movies",
    body: "Browse thousands of movies across every genre. New titles added weekly — from blockbusters to indie gems.",
    badge: "Movies",
  },
  {
    img: feature2,
    heading: "Watch Party",
    body: "Invite friends and watch together in real time, no matter where they are. React, chat, and share the experience.",
    badge: "Social",
  },
  {
    img: feature3,
    heading: "Flexible Plans",
    body: "Pick a plan that fits your life. Switch, pause, or cancel at any time — no hidden fees, no long contracts.",
    badge: "Pricing",
  },
];

const Features = () => {
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
    <section className="featuresSection">
      <h1 className="sectionHeading" ref={headingRef}>
        Our Prominent{" "}
        <span className="text-gradient inline-block">Features</span>
      </h1>
      <p className="sectionSubHeading" ref={subRef}>
        Everything you need to discover your next watch.
      </p>

      <div className="featuresGrp">
        {features.map((f, i) => (
          <div className="featuresBox" key={i} ref={(el) => (cardsRef.current[i] = el)}>
            <div className="relative">
              <img src={f.img} alt={f.heading} className="featureImg" />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#9B51E0]/80 text-white backdrop-blur-sm">
                {f.badge}
              </span>
            </div>
            <h2 className="featureHeading">{f.heading}</h2>
            <p className="text-sm text-[#909098] leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
