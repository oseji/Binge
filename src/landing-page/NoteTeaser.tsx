import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import Img from "../components/Img";
import { useDeal } from "../hooks/useDeal";
import { useTmdb } from "../hooks/useTmdb";
import { countryName } from "../lib/format";
import { backdrop, detailsParams, detailsPath, detectRegion, logo, MediaItem, MovieDetails, Paged, pickTrailer, profile, ProviderRegion, tmdb, uniqueProviders, yearOf } from "../lib/tmdb";

/**
 * Shows, rather than describes, what a title page holds, using this week's #1 film.
 * It shares the cache with the title page, so following the link is instant.
 */
export default function NoteTeaser() {
  const ref = useRef<HTMLElement>(null);
  const region = detectRegion();
  const trending = useTmdb<Paged<MediaItem>>("/trending/movie/week");
  const candidates = (trending.data?.results ?? []).filter((m) => m.backdrop_path).slice(0, 5);
  const candidateKey = candidates.map((c) => c.id).join();
  const [pickId, setPickId] = useState<number | null>(null);

  // Demo with a film the visitor can actually watch somewhere, so "Where to watch" isn't empty
  useEffect(() => {
    if (!candidates.length) return;
    let live = true;
    Promise.all(candidates.map((c) => tmdb<{ results: Record<string, ProviderRegion> }>(`/movie/${c.id}/watch/providers`).catch(() => null))).then((all) => {
      if (!live) return;
      const i = all.findIndex((r) => {
        const p = r?.results?.[region];
        return !!(p?.flatrate?.length || p?.free?.length || p?.ads?.length || p?.rent?.length);
      });
      setPickId(candidates[Math.max(0, i)].id);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateKey, region]);

  const pick = candidates.find((c) => c.id === pickId);
  const { data: film } = useTmdb<MovieDetails>(pick ? detailsPath("movie", pick.id) : null, detailsParams("movie"));

  useDeal(ref, !!film, [
    {
      selector: "[data-deal]",
      keyframes: [
        { opacity: 0, transform: "translateY(32px)", clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, transform: "none", clipPath: "inset(0 0 0% 0)" },
      ],
      duration: 1100,
      stagger: 120,
    },
  ]);

  if (!pick) return null;

  const providers = film?.["watch/providers"]?.results?.[region];
  const streaming = uniqueProviders([...(providers?.flatrate ?? []), ...(providers?.free ?? []), ...(providers?.ads ?? []), ...(providers?.rent ?? [])]).slice(0, 5);
  const cast = film?.credits?.cast.filter((c) => c.profile_path).slice(0, 5) ?? [];
  const director = film?.credits?.crew.find((c) => c.job === "Director");
  const trailer = pickTrailer(film?.videos?.results);
  const to = { pathname: `/Details/movie/${pick.id}`, state: { preview: { title: pick.title, poster_path: pick.poster_path, backdrop_path: pick.backdrop_path } } };

  return (
    <section ref={ref} aria-labelledby="note-heading" className="wrap pt-[var(--section-y)]">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5 flex flex-col">
          <h2 id="note-heading" className="t-title !text-[clamp(2.5rem,4.6vw,4.5rem)]">
            Every title gets a programme note
          </h2>
          <p className="t-lede mt-6 max-w-[40ch]">
            Cast and crew, the official trailer, where it's streaming in {countryName(region) ?? "your country"}, and what to watch next. Here's one of this week's top trending films.
          </p>
          <Link to={to} className="btn btn-paper self-start mt-8">
            Open the note for {pick.title} <Icon name="arrowRight" size={18} />
          </Link>
        </div>

        <Link to={to} className="note-card lg:col-span-7 group block bg-ink-1 border border-rule hover:border-rule-strong transition-colors" aria-label={`${pick.title}: open programme note`}>
          <div data-deal className="relative aspect-[2.2/1] overflow-hidden bg-ink-2">
            <Img src={backdrop(pick.backdrop_path, "w1280")} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out motion-safe:group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-1 via-ink-1/30 to-transparent" />
            <div className="absolute left-5 right-5 bottom-4 md:left-7 md:bottom-6">
              <p className="t-micro text-paper-muted">
                {[yearOf(pick), director && `Directed by ${director.name}`].filter(Boolean).join(" · ")}
              </p>
              <p className="t-title !text-[clamp(2rem,4.4vw,3.75rem)] mt-2">{pick.title}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-rule">
            <div data-deal className="bg-ink-1 p-5 md:p-6">
              <p className="t-micro text-paper-subtle mb-3">Cast</p>
              <div className="flex gap-1.5">
                {cast.map((c) => (
                  <Img key={c.id} src={profile(c.profile_path, "w185")} alt="" className="w-9 h-[3.25rem] rounded-sm object-cover bg-ink-3" />
                ))}
              </div>
              <p className="text-sm text-paper-muted mt-3 line-clamp-2">{cast.slice(0, 3).map((c) => c.name).join(", ")}</p>
            </div>

            <div data-deal className="bg-ink-1 p-5 md:p-6">
              <p className="t-micro text-paper-subtle mb-3">Where to watch</p>
              {streaming.length ? (
                <div className="flex gap-2 flex-wrap">
                  {streaming.map((p) => (
                    <Img key={p.provider_id} src={logo(p.logo_path)} alt={p.provider_name} title={p.provider_name} className="w-10 h-10 rounded object-cover" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-paper-muted">Not streaming in {countryName(region) ?? "your country"} yet.</p>
              )}
              <p className="t-micro text-paper-subtle mt-3">Availability by JustWatch</p>
            </div>

            <div data-deal className="bg-ink-1 p-5 md:p-6">
              <p className="t-micro text-paper-subtle mb-3">Trailer</p>
              {trailer ? (
                <div className="relative aspect-video overflow-hidden rounded-sm bg-ink-2">
                  <Img src={`https://i.ytimg.com/vi/${trailer.key}/mqdefault.jpg`} alt="" className="w-full h-full object-cover opacity-80" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="play-disc w-10 h-10 rounded-full bg-paper text-ink-0 flex items-center justify-center group-hover:bg-signal">
                      <Icon name="play" size={16} />
                    </span>
                  </span>
                </div>
              ) : (
                <p className="text-sm text-paper-muted">No trailer yet.</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
