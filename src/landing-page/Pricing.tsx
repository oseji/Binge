import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import proCheckbox from "../assets/pro-checkbox.png";
import premiumCheckbox from "../assets/premium-checkbox.png";
import orgCheckbox from "../assets/org-checkbox.png";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    heading: "Professional",
    price: 3000,
    color: "#F2994A",
    checkboxImg: proCheckbox,
    badge: null,
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
    price: 10000,
    color: "#9B51E0",
    checkboxImg: premiumCheckbox,
    badge: "Most Popular",
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
    price: 5000,
    color: "#B42318",
    checkboxImg: orgCheckbox,
    badge: "Best Value",
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

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
    });

    tl.fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.5")
      .fromTo(
        cardsRef.current,
        { y: 80, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.16, ease: "power3.out" },
        "-=0.3"
      );
  }, []);

  return (
    <section className="pricingSection">
      <h1 className="sectionHeading flex flex-row flex-wrap items-center lg:justify-center gap-2" ref={headingRef}>
        Affordable{" "}
        <span className="text-gradient inline-block">Plans</span>{" "}
        For You
      </h1>
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
                style={{ backgroundColor: plan.color, color: "white" }}
              >
                {plan.badge}
              </div>
            ) : (
              <div className="py-2.5" />
            )}

            <div className="flex flex-col justify-between gap-4 p-7 flex-1">
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="pricingName" style={{ color: plan.color }}>
                    {plan.heading}
                  </h2>
                  <p className="text-xs text-[#606070] mt-0.5 uppercase tracking-wider">
                    Billed monthly
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-white text-lg">₦</span>
                  <span className="text-4xl font-bold text-white leading-none">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-[#606070] text-sm">/month</span>
                </div>

                <Link to={"/PaymentOption"} className="block">
                  <button
                    className="pricingBtn text-white"
                    style={
                      index === 0
                        ? { border: `1.5px solid ${plan.color}`, color: plan.color, background: "transparent" }
                        : { background: plan.color }
                    }
                  >
                    Start free trial
                  </button>
                </Link>

                <div className="h-px bg-white/5" />

                <div>
                  <p className="text-xs uppercase tracking-widest text-[#606070] font-semibold mb-3">
                    What's included
                  </p>
                  {plan.features.map((feature, fIdx) => (
                    <div className="checkBoxGrp" key={fIdx}>
                      <img src={plan.checkboxImg} alt="check" />
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
