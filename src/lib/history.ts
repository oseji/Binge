import { createBrowserHistory, Location, LocationListener, Action } from "history";
import { flushSync } from "react-dom";

/**
 * Browser history for React Router, with two jobs added:
 * 1. Every route change runs inside a View Transition, so the poster a visitor
 *    clicked can travel into the title page and back (see `.vt-poster`, `.vt-still`).
 * 2. Scroll restoration: new pages start at the top, Back returns to where you were.
 */
const raw = createBrowserHistory();
const subscribers = new Set<LocationListener>();
const positions = new Map<string, number>();
let current: Location = raw.location;
let activeSlot: string | null = null;
// Which card was opened from each history entry, so Back morphs into the right poster
const slotByEntry = new Map<string, string>();
let depth = 0;

if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

const keyOf = (l: Location) => l.key ?? `${l.pathname}${l.search}`;

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function restoreScroll(location: Location, action: Action) {
  if (action === "POP") {
    window.scrollTo(0, positions.get(keyOf(location)) ?? 0);
    return;
  }
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);
}

function intersectsViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

/** Offscreen shared elements would fly in from outside the viewport; drop their names */
function pruneOffscreen() {
  document.querySelectorAll(".vt-poster, .vt-still").forEach((el) => {
    if (!intersectsViewport(el)) el.classList.remove("vt-poster", "vt-still");
  });
}

raw.listen((location, action) => {
  const previous = current;
  positions.set(keyOf(previous), window.scrollY);
  current = location;

  if (action === "PUSH") depth++;
  else if (action === "POP") depth = Math.max(0, depth - 1);

  const samePage = previous.pathname === location.pathname;
  if (action === "POP") activeSlot = slotByEntry.get(keyOf(location)) ?? null;
  else if (!location.pathname.startsWith("/Details")) activeSlot = null;

  const commit = () => {
    subscribers.forEach((listener) => listener(location, action));
    if (!samePage || location.hash) restoreScroll(location, action);
  };

  // Query-string updates (search as you type, filters) stay instant and keep scroll
  if (samePage || prefersReducedMotion() || !document.startViewTransition) {
    commit();
    return;
  }

  pruneOffscreen();
  document.startViewTransition(() => {
    flushSync(commit);
    pruneOffscreen();
  });
});

export const history = {
  ...raw,
  get length() {
    return raw.length;
  },
  get action() {
    return raw.action;
  },
  get location() {
    return raw.location;
  },
  listen(listener: LocationListener) {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  },
};

/** Called when a poster card is activated: it becomes the element that morphs */
export function markPoster(slot: string, img: Element | null) {
  activeSlot = slot;
  slotByEntry.set(keyOf(current), slot);
  document.querySelectorAll(".vt-poster").forEach((el) => el.classList.remove("vt-poster"));
  img?.classList.add("vt-poster");
}

export const isActiveSlot = (slot: string) => activeSlot === slot;

/** True when there is an in-app page to go back to (not the site that linked here) */
export const canGoBack = () => depth > 0;
