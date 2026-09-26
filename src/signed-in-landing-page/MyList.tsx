import { useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Icon from "../components/Icon";
import PosterCard from "../components/PosterCard";
import { GRID, GridSkeleton } from "../components/PosterGrid";
import Strand from "../components/Strand";
import { useDocumentTitle } from "../hooks/useMotion";
import { useTmdb } from "../hooks/useTmdb";
import { Saved, useWatchlist } from "../hooks/useWatchlist";
import { plural } from "../lib/format";
import { MediaItem, Paged, titleOf } from "../lib/tmdb";

type Filter = "all" | "movie" | "tv";

export default function MyList() {
  const { user, authReady, items, listReady, listError, reload } = useWatchlist();
  const [filter, setFilter] = useState<Filter>("all");
  useDocumentTitle("My List");

  const shown = items.filter((s) => filter === "all" || s.mediaType === filter);
  const films = items.filter((s) => s.mediaType === "movie").length;

  return (
    <>
      <Header />
      <main id="main" className="min-h-[70svh]">
        <div className="wrap pt-[calc(var(--header-h)+2.5rem)]">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
            <div>
              <h1 className="t-display">My List</h1>
              {user && listReady && items.length > 0 && (
                <p className="t-micro text-paper-subtle mt-4 tnum">
                  {[plural(films, "film"), plural(items.length - films, "series", "series")].join(" · ")}
                </p>
              )}
            </div>
            {user && items.length > 0 && (
              <div role="group" aria-label="Show" className="flex gap-2">
                {(["all", "movie", "tv"] as Filter[]).map((f) => (
                  <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                    {f === "all" ? "Everything" : f === "movie" ? "Films" : "Series"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!authReady || (user && !listReady) ? (
          <div className="wrap">
            <GridSkeleton count={6} />
          </div>
        ) : !user ? (
          <SignedOut />
        ) : listError ? (
          <div className="wrap py-12 flex flex-col items-start gap-4">
            <p className="text-paper-muted">Couldn't load your list. Check your connection and try again.</p>
            <button type="button" className="btn btn-ghost" onClick={reload}>
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyList />
        ) : (
          <ul className={`wrap ${GRID} dim-siblings`}>
            {shown.map((s) => (
              <SavedCard key={`${s.mediaType}-${s.id}`} saved={s} />
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}

function SavedCard({ saved }: { saved: Saved }) {
  const { toggle, isBusy } = useWatchlist();
  const { data, error } = useTmdb<MediaItem>(`/${saved.mediaType}/${saved.id}`);

  if (error) return null;
  if (!data) {
    return (
      <li aria-hidden="true">
        <div className="skeleton aspect-[2/3]" />
        <div className="skeleton h-3 mt-3 w-3/4" />
      </li>
    );
  }

  const title = titleOf(data);
  return (
    <li className="relative">
      <PosterCard item={data} type={saved.mediaType} slot={`mylist-${saved.mediaType}-${saved.id}`} width="w-full" sizes="(min-width: 1200px) 15vw, (min-width: 768px) 22vw, 45vw" />
      <button
        type="button"
        onClick={() => toggle(saved.mediaType, saved.id, title)}
        disabled={isBusy(saved.mediaType, saved.id)}
        className="mt-2 inline-flex items-center gap-1.5 t-micro text-paper-subtle hover:text-signal py-2 transition-colors"
        aria-label={`Remove ${title} from My List`}
      >
        <Icon name="close" size={14} /> Remove
      </button>
    </li>
  );
}

function SignedOut() {
  return (
    <div className="wrap pb-6">
      <div className="strand-rule" />
      <div className="grid gap-8 md:grid-cols-2 pt-6">
        <p className="t-strand max-w-[18ch]">Log in to keep a list of what you want to watch.</p>
        <div>
          <p className="text-paper-muted max-w-[44ch]">
            Your list is saved to your account, so it follows you to any device. It's free, and there's a guest login if you'd rather not register.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/LoginPage?next=%2FMyList" className="btn btn-signal">
              Log in
            </Link>
            <Link to="/RegistrationPage" className="btn btn-ghost">
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyList() {
  const { data, loading } = useTmdb<Paged<MediaItem>>("/trending/all/week");
  return (
    <div className="flex flex-col gap-16">
      <div className="wrap">
        <div className="strand-rule" />
        <div className="grid gap-6 md:grid-cols-2 pt-6">
          <p className="t-strand max-w-[18ch]">Nothing saved yet.</p>
          <p className="text-paper-muted max-w-[44ch]">
            Open any film or series and choose <span className="text-paper">Save to My List</span>. Here's what everyone else is looking at this week.
          </p>
        </div>
      </div>
      <Strand title="Trending this week" items={data?.results.filter((r) => r.media_type !== "person")} type="movie" slot="mylist-trending" loading={loading} />
    </div>
  );
}
