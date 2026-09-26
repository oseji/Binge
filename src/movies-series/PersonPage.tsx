import { useMemo, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Icon from "../components/Icon";
import Img from "../components/Img";
import ShareButton from "../components/ShareButton";
import Strand from "../components/Strand";
import { DRAW_RULE, useDeal, WIPE_TITLE } from "../hooks/useDeal";
import { useIntro } from "../hooks/useIntro";
import { useDocumentTitle } from "../hooks/useMotion";
import { useTmdb } from "../hooks/useTmdb";
import { ageOn, longDate } from "../lib/format";
import { canGoBack } from "../lib/history";
import { backdrop, backdropSrcSet, detailsParams, detailsPath, MediaItem, PersonDetails, prefetchDetails, profile, titleOf, yearOf } from "../lib/tmdb";
import NotFound from "../NotFound";
import type { Preview } from "./TitlePage";

type CreditRow = { key: string; item: MediaItem; year?: string; role: string; dept: string };

const DEPT_LABEL: Record<string, string> = { Acting: "Acting", Directing: "Directing", Writing: "Writing", Production: "Producing", Sound: "Music & sound", Camera: "Camera", Editing: "Editing", Creator: "Created" };

export default function PersonPage({ id }: { id: string }) {
  const { state } = useLocation<{ preview?: Preview } | undefined>();
  const history = useHistory();
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [bioOpen, setBioOpen] = useState(false);
  const [dept, setDept] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data, error, retry } = useTmdb<PersonDetails>(detailsPath("person", id), detailsParams("person"));
  const name = data?.name ?? state?.preview?.title;
  useDocumentTitle(name);
  useIntro(heroRef, `person-${id}`);
  useDeal(bodyRef, !!data, [
    { ...DRAW_RULE, stagger: 120 },
    { ...WIPE_TITLE, stagger: 120, delay: 100 },
    { selector: "[data-deal]", keyframes: [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], duration: 900, stagger: 110, delay: 250 },
  ]);

  const { knownFor, rows, depts, still } = useMemo(() => {
    const cast = data?.combined_credits?.cast ?? [];
    const crew = data?.combined_credits?.crew ?? [];
    const all = [...cast, ...crew].filter((c) => c.media_type === "movie" || c.media_type === "tv");

    // Talk shows and award ceremonies dominate vote counts for some actors; skip self-appearances
    const isSelf = (c: MediaItem) => /^(self|himself|herself|themselves)\b/i.test(c.character ?? "");
    const seen = new Set<string>();
    const knownFor = [...all]
      .filter((c) => c.poster_path && !isSelf(c))
      .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
      .filter((c) => {
        const k = `${c.media_type}-${c.id}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 16);

    const rows: CreditRow[] = [
      ...cast.map((c, i) => ({ key: `c${i}-${c.credit_id ?? c.id}`, item: c, year: yearOf(c), role: c.character ? `as ${c.character}` : "", dept: "Acting" })),
      ...crew.map((c, i) => ({ key: `k${i}-${c.id}-${c.job}`, item: c, year: yearOf(c), role: c.job ?? "", dept: c.department ?? "Crew" })),
    ]
      .filter((r) => r.item.media_type === "movie" || r.item.media_type === "tv")
      .sort((a, b) => (b.year ?? "9999").localeCompare(a.year ?? "9999"));

    const depts = Array.from(new Set(rows.map((r) => r.dept))).sort((a, b) => rows.filter((r) => r.dept === b).length - rows.filter((r) => r.dept === a).length);
    const still = knownFor.find((k) => k.backdrop_path)?.backdrop_path;
    return { knownFor, rows, depts, still };
  }, [data]);

  if (error && !data) {
    if (error.message.includes("404")) return <NotFound what="person" />;
    return (
      <>
        <Header />
        <main id="main" className="wrap min-h-[80svh] flex flex-col items-start justify-center gap-5 pt-24">
          <h1 className="t-title">Couldn't load this person</h1>
          <p className="text-paper-muted">Something went wrong reaching TMDB. Check your connection and try again.</p>
          <button type="button" className="btn btn-paper" onClick={retry}>
            Try again
          </button>
        </main>
      </>
    );
  }

  const photo = data?.profile_path ?? state?.preview?.profile_path;
  const age = data?.birthday ? ageOn(data.birthday, data.deathday) : undefined;
  const activeDept = dept ?? depts[0] ?? null;
  const filtered = rows.filter((r) => !activeDept || r.dept === activeDept);
  const visible = showAll ? filtered : filtered.slice(0, 24);
  const bio = data?.biography?.trim();
  const creditCount = new Set(rows.map((r) => `${r.item.media_type}${r.item.id}`)).size;

  return (
    <>
      <Header overlay />
      <main id="main">
        <section ref={heroRef} className="relative min-h-[80svh] flex items-end overflow-hidden" aria-labelledby="person-heading">
          {/* People have no stills of their own; borrow one from the work they're best known for */}
          <div className="still vt-still">
            {still && <Img src={backdrop(still)} srcSet={backdropSrcSet(still)} sizes="100vw" alt="" eager className="opacity-50 grayscale-[35%]" />}
          </div>
          <div className="absolute inset-0 scrim-left" />
          <div className="absolute inset-0 scrim-bottom" />

          <div className="relative wrap w-full pt-28 pb-12 md:pb-16 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
            <div className="w-[9rem] sm:w-[11rem] md:w-[13.5rem] lg:w-[15rem]">
              <div className="poster-frame shadow-[0_40px_60px_-30px_rgba(0,0,0,0.95)]">
                {photo ? (
                  <Img src={profile(photo, "h632")} alt={name ? `Portrait of ${name}` : ""} eager className="vt-poster" />
                ) : (
                  <div className="vt-poster absolute inset-0 flex items-center justify-center text-paper-subtle">
                    <Icon name="user" size={48} />
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              {canGoBack() && (
                <button type="button" onClick={() => history.goBack()} className="link-arrow t-micro text-paper-muted hover:text-paper py-2 mb-4">
                  <Icon name="arrowLeft" size={14} /> Back
                </button>
              )}
              <h1 id="person-heading" className="t-title overflow-hidden pb-[0.06em]">
                <span data-intro-line className="block">
                  {name ?? " "}
                </span>
              </h1>
              {data && (
                <p data-intro-credit className="t-credit text-paper-muted mt-4">
                  {[
                    data.known_for_department && `Known for ${(DEPT_LABEL[data.known_for_department] ?? data.known_for_department).toLowerCase()}`,
                    age !== undefined && !data.deathday ? `Age ${age}` : undefined,
                    creditCount ? `${creditCount} credits` : undefined,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              <div data-intro className="flex flex-wrap gap-3 mt-7">
                {name && <ShareButton title={name} />}
              </div>
            </div>
          </div>
        </section>

        <div>
          {data && (
            <div ref={bodyRef} className="wrap pt-14 grid gap-14 lg:grid-cols-12">
              <section aria-labelledby="bio-heading" className="lg:col-span-7 xl:col-span-8">
                <div data-rule className="strand-rule" />
                <h2 id="bio-heading" data-wipe className="t-credit pt-4 pb-4">
                  Biography
                </h2>
                <div data-deal className="prose-measure">
                  {bio ? (
                    <>
                      <p id="bio" className={`text-lg leading-[1.65] whitespace-pre-line ${bioOpen ? "" : "line-clamp-6"}`}>
                        {bio}
                      </p>
                      {bio.length > 480 && (
                        <button type="button" className="link-arrow t-credit mt-4 py-2" aria-expanded={bioOpen} aria-controls="bio" onClick={() => setBioOpen((o) => !o)}>
                          {bioOpen ? "Show less" : "Read the full biography"}
                          <Icon name="chevronDown" size={16} className={bioOpen ? "rotate-180" : ""} />
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-paper-muted">TMDB doesn't have a biography for {data.name} yet.</p>
                  )}
                </div>
              </section>

              <aside aria-labelledby="person-facts" className="lg:col-span-5 xl:col-span-4">
                <div data-rule className="strand-rule" />
                <h2 id="person-facts" data-wipe className="t-credit pt-4 pb-2">
                  Facts
                </h2>
                <dl data-deal>
                  {[
                    { label: "Born", value: longDate(data.birthday) },
                    { label: "Birthplace", value: data.place_of_birth },
                    { label: "Died", value: data.deathday ? `${longDate(data.deathday)}${age !== undefined ? ` (aged ${age})` : ""}` : undefined },
                    { label: "Worked in", value: depts.map((d) => DEPT_LABEL[d] ?? d).join(", ") || undefined },
                  ]
                    .filter((r) => r.value)
                    .map((r) => (
                      <div key={r.label} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 border-b border-rule">
                        <dt className="t-micro text-paper-subtle pt-0.5">{r.label}</dt>
                        <dd className="text-sm text-paper">{r.value}</dd>
                      </div>
                    ))}
                </dl>
              </aside>
            </div>
          )}

          <div className="mt-[clamp(3.5rem,7vw,5.5rem)]">
            {(knownFor.length > 0 || !data) && (
              <Strand title="Known for" items={data ? knownFor : undefined} type="movie" slot={`knownfor-${id}`} loading={!data} note={(c) => [yearOf(c), c.character || c.job].filter(Boolean).join(" · ")} />
            )}
          </div>

          {rows.length > 0 && (
            <section aria-labelledby="credits-heading" className="wrap mt-[clamp(3rem,6vw,4.5rem)]">
              <div className="strand-rule" />
              <div className="flex flex-wrap items-end justify-between gap-4 pt-4 pb-4">
                <h2 id="credits-heading" className="t-strand">
                  Filmography
                </h2>
                {depts.length > 1 && (
                  <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2">
                    {depts.map((d) => (
                      <button key={d} type="button" className="chip" aria-pressed={activeDept === d} onClick={() => { setDept(d); setShowAll(false); }}>
                        {DEPT_LABEL[d] ?? d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <ol>
                {visible.map((r) => {
                  const type = r.item.media_type as "movie" | "tv";
                  return (
                    <li key={r.key} className="border-b border-rule">
                      <Link
                        to={{ pathname: `/Details/${type}/${r.item.id}`, state: { preview: { title: titleOf(r.item), poster_path: r.item.poster_path, backdrop_path: r.item.backdrop_path } } }}
                        onPointerEnter={() => prefetchDetails(type, r.item.id)}
                        className="group grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_1fr_auto] gap-x-4 gap-y-1 py-3.5 items-baseline hover:bg-ink-1 -mx-3 px-3 transition-colors"
                      >
                        <span className="t-micro text-paper-subtle tnum">{r.year ?? "TBA"}</span>
                        <span className="min-w-0">
                          <span className="font-[650] group-hover:text-signal transition-colors" style={{ fontStretch: "92%" }}>
                            {titleOf(r.item)}
                          </span>
                          {r.role && <span className="text-sm text-paper-muted"> {r.role}</span>}
                        </span>
                        <span className="t-micro text-paper-subtle hidden sm:block">{type === "tv" ? "Series" : "Film"}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
              {filtered.length > visible.length && (
                <button type="button" className="btn btn-ghost mt-8" onClick={() => setShowAll(true)}>
                  Show all {filtered.length} credits
                </button>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
