import { RefObject, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/history";

const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

type Step = {
  selector: string;
  keyframes: Keyframe[];
  duration?: number;
  stagger?: number;
  /** Items beyond this index share the last delay, so long rows don't drag */
  cap?: number;
  delay?: number;
};

/**
 * Entrance for content that arrives from the network: runs once, when `ready` flips
 * true *after* mount and the block is on screen. Content that was already cached at
 * mount (a Back navigation) renders still, so view-transition snapshots are never
 * captured mid-animation. Reduced motion skips it entirely.
 */
export function useDeal(ref: RefObject<HTMLElement>, ready: boolean, steps: Step[], opts: { fresh?: boolean } = {}) {
  // `fresh` marks content that mounts together with just-fetched data (grids swap in for skeletons)
  const readyAtMount = useRef(ready && !opts.fresh);
  const done = useRef(false);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !ready || done.current || readyAtMount.current || prefersReducedMotion()) return;
    done.current = true;

    const play = () => {
      root.removeAttribute("data-pending");
      steps.forEach(({ selector, keyframes, duration = 900, stagger = 0, cap = 9, delay = 0 }) => {
        root.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
          el.animate(keyframes, {
            duration,
            delay: delay + Math.min(i, cap) * stagger,
            easing: EXPO,
            fill: "backwards",
          });
        });
      });
    };

    const r = root.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      play();
      return;
    }

    root.setAttribute("data-pending", "");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      root.removeAttribute("data-pending");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}

export const DEAL_POSTERS: Step = {
  selector: ".poster",
  keyframes: [
    { opacity: 0, transform: "translateX(64px) rotate(1.5deg)" },
    { opacity: 1, transform: "none" },
  ],
  duration: 1000,
  stagger: 55,
};

export const WIPE_TITLE: Step = {
  selector: "[data-wipe]",
  keyframes: [
    { clipPath: "inset(-10% 100% -10% 0)", transform: "translateX(-0.25em)" },
    { clipPath: "inset(-10% 0% -10% 0)", transform: "none" },
  ],
  duration: 900,
};

export const DRAW_RULE: Step = {
  selector: "[data-rule]",
  keyframes: [
    { transform: "scaleX(0)", transformOrigin: "left" },
    { transform: "scaleX(1)", transformOrigin: "left" },
  ],
  duration: 1100,
};
