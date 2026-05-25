import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { RootState } from "../redux/store";
import { db, auth } from "../firebase-config/firebase";
import {
  addDoc,
  deleteDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";

import backArrow from "../assets/previous.svg";

type movieDetails = {
  poster_path: string;
  backdrop_path: string;
  title: string;
  id: number;
  genres: { name: string }[];
  origin_country: string[];
  original_language: string;
  overview: string;
  status: string;
  runtime: number;
};

type seriesDetails = {
  poster_path: string;
  backdrop_path: string;
  name: string;
  id: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  status: string;
  episode_run_time: number[];
};

type personDetails = {
  name: string;
  profile_path: string;
  known_for_department: string;
  place_of_birth: string;
  biography: string;
  birthday: string;
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Details = () => {
  const movieId = useSelector((state: RootState) => state.mediaIDSetter.mediaID);
  const mediaType = useSelector((state: RootState) => state.mediaTypeSetter.mediaType);

  const tmdbPosterURL = "https://image.tmdb.org/t/p/w500/";
  const tmdbBackdropURL = "https://image.tmdb.org/t/p/original/";

  const [movieDetails, setMovieDetails] = useState<movieDetails>({
    poster_path: "", backdrop_path: "", title: "", id: 0,
    genres: [], origin_country: [], original_language: "",
    overview: "", status: "", runtime: 0,
  });

  const [seriesDetails, setSeriesDetails] = useState<seriesDetails>({
    poster_path: "", backdrop_path: "", name: "", id: 0,
    number_of_seasons: 0, origin_country: [], original_language: "",
    overview: "", status: "", episode_run_time: [],
  });

  const [personDetails, setPersonDetails] = useState<personDetails>({
    name: "", profile_path: "", known_for_department: "",
    place_of_birth: "", biography: "", birthday: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [liked, setLiked] = useState(false);
  const [ifLikedLoading, setIfLikedLoading] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerID, setTrailerID] = useState("");

  const history = useHistory();

  const fetchDetails = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}`,
        {
          params: { language: "en-US" },
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        }
      );

      if (mediaType === "movie") {
        setMovieDetails({
          poster_path: response.data.poster_path,
          backdrop_path: response.data.backdrop_path,
          title: response.data.title,
          id: response.data.id,
          genres: response.data.genres,
          origin_country: response.data.origin_country,
          original_language: response.data.original_language,
          overview: response.data.overview,
          status: response.data.status,
          runtime: response.data.runtime,
        });
      } else if (mediaType === "tv") {
        setSeriesDetails({
          poster_path: response.data.poster_path,
          backdrop_path: response.data.backdrop_path,
          name: response.data.name,
          id: response.data.id,
          number_of_seasons: response.data.number_of_seasons,
          origin_country: response.data.origin_country,
          original_language: response.data.original_language,
          overview: response.data.overview,
          status: response.data.status,
          episode_run_time: response.data?.episode_run_time,
        });
      } else if (mediaType === "person") {
        setPersonDetails({
          name: response.data.name,
          profile_path: response.data.profile_path,
          known_for_department: response.data.known_for_department,
          biography: response.data.biography,
          place_of_birth: response.data.place_of_birth,
          birthday: response.data.birthday,
        });
      }
    } catch {
      setFetchError("Failed to load details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryName = (code: string) => {
    if (!code) return null;
    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    } catch {
      return code;
    }
  };

  const getLanguageName = (code: string) => {
    if (!code) return null;
    try {
      return new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    } catch {
      return code;
    }
  };

  const fetchYoutubeTrailer = async (title: string) => {
    setTrailerLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(title)}+official+trailer&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      setTrailerID(response.data.items[0]?.id?.videoId ?? "");
    } catch {
      toast.error("Failed to load trailer");
    } finally {
      setTrailerLoading(false);
    }
  };

  const fetchIfLiked = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const q = query(
        collection(db, `users/${user.email}/LikedContent`),
        where("id", "==", movieId)
      );
      const snap = await getDocs(q);
      setLiked(!snap.empty);
    } catch { /* silent */ }
  };

  const mediaTitle =
    mediaType === "movie" ? movieDetails.title : seriesDetails.name;

  const addToLiked = async (id: number) => {
    const user = auth.currentUser;
    if (!user) return;
    setIfLikedLoading(true);
    try {
      await addDoc(collection(db, `users/${user.email}/LikedContent`), {
        id, liked: true, mediaType,
      });
      toast.success(`Added ${mediaTitle} to your list`);
    } catch {
      toast.error("Failed to add to list");
    } finally {
      setIfLikedLoading(false);
    }
  };

  const removeFromLiked = async (id: number) => {
    const user = auth.currentUser;
    if (!user) return;
    setIfLikedLoading(true);
    try {
      const q = query(
        collection(db, `users/${user.email}/LikedContent`),
        where("id", "==", id)
      );
      const snap = await getDocs(q);
      snap.forEach(async (d) => await deleteDoc(d.ref));
      setLiked(false);
      toast.success(`Removed ${mediaTitle} from your list`);
    } catch {
      toast.error("Failed to remove from list");
    } finally {
      setIfLikedLoading(false);
    }
  };

  const toggleLike = (id: number) => {
    if (liked) {
      removeFromLiked(id);
      setLiked(false);
    } else {
      addToLiked(id);
      setLiked(true);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchIfLiked();
  }, []);

  useEffect(() => {
    const title = movieDetails.title || seriesDetails.name;
    if (title?.trim()) fetchYoutubeTrailer(title);
  }, [movieDetails.title, seriesDetails.name]);

  const backdrop =
    mediaType === "movie"
      ? movieDetails.backdrop_path
      : mediaType === "tv"
      ? seriesDetails.backdrop_path
      : null;

  const LikeButton = ({ id }: { id: number }) => {
    if (!auth.currentUser) {
      return (
        <Link to={"/LoginPage"}>
          <button className="text-xs text-white/40 border border-white/15 px-3 py-1.5 rounded-full hover:border-purple-500/50 hover:text-purple-400 transition-all duration-200">
            Login to like
          </button>
        </Link>
      );
    }
    return (
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
          liked
            ? "border-red-500/60 text-red-400 bg-red-500/10 hover:bg-red-500/20"
            : "border-white/15 text-white/60 hover:border-red-400/50 hover:text-red-400 hover:bg-red-500/5"
        }`}
        onClick={() => toggleLike(id)}
        aria-label={liked ? "Remove from liked" : "Add to liked"}
      >
        {ifLikedLoading ? (
          <CircularProgress color="inherit" size="1rem" />
        ) : (
          <>
            <HeartIcon filled={liked} />
            <span>{liked ? "Liked" : "Like"}</span>
          </>
        )}
      </button>
    );
  };

  const TrailerSection = () => (
    <div className="w-full max-w-3xl mx-auto mt-16 mb-10">
      <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Official Trailer</p>
      <div className="rounded-2xl overflow-hidden aspect-video bg-[#0D0D18] border border-white/8 shadow-2xl shadow-black/60">
        {trailerLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <CircularProgress color="inherit" size="2.5rem" />
          </div>
        ) : trailerID ? (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerID}`}
            playing={false}
            controls
            width="100%"
            height="100%"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-2 text-white/20">
            <span className="text-4xl">▶</span>
            <span className="text-sm">Trailer unavailable</span>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090F]">
        <CircularProgress color="inherit" size="4rem" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090F] gap-4">
        <p className="text-white/40 text-lg">{fetchError}</p>
        <button
          onClick={() => { fetchDetails(); fetchIfLiked(); }}
          className="px-6 py-2.5 bg-[#9B51E0] rounded-xl hover:bg-purple-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090F]">
      {/* Cinematic backdrop */}
      {backdrop && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={tmdbBackdropURL + backdrop}
            alt=""
            className="w-full h-full object-cover object-top"
            style={{ filter: "blur(1px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#09090F]/80 to-[#09090F]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090F]/70 via-transparent to-[#09090F]/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-5 md:px-10 py-6 md:py-10 min-h-screen">
        {/* Back button */}
        <button onClick={() => history.goBack()} aria-label="Go back" className="detailsBackArrow">
          <img src={backArrow} alt="back" className="h-4 opacity-80" />
        </button>

        {mediaType === "movie" && (
          <>
            <TrailerSection />
            <div className="max-w-5xl mx-auto w-full">
              <div className="detailsPage">
                <img
                  src={tmdbPosterURL + movieDetails.poster_path}
                  alt={movieDetails.title}
                  className="detailsPageImg"
                />
                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                        {movieDetails.title}
                      </h1>
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/30 mt-1 block">{movieDetails.status}</span>
                    </div>
                    <LikeButton id={movieDetails.id} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres.map((g, i) => (
                      <span key={i} className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/30">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  <div className="h-px bg-white/6" />

                  <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    {movieDetails.overview}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35 font-medium">
                    {getCountryName(movieDetails.origin_country[0]) && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {getCountryName(movieDetails.origin_country[0])}
                      </span>
                    )}
                    {getLanguageName(movieDetails.original_language) && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {getLanguageName(movieDetails.original_language)}
                      </span>
                    )}
                    {movieDetails.runtime > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {movieDetails.runtime} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {mediaType === "tv" && (
          <>
            <TrailerSection />
            <div className="max-w-5xl mx-auto w-full">
              <div className="detailsPage">
                <img
                  src={tmdbPosterURL + seriesDetails.poster_path}
                  alt={seriesDetails.name}
                  className="detailsPageImg"
                />
                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                        {seriesDetails.name}
                      </h1>
                      <span className={`text-xs font-semibold uppercase tracking-wider mt-1 block ${seriesDetails.status === "Ended" ? "text-red-400/60" : "text-green-400/60"}`}>
                        {seriesDetails.status}
                      </span>
                    </div>
                    <LikeButton id={seriesDetails.id} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/8 text-white/60 border border-white/10">
                      {seriesDetails.number_of_seasons}{" "}
                      {seriesDetails.number_of_seasons === 1 ? "Season" : "Seasons"}
                    </span>
                  </div>

                  <div className="h-px bg-white/6" />

                  <p className="text-white/60 leading-relaxed text-sm md:text-base">
                    {seriesDetails.overview}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/35 font-medium">
                    {getCountryName(seriesDetails.origin_country[0]) && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {getCountryName(seriesDetails.origin_country[0])}
                      </span>
                    )}
                    {getLanguageName(seriesDetails.original_language) && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {getLanguageName(seriesDetails.original_language)}
                      </span>
                    )}
                    {seriesDetails.episode_run_time?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        {seriesDetails.episode_run_time[0]} min/ep
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {mediaType === "person" && (
          <div className="pt-20 max-w-5xl mx-auto w-full">
            <div className="detailsPage">
              <div className="flex-shrink-0 mx-auto" style={{ maxWidth: 240 }}>
                <img
                  src={tmdbPosterURL + personDetails.profile_path}
                  alt={personDetails.name}
                  className="detailsPageImg"
                  style={{ maxWidth: "100%" }}
                />
              </div>
              <div className="flex flex-col gap-5 flex-1">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    {personDetails.name}
                  </h1>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/30">
                    {personDetails.known_for_department}
                  </span>
                </div>

                <div className="h-px bg-white/6" />

                <div className="flex flex-wrap gap-4 text-xs text-white/40">
                  {personDetails.birthday && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white/25 font-semibold uppercase tracking-wider text-[10px]">Born</span>
                      <span className="text-white/60 font-medium">{personDetails.birthday}</span>
                    </div>
                  )}
                  {personDetails.place_of_birth && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white/25 font-semibold uppercase tracking-wider text-[10px]">Place of Birth</span>
                      <span className="text-white/60 font-medium">{personDetails.place_of_birth}</span>
                    </div>
                  )}
                </div>

                {personDetails.biography && (
                  <>
                    <div className="h-px bg-white/6" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Biography</p>
                      <p className="text-white/60 leading-relaxed text-sm md:text-base">
                        {personDetails.biography}
                      </p>
                    </div>
                  </>
                )}

                {!personDetails.biography && (
                  <p className="text-white/25 text-sm italic">No biography available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
