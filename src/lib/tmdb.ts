const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export type MediaItem = {
  id: number;
  media_type?: MediaType | "person";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  profile_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
  known_for_department?: string;
  known_for?: MediaItem[];
  character?: string;
  job?: string;
  department?: string;
  credit_id?: string;
};

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type Genre = { id: number; name: string };

export type Video = { key: string; site: string; type: string; official: boolean; name: string };

export type CastMember = {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  roles?: { character: string; episode_count: number }[];
  total_episode_count?: number;
};

export type CrewMember = { id: number; name: string; job?: string; jobs?: { job: string }[]; department: string };

export type Provider = { provider_id: number; provider_name: string; logo_path: string; display_priority: number };

export type ProviderRegion = {
  link: string;
  flatrate?: Provider[];
  free?: Provider[];
  ads?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

type Common = {
  id: number;
  overview: string;
  tagline?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
  original_language: string;
  origin_country?: string[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { english_name: string; iso_639_1: string }[];
  status: string;
  vote_average: number;
  vote_count: number;
  videos?: { results: Video[] };
  recommendations?: Paged<MediaItem>;
  similar?: Paged<MediaItem>;
  "watch/providers"?: { results: Record<string, ProviderRegion> };
};

export type MovieDetails = Common & {
  title: string;
  original_title: string;
  release_date: string;
  runtime: number | null;
  budget: number;
  revenue: number;
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  release_dates?: { results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[] };
};

export type Season = { id: number; season_number: number; name: string; episode_count: number; air_date: string | null; poster_path: string | null };

export type TvDetails = Common & {
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  in_production: boolean;
  created_by: { id: number; name: string }[];
  networks: { id: number; name: string; logo_path: string | null }[];
  seasons: Season[];
  next_episode_to_air?: { air_date: string; episode_number: number; season_number: number } | null;
  aggregate_credits?: { cast: CastMember[]; crew: CrewMember[] };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
};

export type PersonDetails = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  combined_credits?: { cast: MediaItem[]; crew: MediaItem[] };
};

type Params = Record<string, string | number | undefined>;

// Resolved responses, keyed by URL. Lets a page render synchronously from cache,
// which is what keeps back-navigation and the shared-element transition seamless.
const resolved = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function keyFor(path: string, params: Params = {}) {
  const search = new URLSearchParams();
  Object.keys(params)
    .sort()
    .forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== "") search.set(k, String(v));
    });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

const withDefaults = (params?: Params): Params => ({ language: "en-US", ...params });

/** Synchronous cache read; undefined until the request has resolved once */
export function peek<T>(path: string, params?: Params): T | undefined {
  return resolved.get(keyFor(path, withDefaults(params))) as T | undefined;
}

export function tmdb<T>(path: string, params?: Params): Promise<T> {
  const key = keyFor(path, withDefaults(params));
  if (resolved.has(key)) return Promise.resolve(resolved.get(key) as T);
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  const request = fetch(`${API}${key}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      return res.json() as Promise<T>;
    })
    .then((data) => {
      resolved.set(key, data);
      return data;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, request);
  return request;
}

// ─── Endpoints used in more than one place ───

export const detailsPath = (type: MediaType | "person", id: number | string) => `/${type}/${id}`;

export const detailsParams = (type: MediaType | "person"): Params =>
  type === "movie"
    ? { append_to_response: "videos,credits,recommendations,similar,release_dates,watch/providers", include_video_language: "en,null" }
    : type === "tv"
    ? { append_to_response: "videos,aggregate_credits,recommendations,similar,content_ratings,watch/providers", include_video_language: "en,null" }
    : { append_to_response: "combined_credits" };

/** Warm the cache for a title page on hover/focus intent, so the click lands on a rendered page */
export function prefetchDetails(type: MediaType | "person", id: number) {
  tmdb(detailsPath(type, id), detailsParams(type)).catch(() => {});
}

// ─── Images ───

type PosterSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";
type BackdropSize = "w300" | "w780" | "w1280" | "original";
type ProfileSize = "w45" | "w185" | "h632" | "original";

export const poster = (path: string | null | undefined, size: PosterSize = "w342") =>
  path ? `${IMG}/${size}${path}` : undefined;

export const posterSrcSet = (path: string | null | undefined) =>
  path ? `${IMG}/w185${path} 185w, ${IMG}/w342${path} 342w, ${IMG}/w500${path} 500w` : undefined;

export const backdrop = (path: string | null | undefined, size: BackdropSize = "w1280") =>
  path ? `${IMG}/${size}${path}` : undefined;

export const backdropSrcSet = (path: string | null | undefined) =>
  path ? `${IMG}/w780${path} 780w, ${IMG}/w1280${path} 1280w` : undefined;

export const profile = (path: string | null | undefined, size: ProfileSize = "w185") =>
  path ? `${IMG}/${size}${path}` : undefined;

export const logo = (path: string | null | undefined) => (path ? `${IMG}/w92${path}` : undefined);

// ─── Helpers ───

export const titleOf = (m: { title?: string; name?: string }) => m.title ?? m.name ?? "Untitled";

export const yearOf = (m: { release_date?: string; first_air_date?: string }) =>
  (m.release_date || m.first_air_date || "").slice(0, 4) || undefined;

export const typeOf = (m: MediaItem, fallback: MediaType): MediaType | "person" =>
  (m.media_type as MediaType | "person" | undefined) ?? fallback;

/** Viewer's region for watch providers: first language tag with a region, else US */
export function detectRegion(): string {
  const tags = [...(navigator.languages ?? []), navigator.language, Intl.DateTimeFormat().resolvedOptions().locale];
  for (const tag of tags) {
    const match = /[-_]([A-Z]{2})\b/.exec(tag ?? "");
    if (match) return match[1];
  }
  return "US";
}

/** One logo per service: ad-supported tiers ("Netflix Standard with Ads") fold into their base */
export function uniqueProviders(list: Provider[]) {
  const base = (name: string) => name.replace(/\s*(standard\s+)?with ads$/i, "").trim();
  const seen = new Set<string>();
  return [...list]
    .sort((a, b) => a.display_priority - b.display_priority)
    .filter((p) => {
      const key = base(p.provider_name).toLowerCase();
      if (seen.has(key) || seen.has(String(p.provider_id))) return false;
      seen.add(key);
      seen.add(String(p.provider_id));
      return true;
    });
}

/** Best official YouTube trailer, falling back to any trailer or teaser */
export function pickTrailer(videos: Video[] = []): Video | undefined {
  const yt = videos.filter((v) => v.site === "YouTube");
  const rank = (v: Video) => (v.type === "Trailer" ? 0 : v.type === "Teaser" ? 1 : 2) * 2 + (v.official ? 0 : 1);
  return yt.filter((v) => v.type === "Trailer" || v.type === "Teaser").sort((a, b) => rank(a) - rank(b))[0];
}
