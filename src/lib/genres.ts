import type { MediaType } from "./tmdb";

// TMDB's genre lists are stable; bundling them saves a request on every page
export const MOVIE_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  37: "Western",
  10768: "War & Politics",
  10766: "Soap",
};

export const genreMap = (type: MediaType) => (type === "tv" ? TV_GENRES : MOVIE_GENRES);

export const genreName = (id: number) => MOVIE_GENRES[id] ?? TV_GENRES[id];

export const genreList = (type: MediaType) =>
  Object.entries(genreMap(type))
    .map(([id, name]) => ({ id: Number(id), name }))
    .sort((a, b) => a.name.localeCompare(b.name));
