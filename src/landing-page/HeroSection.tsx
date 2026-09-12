import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

type TrendingItem = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

const POSTER = "https://image.tmdb.org/t/p/w342";
const BACKDROP = "https://image.tmdb.org/t/p/original";
const FALLBACK_BG = "/heroSection-bg.jpg";

const HeroSection = () => {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/trending/all/week", {
          params: { language: "en-US" },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        });
        const items: TrendingItem[] = res.data.results.filter(
          (r: TrendingItem) => r.poster_path && (r.media_type === "movie" || r.media_type === "tv")
        );
        setTrending(items.slice(0, 12));
      } catch {
        // Static collage stays as the background and the strip is simply not shown
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo(headingRef.current, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
        .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    });

    return () => mm.revert();
  }, []);

  // Slide the poster strip in once it has content
  useEffect(() => {
    if (!trending.length || !stripRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        stripRef.current!.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" }
      );
    });
    return () => mm.revert();
  }, [trending]);

  const featured = trending.find((t) => t.backdrop_path);
  const backgroundImage = featured ? `url("${BACKDROP}${featured.backdrop_path}")` : `url("${FALLBACK_BG}")`;

  return (
    <section className="HeroSection">
      {/* Background: this week's #1 title, or the poster collage until it loads */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-[background-image] duration-700"
        style={{ backgroundImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-canvas/40 to-transparent" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col px-5 md:px-10 lg:px-14 pt-10 md:pt-32 pb-8">
        {/* Copy */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <p ref={eyebrowRef} className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-text mb-5">
            Free · No sign-up needed to browse
          </p>

          <h1
            ref={headingRef}
            className="text-display font-bold tracking-[-0.03em] text-white mb-6"
          >
            Know what to watch <span className="text-gradient">tonight.</span>
          </h1>

          <p ref={subRef} className="text-fg-muted text-base md:text-lg leading-relaxed max-w-lg mb-9">
            Trailers, ratings and a watchlist for every movie and series. Search it, save it, watch it.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to={"/RegistrationPage"}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-br from-accent to-accent-deep shadow-lg shadow-purple-900/40 hover:-translate-y-0.5 hover:shadow-purple-700/40 transition-all duration-200"
            >
              Get started, it's free
            </Link>
            <Link
              to={"/Movies"}
              className="inline-flex items-center gap-2 py-3 font-semibold text-fg hover:text-accent-text transition-colors group"
            >
              Browse movies
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* The product itself: real titles, clickable */}
        {trending.length > 0 && (
          <div className="mt-14 md:mt-16">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-fg-subtle">
                Trending this week
              </h2>
              <span className="text-xs text-fg-subtle">Data from TMDB</span>
            </div>
            <div ref={stripRef} className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 heroStrip">
              {trending.map((item) => {
                const title = item.title ?? item.name ?? "";
                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={`/Details/${item.media_type}/${item.id}`}
                    className="movieCard flex-shrink-0 rounded-lg"
                    aria-label={`View ${title}`}
                  >
                    <img
                      src={`${POSTER}${item.poster_path}`}
                      alt={title}
                      loading="lazy"
                      className="h-40 md:h-52 w-auto rounded-lg object-cover"
                    />
                    <div className="movieCardOverlay">
                      <p className="font-semibold text-sm leading-tight">{title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
