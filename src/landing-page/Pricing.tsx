import { useRef } from "react";
import { useReveal } from "../hooks/useReveal";
import { Link } from "react-router-dom";

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill={color} opacity="0.15" />
    <path d="M7 12.5l3 3 7-7" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Ordered by price so the eye reads cheapest → priciest left to right
const plans = [
  {
    heading: "Professional",
    price: 3000,
    color: "#F2994A",
    badge: null,
    badgeText: "white",
    features: [
      "HD Trailers & Previews",
      "2 User Profiles",
      "Unlimited Movies",
      "Watchlist sync on 2 devices",
      "Email support",
    ],
  },
  {
    heading: "Premium",
    price: 5000,
    color: "#9B51E0",
    badge: "Most Popular",
    badgeText: "white",
    features: [
      "4K + HDR Trailers & Previews",
      "4 User Profiles",
      "Unlimited Movies & Series",
      "Watchlist sync on 4 devices",
      "Priority support",
    ],
  },
  {
    heading: "Organizational",
    price: 10000,
    color: "#2DD4BF",
    badge: "For teams",
    badgeText: "#09090F",
    features: [
      "4K + HDR Trailers & Previews",
      "10 User Profiles",
      "Unlimited Everything",
      "Watchlist sync on 10 devices",
      "Dedicated account manager",
    ],
  },
];

const Pricing = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useReveal({ heading: headingRef, sub: subRef, items: cardsRef, from: { y: 80, opacity: 0, scale: 0.92 } });

  return (
    <section id="pricing" className="pricingSection">
      <h2 className="sectionHeading flex flex-row flex-wrap items-center lg:justify-center gap-2" ref={headingRef}>
        Affordable{" "}
        <span className="text-gradient inline-block">Plans</span>{" "}
        For You
      </h2>
      <p className="sectionSubHeading" ref={subRef}>
        Start free. Upgrade whenever you're ready.
      </p>

      <div className="pricingGrp">
        {plans.map((plan, index) => (
          <div
            className="pricingCard"
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            style={{ borderColor: `${plan.color}30` }}
          >
            {plan.badge ? (
              <div
                className="text-center font-bold text-sm py-2.5 tracking-wide"
                style={{ backgroundColor: plan.color, color: plan.badgeText }}
              >
                {plan.badge}
              </div>
            ) : (
              <div className="py-2.5" />
            )}

            <div className="flex flex-col justify-between gap-4 p-7 flex-1">
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="pricingName" style={{ color: plan.color }}>
                    {plan.heading}
                  </h3>
                  <p className="text-xs text-fg-subtle mt-0.5 uppercase tracking-wider">
                    Billed monthly
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-white text-lg">₦</span>
                  <span className="text-2xl font-bold text-white leading-none">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-fg-subtle text-sm">/month</span>
                </div>

                <Link
                  to={"/RegistrationPage"}
                  className="pricingBtn text-white"
                  style={
                    index === 0
                      ? { border: `1.5px solid ${plan.color}`, color: plan.color, background: "transparent" }
                      : { background: plan.color }
                  }
                >
                  Start free trial
                </Link>

                <div className="h-px bg-line" />

                <div>
                  <p className="text-xs uppercase tracking-widest text-fg-subtle font-semibold mb-3">
                    What's included
                  </p>
                  {plan.features.map((feature, fIdx) => (
                    <div className="checkBoxGrp" key={fIdx}>
                      <CheckIcon color={plan.color} />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
