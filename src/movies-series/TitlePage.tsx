import { ReactNode, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Icon from "../components/Icon";
import Img from "../components/Img";
import SaveButton from "../components/SaveButton";
import ShareButton from "../components/ShareButton";
import Strand from "../components/Strand";
import Trailer from "../components/Trailer";
import WhereToWatch from "../components/WhereToWatch";
import { DRAW_RULE, useDeal, WIPE_TITLE } from "../hooks/useDeal";
import { useIntro } from "../hooks/useIntro";
import { useDocumentTitle } from "../hooks/useMotion";
import { useTmdb } from "../hooks/useTmdb";
import { useTrailer } from "../hooks/useTrailer";
import { compact, countryName, languageName, longDate, money, plural, runtime } from "../lib/format";
import { canGoBack } from "../lib/history";
import {
  backdrop,
  backdropSrcSet,
  CrewMember,
  detailsParams,
  detectRegion,
  detailsPath,
  MediaItem,
  MediaType,
  MovieDetails,
  poster,
  posterSrcSet,
  TvDetails,
} from "../lib/tmdb";
import NotFound from "../NotFound";

export type Preview = { title?: string; poster_path?: string | null; profile_path?: string | null; backdrop_path?: string | null };

type Credit = { id: number; name: string };

const isMovie = (d: MovieDetails | TvDetails): d is MovieDetails => "title" in d;

function certification(d: MovieDetails | TvDetails, region: string) {
  if (isMovie(d)) {
    const pick = (r: string) => d.release_dates?.results.find((x) => x.iso_3166_1 === r)?.release_dates.find((x) => x.certification)?.certification;
    return pick(region) ?? pick("US");
  }
  const pick = (r: string) => d.content_ratings?.results.find((x) => x.iso_3166_1 === r)?.rating;
  return pick(region) ?? pick("US");
}

function yearSpan(d: TvDetails) {
  const start = d.first_air_date?.slice(0, 4);
  const end = d.last_air_date?.slice(0, 4);
  if (!start) return undefined;
  if (d.in_production) return `${start}–`;
  return end && end !== start ? `${start}–${end}` : start;
}

function crewBy(crew: CrewMember[] = [], jobs: string[]): Credit[] {
  const out: Credit[] = [];
  crew.forEach((c) => {
    const has = c.job ? jobs.includes(c.job) : c.jobs?.some((j) => jobs.includes(j.job));
    if (has && !out.some((o) => o.id === c.id)) out.push({ id: c.id, name: c.name });
  });
  return out;
}

export default function TitlePage({ type, id }: { type: MediaType; id: string }) {
  const { state } = useLocation<{ preview?: Preview } | undefined>();
  const history = useHistory();
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const preview = state?.preview;

  const { data, error, retry } = useTmdb<MovieDetails | TvDetails>(detailsPath(type, id), detailsParams(type));
  const title = data ? (isMovie(data) ? data.title : data.name) : preview?.title;
  useDocumentTitle(title);
  useIntro(heroRef, `${type}-${id}`);
  useDeal(bodyRef, !!data, [
    { ...DRAW_RULE, stagger: 120 },
    { ...WIPE_TITLE, stagger: 120, delay: 100 },
    { selector: "[data-deal]", keyframes: [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], duration: 900, stagger: 110, delay: 250 },
  ]);
  const year = data ? (isMovie(data) ? data.release_date : data.first_air_date)?.slice(0, 4) : undefined;
  const trailer = useTrailer(data?.videos?.results, data && title ? `${title} ${year ?? ""}`.trim() : undefined);

  if (error && !data) {
    if (error.message.includes("404")) return <NotFound what="title" />;
    return (
      <>
        <Header />
        <main id="main" className="wrap min-h-[80svh] flex flex-col items-start justify-center gap-5 pt-24">
          <h1 className="t-title">Couldn't load this title</h1>
          <p className="text-paper-muted">Something went wrong reaching TMDB. Check your connection and try again.</p>
          <button type="button" className="btn btn-paper" onClick={retry}>
            Try again
          </button>
        </main>
      </>
    );
  }

  const posterPath = data?.poster_path ?? preview?.poster_path;
  const backdropPath = data?.backdrop_path ?? preview?.backdrop_path;
  const region = detectRegion();

  const creditLine = data
    ? isMovie(data)
      ? crewBy(data.credits?.crew, ["Director"]).slice(0, 2)
      : data.created_by.slice(0, 2).map((c) => ({ id: c.id, name: c.name }))
    : [];
  const creditVerb = type === "movie" ? "Directed by" : "Created by";

  const metaLine = data
    ? isMovie(data)
      ? [data.release_date?.slice(0, 4), runtime(data.runtime), certification(data, region)]
      : [yearSpan(data), plural(data.number_of_seasons, "season"), certification(data, region)]
    : [];

  const cast: MediaItem[] = data
    ? (isMovie(data) ? data.credits?.cast : data.aggregate_credits?.cast)?.slice(0, 20).map((c) => ({
        id: c.id,
        name: c.name,
        profile_path: c.profile_path,
        poster_path: null,
        backdrop_path: null,
        character: c.character ?? c.roles?.[0]?.character,
      })) ?? []
    : [];

  const related = data?.recommendations?.results.length ? data.recommendations.results : data?.similar?.results ?? [];
  const browseBase = type === "movie" ? "/Movies" : "/Series";

  return (
    <>
      <Header overlay />
      <main id="main">
        <section ref={heroRef} className="relative min-h-[92svh] md:min-h-[88svh] flex items-end overflow-hidden" aria-labelledby="title-heading">
          <div className="still vt-still">
            {backdropPath && <Img src={backdrop(backdropPath)} srcSet={backdropSrcSet(backdropPath)} sizes="100vw" alt="" eager priority />}
          </div>
          <div className="absolute inset-0 scrim-left" />
          <div className="absolute inset-0 scrim-bottom" />

          <div className="relative wrap w-full pt-28 pb-12 md:pb-16 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
            <div className="w-[9rem] sm:w-[11rem] md:w-[13.5rem] lg:w-[15.5rem]">
              <div className="poster-frame shadow-[0_40px_60px_-30px_rgba(0,0,0,0.95)]">
                {posterPath ? (
                  <Img src={poster(posterPath, "w500")} srcSet={posterSrcSet(posterPath)} sizes="(min-width: 1024px) 248px, 216px" alt={title ? `${title} poster` : ""} eager className="vt-poster" />
                ) : (
                  <div className="vt-poster absolute inset-0 bg-ink-2" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              {canGoBack() && (
                <button type="button" onClick={() => history.goBack()} className="link-arrow t-micro text-paper-muted hover:text-paper py-2 mb-4">
                  <Icon name="arrowLeft" size={14} /> Back
                </button>
              )}
              <p data-intro-credit className={`t-credit text-paper-muted ${data ? "" : "min-h-[1rem]"}`}>
                {creditLine.length ? (
                  <>
                    {creditVerb}{" "}
                    {creditLine.map((c, i) => (
                      <span key={c.id}>
                        {i > 0 && " & "}
                        <Link to={`/Details/person/${c.id}`} className="text-paper hover:text-signal transition-colors">
                          {c.name}
                        </Link>
                      </span>
                    ))}
                  </>
                ) : null}
              </p>
              <h1 id="title-heading" className="t-title mt-3 overflow-hidden pb-[0.06em]">
                <span data-intro-line className="block">
                  {title ?? " "}
                </span>
              </h1>
              {data?.tagline && (
                <p data-intro className="mt-5 text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.25] font-[500] text-paper max-w-[34ch]" style={{ fontStretch: "86%" }}>
                  {data.tagline}
                </p>
              )}

              <div data-intro className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-5">
                {metaLine.filter(Boolean).length > 0 && <p className="t-micro text-paper tnum">{metaLine.filter(Boolean).join(" · ")}</p>}
                {data && data.vote_count > 0 && (
                  <p className="t-micro text-paper-muted tnum flex items-center gap-1.5">
                    <Icon name="star" size={13} className="text-signal" />
                    <span className="text-paper">{data.vote_average.toFixed(1)}</span> / 10 · {compact(data.vote_count)} votes
                  </p>
                )}
              </div>

              {data && data.genres.length > 0 && (
                <ul data-intro className="flex flex-wrap gap-2 mt-5" aria-label="Genres">
                  {data.genres.map((g) => (
                    <li key={g.id}>
                      <Link to={`${browseBase}?genre=${g.id}`} className="chip min-h-[2.25rem] bg-ink-0/40">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div data-intro className="flex flex-wrap gap-3 mt-7">
                {trailer && (
                  <a href="#trailer" className="btn btn-paper">
                    <Icon name="play" size={16} /> Watch trailer
                  </a>
                )}
                {data && <SaveButton type={type} id={data.id} title={title ?? ""} />}
                {title && <ShareButton title={title} />}
              </div>
            </div>
          </div>
        </section>

        <div>
          {data ? (
            <div ref={bodyRef} className="wrap grid gap-14 lg:grid-cols-12 pt-14">
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-14 min-w-0">
                <section aria-labelledby="synopsis-heading">
                  <div data-rule className="strand-rule" />
                  <h2 id="synopsis-heading" data-wipe className="t-credit pt-4 pb-4">
                    The {type === "movie" ? "film" : "series"}
                  </h2>
                  <p data-deal className="text-lg leading-[1.65] text-paper prose-measure">{data.overview || "TMDB doesn't have a synopsis for this one yet."}</p>
                </section>

                {trailer && (
                  <section id="trailer" aria-labelledby="trailer-heading" className="scroll-mt-24">
                    <div data-rule className="strand-rule" />
                    <h2 id="trailer-heading" data-wipe className="t-credit pt-4 pb-4">
                      Trailer
                    </h2>
                    <div data-deal>
                      <Trailer videoKey={trailer.key} title={title ?? ""} name={trailer.name} />
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-12">
                <div data-deal>
                  <WhereToWatch results={data["watch/providers"]?.results} title={title ?? "This title"} />
                </div>
                <div data-deal>
                  <Facts data={data} />
                </div>
              </aside>
            </div>
          ) : (
            <div className="wrap grid gap-14 lg:grid-cols-12 pt-14" aria-hidden="true">
              <div className="lg:col-span-8">
                <div className="skeleton h-1 w-full" />
                <div className="skeleton h-4 w-2/3 mt-8" />
                <div className="skeleton h-4 w-full mt-3" />
                <div className="skeleton h-4 w-5/6 mt-3" />
              </div>
              <div className="lg:col-span-4">
                <div className="skeleton h-40 w-full" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[clamp(3rem,6vw,4.5rem)] mt-[clamp(3.5rem,7vw,5.5rem)]">
            {(cast.length > 0 || !data) && (
              <Strand title="Cast" items={data ? cast : undefined} type="person" slot={`cast-${type}-${id}`} note={(c) => c.character} loading={!data} />
            )}

            {data && !isMovie(data) && data.seasons.length > 0 && <Seasons seasons={data.seasons} />}

            {(related.length > 0 || !data) && (
              <Strand
                title="More like this"
                blurb={data ? `If ${title} is your kind of thing, these are the next threads to pull.` : undefined}
                items={data ? related.slice(0, 20) : undefined}
                type={type}
                slot={`related-${type}-${id}`}
                loading={!data}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

type Row = { label: string; value: ReactNode } | null;

function Facts({ data }: { data: MovieDetails | TvDetails }) {
  const people = (label: string, list: Credit[]): Row =>
    list.length
      ? {
          label,
          value: list.slice(0, 3).map((p, i) => (
            <span key={p.id}>
              {i > 0 && ", "}
              <Link to={`/Details/person/${p.id}`} className="hover:text-signal transition-colors underline decoration-rule-strong hover:decoration-signal">
                {p.name}
              </Link>
            </span>
          )),
        }
      : null;

  const country = data.origin_country?.[0] ?? data.production_countries?.[0]?.iso_3166_1;
  const rows: Row[] = isMovie(data)
    ? [
        people("Director", crewBy(data.credits?.crew, ["Director"])),
        people("Writing", crewBy(data.credits?.crew, ["Screenplay", "Writer", "Story", "Novel"])),
        people("Music", crewBy(data.credits?.crew, ["Original Music Composer", "Music"])),
        people("Cinematography", crewBy(data.credits?.crew, ["Director of Photography"])),
        data.original_title !== data.title ? { label: "Original title", value: data.original_title } : null,
        { label: "Released", value: longDate(data.release_date) },
        { label: "Status", value: data.status },
        { label: "Language", value: languageName(data.original_language) },
        { label: "Country", value: countryName(country) },
        { label: "Budget", value: money(data.budget) },
        { label: "Box office", value: money(data.revenue) },
      ]
    : [
        people("Created by", data.created_by.map((c) => ({ id: c.id, name: c.name }))),
        people("Music", crewBy(data.aggregate_credits?.crew, ["Original Music Composer", "Music"])),
        { label: "Network", value: data.networks.map((n) => n.name).join(", ") || undefined },
        { label: "First aired", value: longDate(data.first_air_date) },
        data.next_episode_to_air
          ? { label: "Next episode", value: `${longDate(data.next_episode_to_air.air_date)} (S${data.next_episode_to_air.season_number} E${data.next_episode_to_air.episode_number})` }
          : { label: "Last aired", value: longDate(data.last_air_date) },
        { label: "Episodes", value: data.number_of_episodes ? `${data.number_of_episodes} across ${plural(data.number_of_seasons, "season")}` : undefined },
        { label: "Episode length", value: runtime(data.episode_run_time?.[0]) },
        { label: "Status", value: data.status },
        { label: "Language", value: languageName(data.original_language) },
        { label: "Country", value: countryName(country) },
      ];

  return (
    <section aria-labelledby="facts-heading">
      <div className="strand-rule" />
      <h2 id="facts-heading" className="t-credit pt-4 pb-2">
        Credits & facts
      </h2>
      <dl>
        {rows
          .filter((r): r is NonNullable<Row> => !!r && !!r.value)
          .map((r) => (
            <div key={r.label} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3 border-b border-rule">
              <dt className="t-micro text-paper-subtle pt-0.5">{r.label}</dt>
              <dd className="text-sm text-paper">{r.value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}

function Seasons({ seasons }: { seasons: TvDetails["seasons"] }) {
  const ordered = [...seasons.filter((s) => s.season_number > 0), ...seasons.filter((s) => s.season_number === 0)];
  return (
    <section aria-labelledby="seasons-heading">
      <div className="wrap">
        <div className="strand-rule" />
        <h2 id="seasons-heading" className="t-strand pt-4">
          Seasons
        </h2>
      </div>
      <ul className="strand-track">
        {ordered.map((s) => (
          <li key={s.id} className="flex-shrink-0 w-[7.5rem] sm:w-[8.5rem]">
            <div className="poster-frame">
              {s.poster_path ? (
                <Img src={poster(s.poster_path, "w185")} alt="" />
              ) : (
                <div className="absolute inset-0 flex items-end p-3 font-[800] uppercase text-paper-muted" style={{ fontStretch: "70%" }}>
                  {s.name}
                </div>
              )}
            </div>
            <p className="text-sm font-[650] mt-2.5" style={{ fontStretch: "92%" }}>
              {s.name}
            </p>
            <p className="t-micro text-paper-subtle mt-1 tnum">{[plural(s.episode_count, "episode"), s.air_date?.slice(0, 4)].filter(Boolean).join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
