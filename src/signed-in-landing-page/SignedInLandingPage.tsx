import FeatureHero from "../components/FeatureHero";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PosterCard from "../components/PosterCard";
import Strand from "../components/Strand";
import { useDocumentTitle } from "../hooks/useMotion";
import { useTmdb } from "../hooks/useTmdb";
import { Saved, useWatchlist } from "../hooks/useWatchlist";
import { MediaItem, MediaType, Paged } from "../lib/tmdb";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";

const STRANDS: { path: string; title: string; type: MediaType; to: string }[] = [
  { path: "/movie/now_playing", title: "In cinemas now", type: "movie", to: "/Movies?strand=now_playing" },
  { path: "/tv/on_the_air", title: "On air this week", type: "tv", to: "/Series?strand=on_the_air" },
  { path: "/movie/top_rated", title: "Top rated films", type: "movie", to: "/Movies?strand=top_rated" },
  { path: "/tv/top_rated", title: "Top rated series", type: "tv", to: "/Series?strand=top_rated" },
  { path: "/movie/upcoming", title: "Coming soon", type: "movie", to: "/Movies?strand=upcoming" },
];

export default function SignedInLandingPage() {
  const { data, loading, error, retry } = useTmdb<Paged<MediaItem>>("/trending/all/week");
  const { items } = useWatchlist();
  useDocumentTitle();

  const trending = data?.results.filter((r) => r.media_type === "movie" || r.media_type === "tv");
  const featured = trending?.find((r) => r.backdrop_path && r.overview);

  return (
    <>
      <Header overlay />
      <main id="main">
        <h1 className="sr-only">Your programme</h1>
        <FeatureHero item={featured} type={(featured?.media_type as MediaType) ?? "movie"} label="Most watched this week" />

        <div className="flex flex-col gap-[clamp(3rem,6vw,4.5rem)] pt-8">
          {items.length > 0 && <YourList saved={items} />}
          <Strand title="Trending this week" blurb="Films and series, ranked by TMDB activity over the last seven days." items={trending} type="movie" slot="home-trending" loading={loading} error={!!error} onRetry={retry} />
          {STRANDS.map((s) => (
            <HomeStrand key={s.path} {...s} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function HomeStrand({ path, title, type, to }: (typeof STRANDS)[number]) {
  const { data, loading, error, retry } = useTmdb<Paged<MediaItem>>(path);
  return <Strand title={title} seeAll={to} items={data?.results} type={type} slot={`home-${path}`} loading={loading} error={!!error} onRetry={retry} />;
}

/** The signed-in viewer's own saves, first, as a strand */
function YourList({ saved }: { saved: Saved[] }) {
  return (
    <section aria-labelledby="yourlist-heading">
      <div className="wrap">
        <div className="strand-rule" />
        <div className="flex items-end justify-between gap-6 pt-4">
          <h2 id="yourlist-heading" className="t-strand">
            Your list
          </h2>
          <Link to="/MyList" className="link-arrow t-credit py-3">
            See all <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
      <div className="strand-track dim-siblings">
        {saved.slice(0, 16).map((s) => (
          <SavedPoster key={`${s.mediaType}-${s.id}`} saved={s} />
        ))}
      </div>
    </section>
  );
}

function SavedPoster({ saved }: { saved: Saved }) {
  const { data } = useTmdb<MediaItem>(`/${saved.mediaType}/${saved.id}`);
  if (!data) return <div className="flex-shrink-0 w-[8.75rem] sm:w-[10rem] lg:w-[11.25rem] skeleton aspect-[2/3]" aria-hidden="true" />;
  return <PosterCard item={data} type={saved.mediaType} slot={`home-saved-${saved.mediaType}-${saved.id}`} />;
}
