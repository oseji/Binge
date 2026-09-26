import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { gsap } from "../lib/motion";

import Icon from "../components/Icon";
import Img from "../components/Img";
import { useTmdb } from "../hooks/useTmdb";
import { genreName } from "../lib/genres";
import { isActiveSlot, markPoster, prefersReducedMotion } from "../lib/history";
import { backdrop, backdropSrcSet, MediaItem, Paged, poster, prefetchDetails, titleOf, yearOf } from "../lib/tmdb";

// The opening sequence plays once per visit; coming Back to the page should feel instant
let introPlayed = false;

const TYPE_LABEL = { movie: "Film", tv: "Series" } as const;

export default function HeroSection() {
  const history = useHistory();
  const rootRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [onScreen, setOnScreen] = useState(0);
  const [cuts, setCuts] = useState<string[]>([]);
  const intent = useRef<number>();
  const playIntro = useRef(!introPlayed && !prefersReducedMotion());

  const { data } = useTmdb<Paged<MediaItem>>("/trending/all/week");
  const items = (data?.results ?? [])
    .filter((r) => (r.media_type === "movie" || r.media_type === "tv") && r.poster_path && r.backdrop_path)
    .slice(0, 14);
  const featured = items[onScreen];
  const featuredType = (featured?.media_type ?? "movie") as "movie" | "tv";

  // Each recut stacks a new still over the last; only the top two stay mounted
  useEffect(() => {
    if (!featured?.backdrop_path) return;
    const path = featured.backdrop_path;
    setCuts((c) => (c[c.length - 1] === path ? c : [...c.slice(-1), path]));
  }, [featured?.backdrop_path]);

  const recut = (i: number) => {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => {
      setOnScreen(i);
      prefetchDetails(items[i].media_type as "movie" | "tv", items[i].id);
    }, 140);
  };

  // Main title sequence: type on black, then the shutter opens on the still
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !playIntro.current) return;

    const ctx = gsap.context(() => {
      const wide = root.querySelector<HTMLElement>("[data-desqueeze]");
      const restStretch = wide ? getComputedStyle(wide).fontStretch : "125%";

      gsap.set("[data-shutter]", { "--shut": 50 });
      gsap.set("[data-line]", { yPercent: 108 });
      gsap.set("[data-rise]", { opacity: 0, y: 18 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => void (introPlayed = true) });
      tl.to("[data-line]", { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.1)
        .fromTo(wide, { fontStretch: "62%" }, { fontStretch: restStretch, duration: 1.5, ease: "power3.inOut" }, 0.3)
        .to("[data-rise]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.85);
    }, root);

    // The credit and strip arrive with the data, so they wait (hidden) for the shutter.
    // If TMDB is slow or down, open the shutter anyway rather than leave the frame shut.
    root.setAttribute("data-intro-pending", "");
    const giveUp = window.setTimeout(() => {
      if (!root.hasAttribute("data-intro-pending")) return;
      root.removeAttribute("data-intro-pending");
      gsap.to(root.querySelector("[data-shutter]"), { "--shut": 0, duration: 1.2, ease: "power4.inOut" });
    }, 6000);

    return () => {
      ctx.revert();
      window.clearTimeout(giveUp);
      root.removeAttribute("data-intro-pending");
    };
  }, []);

  // The shutter waits for the first still to decode, so it never opens on a blank frame
  const firstCut = cuts[0];
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !firstCut || !playIntro.current) return;
    const img = root.querySelector<HTMLImageElement>("[data-still] img");
    let cancelled = false;
    const open = () => {
      if (cancelled || !root.hasAttribute("data-intro-pending")) return;
      root.removeAttribute("data-intro-pending");
      gsap.to(root.querySelector("[data-shutter]"), { "--shut": 0, duration: 1.5, ease: "power4.inOut", delay: 0.15 });
      gsap.fromTo(root.querySelector("[data-credit]"), { opacity: 0, letterSpacing: "0.45em" }, { opacity: 1, letterSpacing: "0.08em", duration: 1.3, ease: "power3.out", delay: 0.7 });
      gsap.fromTo(img, { scale: 1.2, filter: "brightness(0.3)" }, { scale: 1, filter: "brightness(1)", duration: 2.8, ease: "expo.out", delay: 0.15 });
      gsap.fromTo(
        root.querySelectorAll("[data-strip] a"),
        { opacity: 0, x: 56 },
        { opacity: 1, x: 0, duration: 1.1, ease: "expo.out", stagger: 0.045, delay: 0.55 }
      );
    };
    const timer = window.setTimeout(open, 1400);
    img?.decode().then(open, open).finally(() => window.clearTimeout(timer));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [firstCut]);

  const search = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    history.push(q ? `/Search?q=${encodeURIComponent(q)}` : "/Search");
  };

  const genre = featured?.genre_ids?.map(genreName).find(Boolean);
  const featuredLink = featured && {
    pathname: `/Details/${featuredType}/${featured.id}`,
    state: { preview: { title: titleOf(featured), poster_path: featured.poster_path, backdrop_path: featured.backdrop_path } },
  };

  return (
    <section ref={rootRef} className="relative min-h-[100svh] flex flex-col overflow-hidden" aria-label="Tonight on Binge">
      <div data-shutter className="hero-shutter absolute inset-0">
        <div className="still vt-still" data-still>
          {cuts.map((path, i) => (
            <Img
              key={path}
              src={backdrop(path, "w1280")}
              srcSet={backdropSrcSet(path)}
              sizes="100vw"
              alt=""
              eager
              priority={i === 0}
              className={i > 0 ? "hero-cut" : undefined}
            />
          ))}
        </div>
        <div className="absolute inset-0 scrim-left" />
        <div className="absolute inset-0 scrim-bottom" />
      </div>

      <div className="relative flex-1 flex flex-col justify-end wrap pt-[calc(var(--header-h)+3rem)] pb-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="t-display" aria-label="Know what to watch tonight.">
              <span className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
                <span data-line className="block">Know what</span>
              </span>
              <span className="block overflow-hidden pb-[0.04em]" aria-hidden="true">
                <span data-line className="block">to watch</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]" aria-hidden="true">
                <span data-line className="block">
                  <span data-desqueeze className="hero-wide">
                    Tonight<span className="text-signal">.</span>
                  </span>
                </span>
              </span>
            </h1>

            <p data-rise className="t-lede mt-7 max-w-[44ch]">
              Trailers, cast, where to stream and a watchlist for every film and series. Free to browse, no account needed.
            </p>

            <form data-rise role="search" onSubmit={search} className="mt-8 flex max-w-xl gap-2">
              <label htmlFor="hero-search" className="sr-only">
                Search films, series and people
              </label>
              <div className="relative flex-1">
                <Icon name="search" className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-paper-subtle pointer-events-none" />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Films, series, people"
                  autoComplete="off"
                  className="field pl-12 min-h-[3.25rem] bg-ink-0/70 backdrop-blur-sm"
                />
              </div>
              <button type="submit" className="btn btn-signal min-h-[3.25rem] px-6">
                Search
              </button>
            </form>

            <div data-rise className="flex flex-wrap items-center gap-x-8 gap-y-1 mt-6">
              <a href="#programme" className="link-arrow t-credit py-2">
                Or browse this week's programme <Icon name="chevronDown" size={16} />
              </a>
              <Link to="/RegistrationPage" className="t-credit py-2 text-paper-muted hover:text-signal transition-colors underline decoration-rule-strong underline-offset-4">
                Create a free account
              </Link>
            </div>
          </div>

          {featured && featuredLink && (
            <div data-credit className="lg:col-span-4 lg:justify-self-end lg:text-right">
              <Link to={featuredLink} className="group inline-block">
                <span className="t-head block text-paper group-hover:text-signal transition-colors">{titleOf(featured)}</span>
                <span className="t-micro block text-paper-muted mt-1">
                  {["Now showing", yearOf(featured), TYPE_LABEL[featuredType], genre].filter(Boolean).join(" · ")}
                </span>
                <span className="link-arrow t-micro text-paper mt-3 group-hover:text-signal">
                  Open programme note <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="relative pb-6">
          <div className="wrap flex items-baseline justify-between gap-4 mb-3">
            <h2 className="t-credit text-paper">
              Trending this week
              <span className="hidden [@media(hover:hover)]:inline text-paper-subtle normal-case tracking-normal font-normal ml-3" style={{ fontStretch: "100%" }}>
                Point at a poster to preview it
              </span>
            </h2>
            <span className="t-micro text-paper-subtle">Data from TMDB</span>
          </div>
          <div data-strip className="strand-track pt-2 pb-2">
            {items.map((item, i) => {
              const type = item.media_type as "movie" | "tv";
              const title = titleOf(item);
              const slot = `hero-${type}-${item.id}`;
              return (
                <Link
                  key={slot}
                  to={{ pathname: `/Details/${type}/${item.id}`, state: { preview: { title, poster_path: item.poster_path, backdrop_path: item.backdrop_path } } }}
                  className="hero-frame group flex-shrink-0 w-[5.75rem] sm:w-[6.75rem] lg:w-[7.5rem]"
                  aria-current={i === onScreen ? "true" : undefined}
                  onPointerEnter={(e) => e.pointerType === "mouse" && recut(i)}
                  onPointerLeave={() => window.clearTimeout(intent.current)}
                  onFocus={() => recut(i)}
                  onClick={(e) => markPoster(slot, e.currentTarget.querySelector("img"))}
                >
                  <span className="sr-only">{title}</span>
                  <span className="block aspect-[2/3] overflow-hidden rounded-sm bg-ink-2">
                    <Img src={poster(item.poster_path, "w185")} alt="" eager={i < 8} className={`w-full h-full object-cover ${isActiveSlot(slot) ? "vt-poster" : ""}`} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
