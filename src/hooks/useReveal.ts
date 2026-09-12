import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  heading: RefObject<HTMLElement>;
  sub?: RefObject<HTMLElement>;
  items: RefObject<(HTMLElement | null)[]>;
  /** Starting state for the staggered items — lets each section enter differently */
  from?: gsap.TweenVars;
  stagger?: number;
  duration?: number;
};

/**
 * Scroll-triggered reveal for a section heading, subheading and a list of items.
 * Only runs when the user hasn't asked for reduced motion; otherwise content
 * renders in its natural state and is never hidden behind an animation.
 */
export function useReveal({
  heading,
  sub,
  items,
  from = { y: 70, opacity: 0, scale: 0.93 },
  stagger = 0.14,
  duration = 0.75,
}: RevealOptions) {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: heading.current, start: "top 88%" },
      });

      tl.fromTo(
        heading.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      if (sub?.current) {
        tl.fromTo(
          sub.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.5"
        );
      }

      const targets = (items.current ?? []).filter(Boolean);
      if (targets.length) {
        tl.fromTo(
          targets,
          from,
          { x: 0, y: 0, opacity: 1, scale: 1, duration, stagger, ease: "power3.out" },
          "-=0.3"
        );
      }
    });

    return () => mm.revert();
  }, []);
}
