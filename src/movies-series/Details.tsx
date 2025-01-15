import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

import backArrow from "../assets/previous.svg";
import { RootState } from "../redux/store";

type movieDetails = {
  poster_path: string;
  title: string;
  id: number;
  genres: { name: string }[];
  origin_country: string;
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
  origin_country: string;
  original_language: string;
  overview: string;
  status: string;
  episode_run_time: number;
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
    origin_country: "",
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
    origin_country: "",
    original_language: "",
    overview: "",
    status: "",
    episode_run_time: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const history = useHistory();

  const fetchDetails = async () => {
    const apiKey =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGEwY2RkZGUyM2I5NzJjM2U2MzMwMjIyMTQ0M2VjMSIsIm5iZiI6MTY5OTkwOTMyOS4yMzQsInN1YiI6IjY1NTI4ZWQxZDRmZTA0MDBhYzM0ZTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xrsUAKPhkB21DPZwhnIP0RpRQpR8iRHTgzbCL_2jWaE";
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/${mediaType}/${movieId}`,
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization: apiKey,
      },
    };

    console.log(options.url);

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
          episode_run_time: response.data.episode_run_time,
        });
      }

      console.log(response.data);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    console.log(movieDetails);
  }, [movieDetails]);

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

              <div className=" detailsPage">
                <img
                  src={tmdbBaseURL + movieDetails.poster_path}
                  alt={movieDetails.title}
                  className=" detailsPageImg"
                />

                <div>
                  <div>
                    <h1 className=" text-3xl font-bold">
                      {movieDetails.title}
                    </h1>
                    <span className=" italic">{movieDetails.status}</span>
                  </div>

                  <div className=" mt-5">
                    <div className=" flex flex-row items-center gap-3 text-sm">
                      {movieDetails.genres.map((element, index) => (
                        <span key={index}>{element.name}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className=" my-5">{movieDetails.overview}</p>

                    <div className=" flex flex-row items-center gap-3 ">
                      <span>{movieDetails.origin_country}</span>
                      <span>{movieDetails.original_language}</span>
                      <span>{movieDetails.runtime} minutes</span>
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
                  src={tmdbBaseURL + seriesDetails.poster_path}
                  alt={seriesDetails.name}
                  className=" detailsPageImg"
                />

                <div>
                  <div>
                    <h1 className=" text-3xl font-bold">
                      {seriesDetails.name}
                    </h1>
                    <span className=" italic">{seriesDetails.status}</span>
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
                      <span>{seriesDetails.origin_country}</span>
                      <span>{seriesDetails.original_language}</span>
                      <span>{seriesDetails.episode_run_time} minutes</span>
                    </div>
                  </div>
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
