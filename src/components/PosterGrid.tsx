import { useRef } from "react";
import { DEAL_POSTERS, useDeal } from "../hooks/useDeal";
import { MediaItem, MediaType, typeOf } from "../lib/tmdb";
import PosterCard from "./PosterCard";

type Props = {
  items: MediaItem[];
  type: MediaType | "person";
  slot: string;
  note?: (item: MediaItem) => string | undefined;
  /** Items just arrived from the network (not restored from cache) */
  fresh?: boolean;
  /** Search results refresh as you type, so they get a quieter entrance */
  quiet?: boolean;
};

export const GRID = "grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-4 gap-y-8";

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className={GRID} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[2/3]" />
          <div className="skeleton h-3 mt-3 w-3/4" />
          <div className="skeleton h-2.5 mt-2 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function PosterGrid({ items, type, slot, note, fresh, quiet }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDeal(
    ref,
    items.length > 0,
    [
      quiet
        ? { ...DEAL_POSTERS, keyframes: [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], duration: 450, stagger: 18, cap: 12 }
        : { ...DEAL_POSTERS, keyframes: [{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], stagger: 30, cap: 14 },
    ],
    { fresh }
  );

  return (
    <div ref={ref} className={`${GRID} dim-siblings`}>
      {items.map((item) => {
        const t = type === "person" ? "person" : typeOf(item, type);
        return (
          <PosterCard
            key={`${t}-${item.id}`}
            item={item}
            type={t}
            slot={`${slot}-${t}-${item.id}`}
            width="w-full"
            sizes="(min-width: 1560px) 13vw, (min-width: 1200px) 15vw, (min-width: 768px) 22vw, (min-width: 480px) 30vw, 45vw"
            note={note?.(item)}
          />
        );
      })}
    </div>
  );
}
