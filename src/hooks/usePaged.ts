import { useCallback, useEffect, useRef, useState } from "react";
import { MediaItem, Paged, peek, tmdb } from "../lib/tmdb";

type Params = Record<string, string | number | undefined>;

// How many pages each list had open, so Back restores the same length (and scroll)
const openPages = new Map<string, number>();

function fromCache(path: string, params: Params, pages: number) {
  const items: MediaItem[] = [];
  let total = 1;
  let totalResults = 0;
  for (let p = 1; p <= pages; p++) {
    const data = peek<Paged<MediaItem>>(path, { ...params, page: p });
    if (!data) return p === 1 ? null : { items, page: p - 1, total, totalResults };
    items.push(...data.results);
    total = data.total_pages;
    totalResults = data.total_results;
  }
  return { items, page: pages, total, totalResults };
}

const dedupe = (items: MediaItem[]) => {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = `${i.media_type ?? ""}${i.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

/** Paginated TMDB list with "load more", restored from cache on Back */
export function usePaged(path: string | null, params: Params = {}) {
  const key = `${path}${JSON.stringify(params)}`;
  const init = () => {
    const cached = path ? fromCache(path, params, openPages.get(key) ?? 1) : null;
    return {
      items: cached ? dedupe(cached.items) : [],
      page: cached?.page ?? 0,
      total: cached?.total ?? 1,
      totalResults: cached?.totalResults ?? 0,
      loading: !!path && !cached,
      error: false,
      fromCache: !!cached,
    };
  };

  const [state, setState] = useState(init);
  const [lastKey, setLastKey] = useState(key);
  const live = useRef(key);
  live.current = key;

  if (lastKey !== key) {
    setLastKey(key);
    setState(init());
  }

  const load = useCallback(
    (page: number) => {
      if (!path) return;
      const requestKey = key;
      setState((s) => ({ ...s, loading: true, error: false }));
      tmdb<Paged<MediaItem>>(path, { ...params, page })
        .then((data) => {
          if (live.current !== requestKey) return;
          openPages.set(requestKey, page);
          setState((s) => ({
            items: dedupe(page === 1 ? data.results : [...s.items, ...data.results]),
            page,
            total: Math.min(data.total_pages, 500),
            totalResults: data.total_results,
            loading: false,
            error: false,
            fromCache: s.fromCache && page > 1,
          }));
        })
        .catch(() => live.current === requestKey && setState((s) => ({ ...s, loading: false, error: true })));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  useEffect(() => {
    if (path && state.page === 0) load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return {
    ...state,
    hasMore: state.page < state.total,
    loadMore: () => load(state.page + 1),
    retry: () => load(Math.max(1, state.page + (state.items.length ? 1 : 0))),
  };
}
