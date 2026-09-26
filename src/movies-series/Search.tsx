import { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Icon from "../components/Icon";
import PosterGrid, { GridSkeleton } from "../components/PosterGrid";
import { useDocumentTitle } from "../hooks/useMotion";
import { usePaged } from "../hooks/usePaged";
import { useTmdb } from "../hooks/useTmdb";
import { MOVIE_GENRES } from "../lib/genres";
import { MediaItem, Paged, titleOf, yearOf } from "../lib/tmdb";

const TABS = [
  { key: "all", label: "Everything", path: "/search/multi" },
  { key: "movie", label: "Films", path: "/search/movie" },
  { key: "tv", label: "Series", path: "/search/tv" },
  { key: "person", label: "People", path: "/search/person" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const SHORTCUT_GENRES = [28, 35, 18, 27, 878, 10749, 53, 16];

export default function Search() {
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const q = (params.get("q") ?? "").trim();
  const tabParam = params.get("type");
  const tab: TabKey = TABS.some((t) => t.key === tabParam) ? (tabParam as TabKey) : "all";
  const [text, setText] = useState(params.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  useDocumentTitle(q ? `“${q}”` : "Search");

  const urlFor = (query: string, type: TabKey) => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (type !== "all") next.set("type", type);
    const qs = next.toString();
    return `/Search${qs ? `?${qs}` : ""}`;
  };

  // Results follow the text as you type; replace() keeps Back meaningful
  useEffect(() => {
    if (text.trim() === q) return;
    const t = window.setTimeout(() => history.replace(urlFor(text, tab)), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Keep the field in sync when the URL changes from outside (Back, a suggestion)
  useEffect(() => {
    if (q !== text.trim()) setText(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const active = TABS.find((t) => t.key === tab)!;
  const results = usePaged(q ? active.path : null, { query: q, include_adult: "false" });
  const found = results.items.filter((r) => tab !== "all" || r.media_type !== "person" || r.profile_path);

  // While the next query loads, keep the last results on screen (dimmed) instead of flashing skeletons
  const lastShown = useRef<MediaItem[]>([]);
  if (found.length) lastShown.current = found;
  if (!q) lastShown.current = [];
  const stale = results.loading && !found.length && lastShown.current.length > 0;
  const items = found.length ? found : stale ? lastShown.current : [];

  return (
    <>
      <Header />
      <main id="main" className="min-h-[70svh]">
        <div className="wrap pt-[calc(var(--header-h)+2.5rem)]">
          <h1 className="sr-only">Search</h1>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              history.replace(urlFor(text, tab));
              inputRef.current?.blur();
            }}
          >
            <label htmlFor="search-field" className="t-credit text-paper-muted block mb-3">
              Search films, series and people
            </label>
            <div className="relative border-b-[3px] border-paper focus-within:border-signal transition-colors">
              <Icon name="search" size={28} className="absolute left-0 top-1/2 -translate-y-1/2 text-paper-muted pointer-events-none" />
              <input
                ref={inputRef}
                id="search-field"
                type="search"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Try “Dune”, “Zendaya” or “heist”"
                autoFocus={!q}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                className="w-full bg-transparent pl-11 pr-12 py-4 text-[clamp(1.75rem,5vw,3.5rem)] font-[800] uppercase leading-none text-paper placeholder:text-paper-subtle placeholder:normal-case placeholder:font-[500] focus:outline-none"
                style={{ fontStretch: "70%" }}
              />
              {text && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="btn-icon absolute right-0 top-1/2 -translate-y-1/2"
                  onClick={() => {
                    setText("");
                    history.replace(urlFor("", tab));
                    inputRef.current?.focus();
                  }}
                >
                  <Icon name="close" />
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
            <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button key={t.key} type="button" className="chip" aria-pressed={tab === t.key} onClick={() => history.replace(urlFor(text, t.key))}>
                  {t.label}
                </button>
              ))}
            </div>
            <p className="t-micro text-paper-subtle tnum" aria-live="polite">
              {q && !results.loading ? `${results.totalResults.toLocaleString("en")} result${results.totalResults === 1 ? "" : "s"} for “${q}”` : ""}
            </p>
          </div>
        </div>

        <div className="wrap pt-10">
          {!q ? (
            <StartHere onPick={(term) => history.replace(urlFor(term, tab))} />
          ) : results.error && !items.length ? (
            <div className="py-16 flex flex-col items-start gap-4">
              <p className="text-paper-muted">Search didn't go through. Check your connection and try again.</p>
              <button type="button" className="btn btn-ghost" onClick={results.retry}>
                Try again
              </button>
            </div>
          ) : !items.length && results.loading ? (
            <GridSkeleton />
          ) : !items.length ? (
            <div className="py-12 max-w-[52ch]">
              <p className="t-strand">Nothing for “{q}”</p>
              <p className="text-paper-muted mt-4">
                Check the spelling, try the original title, or search for someone who worked on it.
                {tab !== "all" && (
                  <>
                    {" "}
                    <button type="button" className="underline decoration-rule-strong hover:text-signal hover:decoration-signal" onClick={() => history.replace(urlFor(q, "all"))}>
                      Search everything instead
                    </button>
                    .
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className={`transition-opacity duration-300 ${stale ? "opacity-40" : ""}`} aria-busy={stale}>
              <PosterGrid
                items={items}
                type={tab === "all" ? "movie" : tab}
                slot={`search-${tab}`}
                fresh={!results.fromCache}
                quiet
                note={(item) =>
                  item.media_type === "person" || tab === "person"
                    ? [item.known_for_department, item.known_for?.[0] && titleOf(item.known_for[0])].filter(Boolean).join(" · ")
                    : undefined
                }
              />
              {results.hasMore && !stale && (
                <div className="flex justify-center pt-12">
                  <button type="button" className="btn btn-ghost min-w-[12rem]" onClick={results.loadMore} disabled={results.loading}>
                    {results.loading ? <span className="spinner" aria-label="Loading" /> : "Show more"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function StartHere({ onPick }: { onPick: (term: string) => void }) {
  const { data } = useTmdb<Paged<MediaItem>>("/trending/all/day");
  const trending = (data?.results ?? []).filter((r) => r.media_type !== "person").slice(0, 10);

  return (
    <div className="grid gap-12 md:grid-cols-2 pb-6">
      <section aria-labelledby="trending-searches">
        <div className="strand-rule" />
        <h2 id="trending-searches" className="t-credit pt-4 pb-4">
          Trending today
        </h2>
        <ol>
          {trending.map((t, i) => (
            <li key={`${t.media_type}-${t.id}`} className="border-b border-rule">
              <button type="button" onClick={() => onPick(titleOf(t))} className="group w-full grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3 text-left">
                <span className="t-micro text-paper-subtle tnum">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-[650] group-hover:text-signal transition-colors" style={{ fontStretch: "92%" }}>
                  {titleOf(t)}
                </span>
                <span className="t-micro text-paper-subtle">{[yearOf(t), t.media_type === "tv" ? "Series" : "Film"].filter(Boolean).join(" · ")}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="by-genre">
        <div className="strand-rule" />
        <h2 id="by-genre" className="t-credit pt-4 pb-4">
          Or start from a genre
        </h2>
        <ul className="flex flex-wrap gap-2">
          {SHORTCUT_GENRES.map((g) => (
            <li key={g}>
              <Link to={`/Movies?genre=${g}`} className="chip">
                {MOVIE_GENRES[g]}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/Series" className="chip">
              All series
            </Link>
          </li>
        </ul>
        <p className="text-sm text-paper-muted mt-8 max-w-[44ch]">
          Tip: press <span className="kbd">/</span> on any page to jump straight here.
        </p>
      </section>
    </div>
  );
}
