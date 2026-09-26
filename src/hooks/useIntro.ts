import { RefObject, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { prefersReducedMotion } from "../lib/history";

const EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Title-card entrance for a page that was navigated *to*. Runs in layout, before
 * first paint, so it plays inside the incoming view-transition snapshot.
 * Back navigation (POP) lands on the page as it was, without replaying.
 */
export function useIntro(ref: RefObject<HTMLElement>, key: string) {
  const history = useHistory();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || history.action === "POP" || prefersReducedMotion()) return;

    const run = (selector: string, keyframes: Keyframe[], duration: number, delay = 0, stagger = 0) =>
      root.querySelectorAll<HTMLElement>(selector).forEach((el, i) =>
        el.animate(keyframes, { duration, delay: delay + i * stagger, easing: EXPO, fill: "backwards" })
      );

    run("[data-intro-line]", [{ transform: "translateY(105%)" }, { transform: "none" }], 1100, 180, 70);
    run("[data-intro-credit]", [{ opacity: 0, letterSpacing: "0.4em" }, { opacity: 1, letterSpacing: "0.08em" }], 1300, 260);
    run("[data-intro]", [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], 900, 420, 70);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
