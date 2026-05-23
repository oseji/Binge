import axios from "axios";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setmediaID } from "../redux/mediaID";
import { setmediaType } from "../redux/mediaType";
import { CircularProgress } from "@mui/material";

import backArrow from "../assets/previous.svg";

type MediaItem = {
  id: number;
  mediaType: "movie" | "tv";
};

type detailedMediaItem = {
  id: number;
  mediaType: "movie" | "tv";
  name: string;
  title: string;
  overview: string;
  poster_path: string;
};

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const MyList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");
  const [likedMedia, setLikedMedia] = useState<MediaItem[]>([]);
  const [detailedMedia, setDetailedMedia] = useState<detailedMediaItem[]>([]);
  const tmdbBasePosterURL = "https://image.tmdb.org/t/p/w500/";

  const fetchLikedMedia = async () => {
    setIsLoading(true);
    setFetchError("");
    const user = auth.currentUser;

    try {
      if (user) {
        const likedContentRef = collection(db, `users/${user.email}/LikedContent`);
        const querySnapshot = await getDocs(likedContentRef);
        const likedContent = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: data.id, mediaType: data.mediaType };
        });
        setLikedMedia(likedContent);
      }
    } catch (err) {
      setFetchError("Failed to load your list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedia = async ({
    id,
    mediaType,
  }: {
    id: number;
    mediaType: "movie" | "tv" | "person";
  }) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";

    const response = await axios.get(`${BASE_URL}/${mediaType}/${id}`, {
      params: { language: "en-US" },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return { ...response.data, mediaType };
  };

  const fetchAllMedia = () => {
    const promises = likedMedia.map((item) =>
      fetchMedia({ id: item.id, mediaType: item.mediaType })
    );
    return Promise.all(promises);
  };

  const navigateToDetails = (media: detailedMediaItem) => {
    dispatch(setmediaID(media.id));
    dispatch(setmediaType(media.mediaType));
    history.push("/Details");
  };

  useEffect(() => {
    fetchLikedMedia();
  }, []);

  useEffect(() => {
    if (likedMedia.length > 0) {
      fetchAllMedia()
        .then((mediaArray) => {
          setDetailedMedia(mediaArray);
        })
        .catch(() => {
          setFetchError("Failed to load media details. Please try again.");
        });
    }
  }, [likedMedia]);

  return (
    <div className="myList">
      <div className="flex flex-row items-center gap-4 mb-8">
        <Link to={"/"} aria-label="Go back home">
          <img src={backArrow} alt="back arrow" className="opacity-70 hover:opacity-100 transition-opacity" />
        </Link>
        <h1 className="text-3xl font-bold capitalize">My List</h1>
      </div>

      {isLoading ? (
        <div className="min-h-[60vh] flex justify-center items-center">
          <CircularProgress color="inherit" />
        </div>
      ) : fetchError ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">{fetchError}</p>
          <button
            onClick={fetchLikedMedia}
            className="px-6 py-2 bg-[#9B51E0] rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : detailedMedia.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detailedMedia.map((media) => (
            <div
              key={media.id}
              className="flex flex-row gap-4 cursor-pointer bg-gray-900 rounded-xl p-3 hover:bg-gray-800 transition-colors duration-200 group"
              onClick={() => navigateToDetails(media)}
              role="button"
              tabIndex={0}
              aria-label={`View ${media.mediaType === "movie" ? media.title : media.name}`}
              onKeyDown={(e) => e.key === "Enter" && navigateToDetails(media)}
            >
              <img
                src={tmdbBasePosterURL + media.poster_path}
                alt={media.mediaType === "movie" ? media.title : media.name}
                className="h-36 w-24 object-cover rounded-lg flex-shrink-0"
                loading="lazy"
              />

              <div className="flex flex-col gap-1.5 overflow-hidden">
                <h2 className="text-base font-bold leading-tight group-hover:text-purple-300 transition-colors">
                  {media.mediaType === "movie" ? media.title : media.name}
                </h2>
                <span className="text-xs text-purple-400 capitalize font-medium">
                  {media.mediaType === "tv" ? "Series" : media.mediaType}
                </span>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {media.overview || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5">
          <HeartIcon />
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-300">Your list is empty</p>
            <p className="text-gray-500 text-sm mt-2">
              Like movies and series to save them here.
            </p>
          </div>
          <Link
            to={"/"}
            className="px-6 py-2.5 bg-[#9B51E0] rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Browse Content
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyList;
