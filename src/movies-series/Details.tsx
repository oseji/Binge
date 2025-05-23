import React, { useEffect, useState } from "react";
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

import backArrow from "../assets/previous.svg";

type movieDetails = {
  poster_path: string;
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

const Details = () => {
  const movieId = useSelector(
    (state: RootState) => state.mediaIDSetter.mediaID
  );
  const mediaType = useSelector(
    (state: RootState) => state.mediaTypeSetter.mediaType
  );

  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const [movieDetails, setMovieDetails] = useState<movieDetails>({
    poster_path: "",
    title: "",
    id: 0,
    genres: [],
    origin_country: [],
    original_language: "",
    overview: "",
    status: "",
    runtime: 0,
  });

  const [seriesDetails, setSeriesDetails] = useState<seriesDetails>({
    poster_path: "",
    name: "",
    id: 0,
    number_of_seasons: 0,
    origin_country: [],
    original_language: "",
    overview: "",
    status: "",
    episode_run_time: [],
  });

  const [personDetails, setPersonDetails] = useState<personDetails>({
    name: "",
    profile_path: "",
    known_for_department: "",
    place_of_birth: "",
    biography: "",
    birthday: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [ifLikedLoading, setIfLikedLoading] = useState<boolean>(false);
  const [trailerLoading, setTrailerLoading] = useState<boolean>(false);
  const [trailerID, setTrailerID] = useState<string>("");

  const history = useHistory();

  const fetchDetails = async () => {
    const apiKey = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}`,
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: apiKey,
      },
    };

    setIsLoading(true);

    try {
      const response = await axios.request(options);

      if (mediaType === "movie") {
        setMovieDetails({
          poster_path: response.data.poster_path,
          title: response.data.title,
          id: response.data.id,
          genres: response.data.genres,
          origin_country: response.data.origin_country,
          original_language: response.data.original_language,
          overview: response.data.overview,
          status: response.data.status,
          runtime: response.data.runtime,
        });
      }

      if (mediaType === "tv") {
        setSeriesDetails({
          poster_path: response.data.poster_path,
          name: response.data.name,
          id: response.data.id,
          number_of_seasons: response.data.number_of_seasons,
          origin_country: response.data.origin_country,
          original_language: response.data.original_language,
          overview: response.data.overview,
          status: response.data.status,
          episode_run_time: response.data?.episode_run_time,
        });
      }

      if (mediaType === "person") {
        setPersonDetails({
          name: response.data.name,
          profile_path: response.data.profile_path,
          known_for_department: response.data.known_for_department,
          biography: response.data.biography,
          place_of_birth: response.data.place_of_birth,
          birthday: response.data.birthday,
        });
      }
    } catch (err) {
      if (err) {
        setError(err);
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryName = (countryCode: string) => {
    if (countryCode) {
      const name = new Intl.DisplayNames([countryCode], { type: "region" });

      return name.of(countryCode);
    } else {
      return "Unknown country";
    }
  };

  const getLanguageName = (languageCode: string) => {
    if (languageCode) {
      const language = new Intl.DisplayNames([languageCode], {
        type: "language",
      });

      return language.of(languageCode);
    } else {
      return "Unknown langage";
    }
  };

  const fetchYoutubeTrailer = async (title: string) => {
    setTrailerLoading(true);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title}+trailer&type=video&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );

      setTrailerID(response.data.items[0].id.videoId);
    } catch (err) {
      if (err) {
        console.log(err);
      }
    } finally {
      setTrailerLoading(false);
    }
  };

  const fetchIfLiked = async () => {
    setIfLikedLoading(true);
    const user = auth.currentUser;

    try {
      if (user) {
      }
      const likedContentRef = collection(
        db,
        `users/${user?.email}/LikedContent`
      );

      // Query for the media item by its ID
      const q = query(likedContentRef, where("id", "==", movieId));
      const querySnapshot = await getDocs(q);

      // If a document is found, mark the media as liked
      if (!querySnapshot.empty) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (err) {
      if (err) {
        console.log(err);
        setError(err);
      }
    } finally {
      setIfLikedLoading(false);
    }
  };

  const addToLiked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIfLikedLoading(true);
    const user = auth.currentUser;
    const clickedElement: number = Number(e.currentTarget.value);

    try {
      if (user) {
        await addDoc(collection(db, `users/${user.email}/LikedContent`), {
          id: clickedElement,
          liked: true,
          mediaType: mediaType,
        });

        console.log("Document successfully written!");
      }
    } catch (err) {
      if (err) {
        console.log(err);
        setError(err);
      }

      setError(err);
    } finally {
      setIfLikedLoading(false);
    }
  };

  const removeFromLiked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIfLikedLoading(true);
    const user = auth.currentUser;
    const clickedElement: number = Number(e.currentTarget.value);

    try {
      if (user) {
        const likedContentRef = collection(
          db,
          `users/${user.email}/LikedContent`
        );

        const q = query(likedContentRef, where("id", "==", clickedElement));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        setLiked(false);
        console.log("Document successfully deleted!");
      }
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setIfLikedLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchIfLiked();
    console.log(auth.currentUser);
  }, []);

  useEffect(() => {
    const title = movieDetails.title || seriesDetails.name;
    if (title?.trim()) {
      fetchYoutubeTrailer(title);
    }

    console.log(movieDetails.id);
    console.log(seriesDetails.id);
  }, [movieDetails.title, seriesDetails.name]);

  return (
    <div className=" min-h-[100dvh] px-5 py-5 md:px-10  md:py-10 flex flex-col justify-center relative">
      {isLoading ? (
        <CircularProgress
          color="inherit"
          size={"5rem"}
          className=" w-fit mx-auto"
        />
      ) : (
        <div>
          {mediaType === "movie" ? (
            <div>
              <img
                src={backArrow}
                alt="back arrow"
                onClick={() => history.goBack()}
                className=" detailsBackArrow"
              />

              <div className=" my-10 md:my-5 w-full flex flex-row justify-center">
                {!trailerLoading ? (
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailerID}`}
                    playing={false}
                    controls
                    width="100%"
                  />
                ) : (
                  <CircularProgress
                    color="inherit"
                    size={"5rem"}
                    className=" w-fit mx-auto"
                  />
                )}
              </div>

              <div className=" detailsPage">
                <img
                  src={tmdbBaseURL + movieDetails.poster_path}
                  alt={movieDetails.title}
                  className=" detailsPageImg"
                />

                <div>
                  <div>
                    <div className=" flex flex-row justify-between items-center">
                      <h1 className=" text-3xl font-bold">
                        {movieDetails.title}
                      </h1>

                      <button>
                        {auth.currentUser ? (
                          <span>
                            {ifLikedLoading ? (
                              <CircularProgress
                                color="inherit"
                                size={"1.5rem"}
                              />
                            ) : (
                              <button
                                className=" outline-0 transition ease-in-out duration-200 hover:scale-125"
                                value={movieDetails.id}
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (liked) {
                                    removeFromLiked(e);
                                    setLiked(!liked);
                                  }

                                  if (!liked) {
                                    addToLiked(e);
                                    setLiked(!liked);
                                  }
                                }}
                              >
                                {liked ? "Unlike" : "Like"}
                              </button>
                            )}
                          </span>
                        ) : (
                          <Link to={"/LoginPage"}>
                            <button title="You need to log in to add media to your liked list">
                              Login to like
                            </button>
                          </Link>
                        )}
                      </button>
                    </div>

                    <span className=" italic">{movieDetails.status}</span>
                  </div>

                  <div className=" mt-5">
                    <div className=" flex flex-row items-center gap-3 text-sm">
                      {movieDetails.genres.map((element, index) => (
                        <span
                          key={index}
                          className=" px-3 py-1.5 rounded-xl bg-purple-800"
                        >
                          {element.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className=" my-5">{movieDetails.overview}</p>

                    <div className=" flex flex-row items-center gap-3 ">
                      <span>
                        {getCountryName(movieDetails.origin_country[0])}
                      </span>
                      <span>
                        {getLanguageName(movieDetails.original_language)}
                      </span>
                      <span>{movieDetails.runtime} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : mediaType === "tv" ? (
            <div>
              <img
                src={backArrow}
                alt="back arrow"
                onClick={() => history.goBack()}
                className=" detailsBackArrow"
              />

              <div className=" my-10 md:my-5 w-full flex flex-row justify-center">
                {!trailerLoading ? (
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailerID}`}
                    playing={false}
                    controls
                    width="100%"
                  />
                ) : (
                  <CircularProgress
                    color="inherit"
                    size={"5rem"}
                    className=" w-fit mx-auto"
                  />
                )}
              </div>

              <div className=" detailsPage">
                <img
                  src={tmdbBaseURL + seriesDetails.poster_path}
                  alt={seriesDetails.name}
                  className=" detailsPageImg"
                />

                <div>
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      <h1 className=" text-3xl font-bold">
                        {seriesDetails.name}
                      </h1>

                      <span
                        className={` italic ${
                          seriesDetails.status === "Ended"
                            ? " text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {seriesDetails.status}
                      </span>
                    </div>

                    <button
                      className=" outline-0 transition ease-in-out duration-200 hover:scale-125"
                      value={seriesDetails.id}
                      onClick={(e) => {
                        e.preventDefault();

                        if (liked) {
                          removeFromLiked(e);
                          setLiked(!liked);
                        }

                        if (!liked) {
                          addToLiked(e);
                          setLiked(!liked);
                        }
                      }}
                    >
                      {ifLikedLoading ? (
                        <CircularProgress color="inherit" size={"1.5rem"} />
                      ) : (
                        <span>{liked ? "Unlike" : "Like"}</span>
                      )}
                    </button>
                  </div>

                  <div className=" mt-5 font-bold">
                    <span>{seriesDetails.number_of_seasons}</span>
                    <span>
                      {seriesDetails.number_of_seasons === 1
                        ? " season"
                        : " seasons"}
                    </span>
                  </div>

                  <div>
                    <p className=" my-5">{seriesDetails.overview}</p>

                    <div className=" flex flex-row items-center gap-3  font-bold">
                      <span>
                        {getCountryName(seriesDetails.origin_country[0])}
                      </span>

                      <span>
                        {getLanguageName(seriesDetails.original_language)}
                      </span>

                      <span>
                        {seriesDetails.episode_run_time?.length > 0
                          ? `${seriesDetails.episode_run_time[0]} minutes`
                          : "No runtime available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <img
                src={backArrow}
                alt="back arrow"
                onClick={() => history.goBack()}
                className=" detailsBackArrow"
              />

              <div className=" detailsPage">
                <img
                  src={tmdbBaseURL + personDetails.profile_path}
                  alt={personDetails.name}
                  className=" detailsPageImg"
                />

                <div className=" xl:w-[70%]">
                  <div>
                    <h1 className=" text-3xl font-bold">
                      {personDetails.name}
                    </h1>

                    <p>{personDetails.known_for_department}</p>
                  </div>

                  <div className=" my-5 flex flex-col md:flex-row md:items-center md:gap-3">
                    <div>
                      <span className=" font-bold capitalize">birthday:</span>
                      <span>
                        {" "}
                        {personDetails.birthday || "No data available"}
                      </span>
                    </div>

                    <div>
                      <span className=" font-bold capitalize">
                        place of birth:
                      </span>
                      <span>
                        {" "}
                        {personDetails.place_of_birth || "No data available"}
                      </span>
                    </div>
                  </div>

                  <p>{personDetails.biography || "No data available"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Details;
