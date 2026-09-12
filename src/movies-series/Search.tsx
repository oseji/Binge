import axios from "axios";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { setSearchResults, setSearchTerm } from "../redux/searchStateSlice";

import { CircularProgress } from "@mui/material";

import Header from "../components/Header";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const Search = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const searchTerm = useSelector((state: RootState) => state.search.term);
  const searchResults = useSelector((state: RootState) => state.search.results);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");

  const dispatch = useDispatch();

  const searchForItem = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setFetchError("");
    setHasSearched(true);

    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/search/multi",
      params: {
        query: trimmed,
        include_adult: "false",
        language: "en-US",
        page: "1",
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };

    try {
      const response = await axios.request(options);
      dispatch(setSearchResults(response.data.results));
    } catch (err) {
      setFetchError("Search failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-canvas">
      <Header mainScreenRef={mainScreenRef} />

      <main id="main" className="flex-1 flex flex-col">
      <h1 className="sr-only">Search</h1>
      <div className="pt-32 px-5 md:px-10">
        <form
          className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            searchForItem();
          }}
        >
          <input
            type="text"
            placeholder="Search by Title, Genre, People"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full p-4 rounded-xl bg-white/5 border border-line-strong text-fg placeholder:text-fg-subtle outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-colors"
            id="searchBar"
            aria-label="Search for movies, series, or people"
          />
          <button
            type="submit"
            className="w-full md:w-auto rounded-xl px-8 py-4 bg-accent hover:bg-accent-deep transition-colors duration-200 font-semibold disabled:opacity-60"
            id="searchForMediaBtn"
            disabled={isLoading || !searchTerm.trim()}
          >
            Search
          </button>
        </form>
      </div>

      {/* results section */}
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <CircularProgress aria-label="Loading" color="inherit" />
          </div>
        ) : fetchError ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-fg-muted">{fetchError}</p>
            <button
              onClick={searchForItem}
              className="px-6 py-2 bg-accent rounded-lg hover:bg-accent-deep transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-5 md:p-10">
            <p className="text-fg-muted text-sm mb-6" aria-live="polite">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
              <span className="text-white font-medium">"{searchTerm}"</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {searchResults.map((element) => {
                const imagePath = element.profile_path || element.poster_path;
                const title = element.name || element.title;
                return (
                  <Link
                    key={element.id}
                    to={`/Details/${element.media_type}/${element.id}`}
                    className="movieCard group"
                    aria-label={`View details for ${title}`}
                  >
                    {imagePath ? (
                      <>
                        <img
                          src={tmdbBaseURL + imagePath}
                          alt={title}
                          className="w-full h-64 object-cover rounded-lg"
                          loading="lazy"
                        />
                        <div className="movieCardOverlay rounded-lg">
                          <p className="font-semibold text-sm leading-tight">{title}</p>
                          {element.media_type && (
                            <span className="text-xs text-fg-muted capitalize mt-0.5 block">
                              {element.media_type === "tv" ? "Series" : element.media_type}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-64 rounded-lg bg-surface-2 flex flex-col items-center justify-center gap-2 p-3">
                        <span className="text-fg-subtle text-xl">🎬</span>
                        <p className="text-fg-muted text-xs text-center leading-tight">{title}</p>
                      </div>
                    )}
                    <p className="text-center text-sm mt-2 text-fg-muted truncate">{title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <SearchIcon />
            <p className="text-lg font-semibold text-fg">No results found</p>
            <p className="text-fg-subtle text-sm text-center max-w-xs">
              We couldn't find anything for "{searchTerm}". Try a different title, genre, or person.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <SearchIcon />
            <p className="text-fg-muted text-sm">Search for a movie, series, or person to get started</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default Search;
