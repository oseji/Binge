import { Link, useHistory, useLocation } from "react-router-dom";

import FeatureHero from "../components/FeatureHero";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Icon from "../components/Icon";
import PosterGrid, { GridSkeleton } from "../components/PosterGrid";
import Strand from "../components/Strand";
import { useDocumentTitle } from "../hooks/useMotion";
import { usePaged } from "../hooks/usePaged";
import { useTmdb } from "../hooks/useTmdb";
import { genreList, genreMap } from "../lib/genres";
import { MediaItem, MediaType, Paged } from "../lib/tmdb";

type StrandDef = { key: string; title: string; blurb?: string };

export type BrowseConfig = {
  type: MediaType;
  label: string;
  strands: StrandDef[];
  /** Strand whose top title opens the page */
  heroFrom: string;
};

const SORTS = {
  popular: { label: "Most popular", movie: { sort_by: "popularity.desc", "vote_count.gte": 50 }, tv: { sort_by: "popularity.desc", "vote_count.gte": 50 } },
  rated: { label: "Highest rated", movie: { sort_by: "vote_average.desc", "vote_count.gte": 800 }, tv: { sort_by: "vote_average.desc", "vote_count.gte": 400 } },
  newest: { label: "Newest", movie: { sort_by: "primary_release_date.desc", "vote_count.gte": 25 }, tv: { sort_by: "first_air_date.desc", "vote_count.gte": 25 } },
} as const;

type SortKey = keyof typeof SORTS;

export default function Browse({ config }: { config: BrowseConfig }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const genreId = Number(params.get("genre")) || undefined;
  const strandKey = params.get("strand") ?? undefined;
  const sort = (params.get("sort") as SortKey) in SORTS ? (params.get("sort") as SortKey) : "popular";
  const genres = genreMap(config.type);
  const genre = genreId && genres[genreId] ? genreId : undefined;
  const strand = config.strands.find((s) => s.key === strandKey);

  const view = genre ? `${genres[genre]}` : strand ? strand.title : undefined;
  useDocumentTitle(view ? `${view} · ${config.label}` : config.label);

  return (
    <>
      <Header overlay={!view} />
      <main id="main">
        {view ? <div className="h-[calc(var(--header-h)+1rem)]" /> : <HeroFromStrand config={config} />}

        <FilterBar config={config} genre={genre} strand={strand?.key} viewing={!!view} />

        {genre ? (
          <DiscoverGrid config={config} genre={genre} sort={sort} />
        ) : strand ? (
          <ListGrid config={config} strand={strand} />
        ) : (
          <div className="flex flex-col gap-[clamp(3rem,6vw,4.5rem)] pt-6">
            {config.strands.map((s) => (
              <BrowseStrand key={s.key} config={config} strand={s} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function HeroFromStrand({ config }: { config: BrowseConfig }) {
  const { data } = useTmdb<Paged<MediaItem>>(`/${config.type}/${config.heroFrom}`);
  const item = data?.results.find((r) => r.backdrop_path && r.overview);
  const from = config.strands.find((s) => s.key === config.heroFrom);
  return <FeatureHero item={item} type={config.type} label={from?.title ?? config.label} />;
}

function FilterBar({ config, genre, strand, viewing }: { config: BrowseConfig; genre?: number; strand?: string; viewing: boolean }) {
  const base = `/${config.label}`;
  return (
    <>
      <div className="wrap flex items-center gap-5 pt-4">
        {viewing ? (
          <Link to={base} className="link-arrow t-credit py-2 text-paper-muted hover:text-paper">
            <Icon name="arrowLeft" size={16} /> All {config.label.toLowerCase()}
          </Link>
        ) : (
          <h1 className="t-strand">{config.label}</h1>
        )}
      </div>
      {/* Only the genre row sticks, so the filter stays in reach without eating the viewport */}
      <nav aria-label={`${config.label} by genre`} className="sticky top-[var(--header-h)] z-40 bg-ink-0/90 backdrop-blur-md border-b border-rule">
        <div className="strand-track no-scrollbar gap-2 py-3">
          <Link to={base} className="chip" aria-current={!genre && !strand ? "page" : undefined}>
            All
          </Link>
          {genreList(config.type).map((g) => (
            <Link key={g.id} to={`${base}?genre=${g.id}`} className="chip" aria-current={genre === g.id ? "page" : undefined}>
              {g.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

function BrowseStrand({ config, strand }: { config: BrowseConfig; strand: StrandDef }) {
  const { data, loading, error, retry } = useTmdb<Paged<MediaItem>>(`/${config.type}/${strand.key}`);
  return (
    <Strand
      id={strand.key}
      title={strand.title}
      blurb={strand.blurb}
      seeAll={`/${config.label}?strand=${strand.key}`}
      items={data?.results}
      type={config.type}
      loading={loading}
      error={!!error}
      onRetry={retry}
      slot={`${config.type}-${strand.key}`}
    />
  );
}

function GridHeader({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <h1 className="t-title">{title}</h1>
        {count ? <p className="t-micro text-paper-subtle mt-3 tnum">{count.toLocaleString("en")} titles</p> : null}
      </div>
      {children}
    </div>
  );
}

function DiscoverGrid({ config, genre, sort }: { config: BrowseConfig; genre: number; sort: SortKey }) {
  const history = useHistory();
  const today = new Date().toISOString().slice(0, 10);
  const dateCap = config.type === "movie" ? { "primary_release_date.lte": today } : { "first_air_date.lte": today };
  const list = usePaged(`/discover/${config.type}`, { with_genres: genre, include_adult: "false", ...SORTS[sort][config.type], ...(sort === "newest" ? dateCap : {}) });
  const name = genreMap(config.type)[genre];

  return (
    <section className="wrap pt-10">
      <GridHeader title={name} count={list.totalResults}>
        <div className="flex gap-2" role="group" aria-label="Sort">
          {(Object.keys(SORTS) as SortKey[]).map((k) => (
            <button
              key={k}
              type="button"
              className="chip"
              aria-pressed={sort === k}
              onClick={() => history.replace(`/${config.label}?genre=${genre}${k === "popular" ? "" : `&sort=${k}`}`)}
            >
              {SORTS[k].label}
            </button>
          ))}
        </div>
      </GridHeader>
      <GridBody list={list} config={config} slot={`genre-${genre}-${sort}`} />
    </section>
  );
}

function ListGrid({ config, strand }: { config: BrowseConfig; strand: StrandDef }) {
  const list = usePaged(`/${config.type}/${strand.key}`);
  return (
    <section className="wrap pt-10">
      <GridHeader title={strand.title} count={list.totalResults} />
      <GridBody list={list} config={config} slot={`all-${strand.key}`} />
    </section>
  );
}

function GridBody({ list, config, slot }: { list: ReturnType<typeof usePaged>; config: BrowseConfig; slot: string }) {
  if (list.error && !list.items.length) {
    return (
      <div className="py-20 flex flex-col items-start gap-4">
        <p className="text-paper-muted">Couldn't load these titles. Check your connection and try again.</p>
        <button type="button" className="btn btn-ghost" onClick={list.retry}>
          Try again
        </button>
      </div>
    );
  }
  if (!list.items.length && list.loading) return <GridSkeleton />;
  if (!list.items.length) return <p className="py-20 text-paper-muted">No titles match yet. Try another genre.</p>;

  return (
    <>
      <PosterGrid items={list.items} type={config.type} slot={slot} fresh={!list.fromCache} />
      <div className="flex justify-center pt-12">
        {list.hasMore && (
          <button type="button" className="btn btn-ghost min-w-[12rem]" onClick={list.loadMore} disabled={list.loading}>
            {list.loading ? <span className="spinner" aria-label="Loading" /> : list.error ? "Try again" : "Show more"}
          </button>
        )}
      </div>
    </>
  );
}
