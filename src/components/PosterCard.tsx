import { PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { isActiveSlot, markPoster, prefersReducedMotion } from "../lib/history";
import { MediaItem, MediaType, poster, posterSrcSet, prefetchDetails, profile, titleOf, yearOf } from "../lib/tmdb";
import { genreName } from "../lib/genres";
import { score } from "../lib/format";
import Img from "./Img";

type Props = {
  item: MediaItem;
  type: MediaType | "person";
  /** Unique within the page; identifies the card the title page morphs back into */
  slot: string;
  /** Width class for rows; grids pass "w-full" */
  width?: string;
  sizes?: string;
  eager?: boolean;
  /** Replaces the default "year · type" caption line */
  note?: string;
};

const TYPE_LABEL = { movie: "Film", tv: "Series", person: "Person" } as const;

export default function PosterCard({ item, type, slot, width = "w-[8.75rem] sm:w-[10rem] lg:w-[11.25rem]", sizes = "180px", eager, note }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const intent = useRef<number>();
  const [active] = useState(() => isActiveSlot(slot));

  const title = titleOf(item);
  const year = yearOf(item);
  const isPerson = type === "person";
  const src = isPerson ? profile(item.profile_path, "h632") : poster(item.poster_path, "w342");
  const srcSet = isPerson ? undefined : posterSrcSet(item.poster_path);
  const rating = score(item.vote_average);
  const genre = item.genre_ids?.map(genreName).find(Boolean);
  const meta = note ?? (isPerson ? item.known_for_department : [year, TYPE_LABEL[type]].filter(Boolean).join(" · "));

  const warm = () => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => prefetchDetails(type, item.id), 120);
  };
  const cool = () => window.clearTimeout(intent.current);

  // Tilt toward the pointer, like lifting a printed card off the table
  const tilt = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = cardRef.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
  };
  const untilt = () => {
    cool();
    cardRef.current?.style.setProperty("--rx", "0deg");
    cardRef.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={cardRef}
      to={{
        pathname: `/Details/${type}/${item.id}`,
        // Lets the title page paint its poster and still before the full record arrives
        state: { preview: { title, poster_path: item.poster_path, profile_path: item.profile_path, backdrop_path: item.backdrop_path } },
      }}
      className={`poster group ${width}`}
      onPointerEnter={warm}
      onPointerMove={tilt}
      onPointerLeave={untilt}
      onFocus={warm}
      onBlur={cool}
      onClick={() => markPoster(slot, imgRef.current)}
    >
      <div className="poster-frame">
        {src ? (
          <Img
            ref={imgRef}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt=""
            eager={eager}
            className={active ? "vt-poster" : undefined}
          />
        ) : (
          <div ref={imgRef as never} className={`absolute inset-0 flex items-end p-3 bg-ink-2 ${active ? "vt-poster" : ""}`}>
            <span className="font-[800] uppercase leading-[0.95] text-paper-muted text-lg" style={{ fontStretch: "70%" }}>
              {title}
            </span>
          </div>
        )}
        {!isPerson && (rating || item.overview) && (
          <div className="poster-slip" aria-hidden="true">
            {rating && (
              <p className="t-micro text-paper flex items-center gap-2 mb-1.5">
                <span className="text-signal tnum">{rating}</span>
                {genre && <span className="text-paper-muted truncate">{genre}</span>}
              </p>
            )}
            {item.overview && <p className="text-xs leading-[1.35] text-paper-muted line-clamp-4">{item.overview}</p>}
          </div>
        )}
      </div>
      <div className="poster-caption">
        <p className="text-sm font-[650] leading-tight text-paper line-clamp-2" style={{ fontStretch: "92%" }}>
          {title}
        </p>
        {meta && <p className="t-micro text-paper-subtle mt-1 truncate">{meta}</p>}
      </div>
    </Link>
  );
}
