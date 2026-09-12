import { useRef } from "react";
import { useReveal } from "../hooks/useReveal";

import feature1 from "../assets/feature1.png";
import feature2 from "../assets/feature2.png";
import feature3 from "../assets/feature3.png";

const features = [
  {
    img: feature1,
    heading: "Unlimited Movies",
    body: "Browse thousands of movies across every genre. New titles added weekly, from blockbusters to indie gems.",
    badge: "Movies",
  },
  {
    img: feature2,
    heading: "Save It for Later",
    body: "Tap the heart on any title and it's in your list, synced to your account, so it's there on every device.",
    badge: "Watchlist",
  },
  {
    img: feature3,
    heading: "Trailers Included",
    body: "Every title page has the official trailer, synopsis, genres and runtime, so you can decide before you commit an evening.",
    badge: "Details",
  },
];

const Features = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useReveal({ heading: headingRef, sub: subRef, items: cardsRef, from: { y: 70, opacity: 0, scale: 0.93 } });

  return (
    <section id="features" className="featuresSection">
      <h2 className="sectionHeading" ref={headingRef}>
        Our Prominent{" "}
        <span className="text-gradient inline-block">Features</span>
      </h2>
      <p className="sectionSubHeading" ref={subRef}>
        Everything you need to discover your next watch.
      </p>

      <div className="featuresGrp">
        {features.map((f, i) => (
          <div className="featuresBox" key={i} ref={(el) => (cardsRef.current[i] = el)}>
            <div className="relative">
              <img src={f.img} alt={f.heading} className="featureImg" />
              <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent/80 text-white backdrop-blur-sm">
                {f.badge}
              </span>
            </div>
            <h3 className="featureHeading">{f.heading}</h3>
            <p className="text-sm text-fg-muted leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
