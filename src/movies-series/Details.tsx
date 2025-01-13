import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

type mediaDetails = {
  poster_path: string;
  title: string;
  id: number;
  genres: [];
  origin_country: string;
  original_language: string;
  overview: string;
  status: string;
};

const Details = () => {
  const [mediaDetails, setMediaDetails] = useState<mediaDetails>({
    poster_path: "",
    title: "",
    id: 0,
    genres: [],
    origin_country: "",
    original_language: "",
    overview: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const history = useHistory();

  const fetchDetails = async () => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/movie/839033",
      params: { language: "en-US" },
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGEwY2RkZGUyM2I5NzJjM2U2MzMwMjIyMTQ0M2VjMSIsIm5iZiI6MTY5OTkwOTMyOS4yMzQsInN1YiI6IjY1NTI4ZWQxZDRmZTA0MDBhYzM0ZTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xrsUAKPhkB21DPZwhnIP0RpRQpR8iRHTgzbCL_2jWaE",
      },
    };

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
      });
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    console.log(mediaDetails);
  }, []);

  useEffect(() => {
    console.log(mediaDetails);
  }, [mediaDetails]);

  return (
    <div className=" min-h-screen">
      <p onClick={() => history.goBack()}>Back</p>

      <h1>title</h1>

      <div>
        <span>genre</span>
        <span>genre</span>
        <span>genre</span>
      </div>

      <div>
        <h2>ABOUT</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est ad
          voluptatum esse. Commodi est quos voluptatum veniam, adipisci impedit
          quas mollitia quae facere! Totam vero, iste magni harum eaque debitis.
        </p>

        <div>
          <span>runtime</span>
          <span>country of origin</span>
          <span>language</span>
        </div>
      </div>
    </div>
  );
};

export default Details;
