import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import { prefersReducedMotion } from "../lib/history";

// A design exploration: these passes are not, and will not be, on sale
const passes = [
  { name: "Day Pass", price: 3000, perks: "HD trailers, two profiles, your list on two devices." },
  { name: "Festival Pass", price: 5000, perks: "4K HDR trailers, four profiles, your list on four devices." },
  { name: "Patron", price: 10000, perks: "Ten profiles, ten devices, and an account manager who does not exist." },
];

export default function Pricing() {
  const stampRef = useRef<HTMLDivElement>(null);

  // The stamp lands once, when the sheet is properly in view
  useEffect(() => {
    const stamp = stampRef.current;
    if (!stamp || prefersReducedMotion()) return;
    stamp.style.visibility = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        stamp.style.visibility = "";
        stamp.animate(
          [
            { opacity: 0, transform: "rotate(-22deg) scale(1.9)" },
            { opacity: 1, transform: "rotate(-5deg) scale(0.96)", offset: 0.7 },
            { opacity: 1, transform: "rotate(-7deg) scale(1)" },
          ],
          { duration: 520, easing: "cubic-bezier(0.55, 0, 0.1, 1)", delay: 250, fill: "backwards" }
        );
      },
      { threshold: 0.6 }
    );
    io.observe(stamp);
    return () => {
      io.disconnect();
      stamp.style.visibility = "";
    };
  }, []);

  return (
    <section id="passes" aria-labelledby="passes-heading" className="passes mt-[var(--section-y)] scroll-mt-16">
      <div className="wrap py-[var(--section-y)] grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 flex flex-col">
          <h2 id="passes-heading" className="t-display">
            Pricing, as a concept
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-signal-ink max-w-[38ch]">
            A design exploration, not a live product. Everything on Binge is free, so these passes will never go on sale. They're here to show how the page would look if they did.
          </p>
          <Link to="/RegistrationPage" className="btn self-start mt-8 bg-ink-0 text-paper hover:bg-ink-2">
            Create a free account <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <div className="lg:col-span-7 relative pt-24 lg:pt-0">
          <ul>
            {passes.map((p) => (
              <li key={p.name} className="pass grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-6">
                <h3 className="t-strand">{p.name}</h3>
                <p className="text-right self-baseline">
                  <span className="font-[800] text-[clamp(1.5rem,3vw,2.25rem)] leading-none tnum" style={{ fontStretch: "76%" }}>
                    ₦{p.price.toLocaleString("en")}
                  </span>
                  <span className="t-micro text-signal-ink ml-1.5">/ month</span>
                </p>
                <p className="col-span-2 text-signal-ink max-w-[46ch]">{p.perks}</p>
              </li>
            ))}
          </ul>
          <div className="border-t-[3px] border-ink-0" />

          <div ref={stampRef} className="stamp absolute right-1 top-2 lg:right-0 lg:-top-16 xl:right-10 pointer-events-none">
            <span className="t-micro">Concept</span>
            <span className="font-[900] uppercase text-2xl leading-none" style={{ fontStretch: "66%" }}>
              Not on sale
            </span>
            <span className="t-micro">Binge is free</span>
          </div>
        </div>
      </div>
    </section>
  );
}
