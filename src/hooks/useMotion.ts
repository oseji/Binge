import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Binge` : "Binge · Find something to watch tonight";
  }, [title]);
}
