import { useRef } from "react";
import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import Img from "../components/Img";
import { useDeal, WIPE_TITLE } from "../hooks/useDeal";
import { useTmdb } from "../hooks/useTmdb";
import { MediaItem, Paged, poster } from "../lib/tmdb";

// Real rows from the Movies and Series pages, framed as festival strands.
// TMDB's cinema lists count releases in every country at once, so those totals would mislead
const STRANDS = [
  { path: "/movie/now_playing", title: "In cinemas now", to: "/Movies#now_playing", note: "On big screens this week" },
  { path: "/movie/upcoming", title: "Coming soon", to: "/Movies#upcoming", note: "Dated releases on the way" },
  { path: "/movie/top_rated", title: "Top rated films", to: "/Movies#top_rated" },
  { path: "/tv/on_the_air", title: "On air this week", to: "/Series#on_the_air" },
  { path: "/tv/top_rated", title: "Top rated series", to: "/Series#top_rated" },
];

export default function Programme() {
  const ref = useRef<HTMLElement>(null);
  const first = useTmdb<Paged<MediaItem>>(STRANDS[0].path);

  useDeal(ref, !!first.data, [
    { ...WIPE_TITLE, stagger: 110 },
    {
      selector: "[data-deal]",
      keyframes: [
        { opacity: 0, transform: "translateY(24px) rotate(-3deg)" },
        { opacity: 1, transform: "none" },
      ],
      duration: 1000,
      stagger: 110,
      delay: 160,
    },
  ]);

  return (
    <section ref={ref} id="programme" aria-labelledby="programme-heading" className="wrap pt-[var(--section-y)] scroll-mt-16">
      <div className="grid gap-6 lg:grid-cols-12 items-end pb-8">
        <h2 id="programme-heading" className="t-title lg:col-span-7">
          This week's programme
        </h2>
        <p className="t-lede lg:col-span-5 max-w-[44ch]">
          Five strands, all live from TMDB. Pick one and start pulling threads: every title leads to its cast, and every cast member leads somewhere else.
        </p>
      </div>

      <ul className="border-t-[3px] border-paper">
        {STRANDS.map((s) => (
          <StrandRow key={s.to} {...s} />
        ))}
      </ul>
    </section>
  );
}

function StrandRow({ path, title, to, note }: { path: string; title: string; to: string; note?: string }) {
  const { data } = useTmdb<Paged<MediaItem>>(path);
  const fan = (data?.results ?? []).filter((r) => r.poster_path).slice(0, 4);

  return (
    <li className="border-b border-rule">
      <Link to={to} className="strand-row group grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto] items-center gap-x-6 gap-y-3 py-5 md:py-6">
        <span className="min-w-0">
          <span data-wipe className="strand-row-name block">
            {title}
          </span>
          <span className="t-micro text-paper-subtle mt-2 block tnum">
            {note ?? (data ? `${data.total_results.toLocaleString("en")} titles` : "\u00a0")}
          </span>
        </span>

        <span data-deal className="strand-fan hidden sm:flex" aria-hidden="true">
          {fan.map((f, i) => (
            <span key={f.id} className="strand-fan-card" style={{ ["--i" as string]: i }}>
              <Img src={poster(f.poster_path, "w185")} alt="" className="w-full h-full object-cover" />
            </span>
          ))}
        </span>

        <span className="strand-row-arrow" aria-hidden="true">
          <Icon name="arrowRight" size={28} />
        </span>
      </Link>
    </li>
  );
}
