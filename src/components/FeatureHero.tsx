import { useRef } from "react";
import { Link } from "react-router-dom";

import { useDeal } from "../hooks/useDeal";
import { genreName } from "../lib/genres";
import { backdrop, backdropSrcSet, MediaItem, MediaType, prefetchDetails, titleOf, yearOf } from "../lib/tmdb";
import Icon from "./Icon";
import Img from "./Img";
import SaveButton from "./SaveButton";

type Props = {
  item?: MediaItem;
  type: MediaType;
  /** Leads the meta line under the title, e.g. which strand this came from */
  label: string;
  heading?: string;
};

/** Full-bleed still that opens the Movies, Series and signed-in home pages */
export default function FeatureHero({ item, type, label, heading }: Props) {
  const ref = useRef<HTMLElement>(null);

  useDeal(ref, !!item, [
    { selector: "[data-still] img", keyframes: [{ opacity: 0, transform: "scale(1.12)", filter: "brightness(0.4)" }, { opacity: 1, transform: "none", filter: "none" }], duration: 2200 },
    { selector: "[data-line]", keyframes: [{ transform: "translateY(105%)" }, { transform: "none" }], duration: 1100, delay: 200 },
    { selector: "[data-deal]", keyframes: [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], duration: 900, stagger: 80, delay: 500 },
  ]);

  if (!item) {
    return (
      <section className="relative min-h-[72svh] md:min-h-[82svh] flex items-end">
        <div className="wrap pb-14 w-full">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-16 w-3/4 max-w-xl mt-4" />
          <div className="skeleton h-4 w-full max-w-lg mt-6" />
        </div>
      </section>
    );
  }

  const title = titleOf(item);
  const genres = (item.genre_ids ?? []).map(genreName).filter(Boolean).slice(0, 2);
  const to = { pathname: `/Details/${type}/${item.id}`, state: { preview: { title, poster_path: item.poster_path, backdrop_path: item.backdrop_path } } };

  return (
    <section ref={ref} className="relative min-h-[72svh] md:min-h-[82svh] flex items-end overflow-hidden" aria-label={`Featured: ${title}`}>
      <div className="still vt-still" data-still>
        <Img src={backdrop(item.backdrop_path)} srcSet={backdropSrcSet(item.backdrop_path)} sizes="100vw" alt="" eager priority />
      </div>
      <div className="absolute inset-0 scrim-left" />
      <div className="absolute inset-0 scrim-bottom" />

      <div className="relative wrap pb-12 md:pb-16 pt-32 w-full">
        {heading && <h1 className="sr-only">{heading}</h1>}
        <p className="t-title max-w-[14ch] overflow-hidden pb-[0.06em]">
          <span data-line className="block">
            {title}
          </span>
        </p>
        <p data-deal className="t-micro text-paper-muted mt-4">
          {[label, yearOf(item), ...genres, item.vote_average ? `${item.vote_average.toFixed(1)} on TMDB` : undefined].filter(Boolean).join(" · ")}
        </p>
        {item.overview && (
          <p data-deal className="mt-4 max-w-[52ch] text-paper-muted line-clamp-3">
            {item.overview}
          </p>
        )}
        <div data-deal className="flex flex-wrap gap-3 mt-7">
          <Link to={to} className="btn btn-paper" onPointerEnter={() => prefetchDetails(type, item.id)}>
            Programme note <Icon name="arrowRight" size={18} />
          </Link>
          <SaveButton type={type} id={item.id} title={title} />
        </div>
      </div>
    </section>
  );
}
