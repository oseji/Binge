import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { DEAL_POSTERS, DRAW_RULE, WIPE_TITLE, useDeal } from "../hooks/useDeal";
import { prefersReducedMotion } from "../lib/history";
import { MediaItem, MediaType, typeOf } from "../lib/tmdb";
import Icon from "./Icon";
import PosterCard from "./PosterCard";

type Props = {
  id?: string;
  title: string;
  /** Short line under the title: what this strand is and why it's here */
  blurb?: ReactNode;
  seeAll?: string;
  items?: MediaItem[];
  type: MediaType | "person";
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  /** Namespaces the view-transition slot of each card */
  slot: string;
  note?: (item: MediaItem) => string | undefined;
  emptyText?: string;
};

export default function Strand({ id, title, blurb, seeAll, items, type, loading, error, onRetry, slot, note, emptyText }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const headingId = `${slot}-heading`;
  const hasItems = !!items?.length;

  useDeal(rootRef, hasItems, [DRAW_RULE, { ...WIPE_TITLE, delay: 80 }, { ...DEAL_POSTERS, delay: 180 }]);

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items]);

  const page = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section ref={rootRef} id={id} aria-labelledby={headingId} className="scroll-mt-24">
      <div className="wrap">
        <div data-rule className="strand-rule" />
        <div className="flex items-end justify-between gap-6 pt-4">
          <div className="min-w-0">
            <h2 id={headingId} data-wipe className="t-strand">
              {title}
            </h2>
            {blurb && <p className="text-sm text-paper-muted mt-2 max-w-[60ch]">{blurb}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {seeAll && (
              <Link to={seeAll} className="link-arrow t-credit mr-2 py-3">
                See all <Icon name="arrowRight" size={16} />
              </Link>
            )}
            {hasItems && (
              <div className="hidden md:flex gap-2">
                <button type="button" className="strand-arrow" aria-label={`Scroll ${title} back`} disabled={edges.start} onClick={() => page(-1)}>
                  <Icon name="chevronLeft" />
                </button>
                <button type="button" className="strand-arrow" aria-label={`Scroll ${title} forward`} disabled={edges.end} onClick={() => page(1)}>
                  <Icon name="chevronRight" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="wrap py-10 flex items-center gap-4 text-paper-muted">
          <p>Couldn't load {title.toLowerCase()}.</p>
          {onRetry && (
            <button type="button" className="btn btn-ghost min-h-[2.5rem]" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      ) : loading || !items ? (
        <div className="strand-track" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[8.75rem] sm:w-[10rem] lg:w-[11.25rem]">
              <div className="skeleton aspect-[2/3]" />
              <div className="skeleton h-3 mt-3 w-3/4" />
              <div className="skeleton h-2.5 mt-2 w-1/3" />
            </div>
          ))}
        </div>
      ) : hasItems ? (
        <div ref={trackRef} className="strand-track dim-siblings" onScroll={measure}>
          {items.map((item) => {
            const t = type === "person" ? "person" : typeOf(item, type);
            return <PosterCard key={`${t}-${item.id}`} item={item} type={t} slot={`${slot}-${t}-${item.id}`} note={note?.(item)} />;
          })}
        </div>
      ) : (
        <p className="wrap py-8 text-paper-muted">{emptyText ?? "Nothing here yet."}</p>
      )}
    </section>
  );
}
