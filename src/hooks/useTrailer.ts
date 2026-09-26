import { useEffect, useState } from "react";
import { pickTrailer, Video } from "../lib/tmdb";

type Found = { key: string; name?: string };

// YouTube search costs quota, so each title is looked up at most once per visit
const searched = new Map<string, Found | null>();

/**
 * TMDB's official trailer when it has one. Some titles (older series especially) have
 * no videos on TMDB at all; only then fall back to a YouTube search for the title.
 */
export function useTrailer(videos: Video[] | undefined, query: string | undefined) {
  const official = pickTrailer(videos);
  const needsSearch = !!videos && !official && !!query;
  const [found, setFound] = useState<Found | null | undefined>(() => (query ? searched.get(query) : undefined));

  useEffect(() => {
    if (!needsSearch || !query || searched.has(query)) {
      if (query && searched.has(query)) setFound(searched.get(query));
      return;
    }
    const key = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!key) return;
    let live = true;
    const params = new URLSearchParams({ part: "snippet", q: `${query} official trailer`, type: "video", maxResults: "1", key });
    fetch(`https://www.googleapis.com/youtube/v3/search?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const item = d.items?.[0];
        const result = item ? { key: item.id.videoId as string, name: item.snippet?.title as string | undefined } : null;
        searched.set(query, result);
        if (live) setFound(result);
      })
      .catch(() => live && setFound(null));
    return () => {
      live = false;
    };
  }, [needsSearch, query]);

  if (official) return { key: official.key, name: official.name };
  return needsSearch ? found ?? undefined : undefined;
}
