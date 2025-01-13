import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

import backArrow from "../assets/previous.svg";
import { RootState } from "../redux/store";

type mediaDetails = {
  poster_path: string;
  title: string;
  id: number;
  genres: [];
  origin_country: string;
  original_language: string;
  overview: string;
  status: string;
  runtime: number;
};

const Details = () => {
  const movieId = useSelector(
    (state: RootState) => state.mediaIDSetter.mediaID
  );
  const mediaType = useSelector(
    (state: RootState) => state.mediaTypeSetter.mediaType
  );

  const [mediaDetails, setMediaDetails] = useState<mediaDetails>({
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

      setMediaDetails({
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
    console.log(mediaDetails);
  }, [mediaDetails]);

  return (
    <div className=" min-h-screen px-5 md:px-10 py-5 md:py-10 flex flex-col justify-center relative">
      {isLoading ? (
        <CircularProgress color="inherit" size={"1.2rem"} />
      ) : (
        <div>
          <img
            src={backArrow}
            alt="back arrow"
            onClick={() => history.goBack()}
            className=" absolute top-5 cursor-pointer"
          />

          <div>
            <h1 className=" text-3xl font-bold">{mediaDetails.title}</h1>
            <span>{mediaDetails.status}</span>
          </div>

          <div className=" mt-5">
            <div className=" flex flex-row items-center gap-3 text-sm">
              {mediaDetails.genres.map((element, index) => (
                <span key={index}>{element.name}</span>
              ))}
            </div>
          </div>

          <div>
            <p>{mediaDetails.overview}</p>

            <div className=" flex flex-row items-center gap-3 mt-5">
              <span>{mediaDetails.origin_country}</span>
              <span>{mediaDetails.original_language}</span>
              <span>{mediaDetails.runtime} minutes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
