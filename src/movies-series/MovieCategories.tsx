import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

type movieType = {
  poster_path: string;
  title: string;
};

type informationType = {
  url: string;
  categories: string[];
  titles: string[];
};

type propTypes = {
  information: informationType;
};

const MovieCategories = (props: propTypes) => {
  const [categoryData, setCategoryData] = useState<{
    now_playing: { data: movieType[]; loading: boolean; error: any };
    popular: { data: movieType[]; loading: boolean; error: any };
    top_rated: { data: movieType[]; loading: boolean; error: any };
    upcoming: { data: movieType[]; loading: boolean; error: any };
  }>({
    now_playing: { data: [], loading: false, error: null },
    popular: { data: [], loading: false, error: null },
    top_rated: { data: [], loading: false, error: null },
    upcoming: { data: [], loading: false, error: null },
  });

  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const fetchData = async (category: string) => {
    const apiKey =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGEwY2RkZGUyM2I5NzJjM2U2MzMwMjIyMTQ0M2VjMSIsIm5iZiI6MTY5OTkwOTMyOS4yMzQsInN1YiI6IjY1NTI4ZWQxZDRmZTA0MDBhYzM0ZTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xrsUAKPhkB21DPZwhnIP0RpRQpR8iRHTgzbCL_2jWaE";

    const options = {
      method: "GET",
      url: `${props.information.url}${category}`,
      params: { language: "en-US", page: "1" },
      headers: {
        accept: "application/json",
        Authorization: apiKey,
      },
    };

    setCategoryData((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], loading: true },
    }));

    try {
      const response = await axios.request(options);

      setCategoryData((prev: any) => ({
        ...prev,
        [category]: { ...prev[category], data: response.data.results },
      }));
    } catch (err) {
      setCategoryData((prev: any) => ({
        ...prev,
        [category]: { ...prev[category], error: err },
      }));

      if (err !== null) {
        console.log(`error for ${category}`, err);
      }
    } finally {
      setCategoryData((prev: any) => ({
        ...prev,
        [category]: { ...prev[category], loading: false },
      }));
    }
  };

  useEffect(() => {
    Promise.all([
      fetchData(props.information.categories[0]),
      fetchData(props.information.categories[1]),
      fetchData(props.information.categories[2]),
      fetchData(props.information.categories[3]),
    ]);
  }, []);

  return (
    <div className="movieCategories">
      <div className=" category">
        <h3 className="categoryGroupHeading">{props.information.titles[0]}</h3>

        {categoryData.now_playing.loading && (
          <div className=" movieSpinnerContainer">
            <CircularProgress color="inherit" />
          </div>
        )}

        {!categoryData.now_playing.loading && (
          <div className="categoryGroup">
            {categoryData.now_playing.data?.map((element, index) => (
              <img
                src={tmdbBaseURL + element.poster_path}
                alt={element.title}
                key={index}
                loading="lazy"
                className="movieThumbnail"
              />
            ))}
          </div>
        )}
      </div>

      <div className=" category">
        <h3 className="categoryGroupHeading">{props.information.titles[1]}</h3>

        {categoryData.popular.loading && (
          <div className=" movieSpinnerContainer">
            <CircularProgress color="inherit" />
          </div>
        )}

        {!categoryData.popular.loading && (
          <div className="categoryGroup">
            {categoryData.popular.data?.map((element, index) => (
              <img
                src={tmdbBaseURL + element.poster_path}
                alt={element.title}
                key={index}
                loading="lazy"
                className="movieThumbnail"
              />
            ))}
          </div>
        )}
      </div>

      <div className=" category">
        <h3 className="categoryGroupHeading">{props.information.titles[2]}</h3>
        {categoryData.top_rated.loading && (
          <div className=" movieSpinnerContainer">
            <CircularProgress color="inherit" />
          </div>
        )}

        {!categoryData.top_rated.loading && (
          <div className="categoryGroup">
            {categoryData.top_rated.data?.map((element, index) => (
              <img
                src={tmdbBaseURL + element.poster_path}
                alt={element.title}
                key={index}
                loading="lazy"
                className="movieThumbnail"
              />
            ))}
          </div>
        )}
      </div>

      <div className=" category">
        <h3 className="categoryGroupHeading">{props.information.titles[3]}</h3>
        {categoryData.upcoming.loading && (
          <div className=" movieSpinnerContainer">
            <CircularProgress color="inherit" />
          </div>
        )}

        {!categoryData.upcoming.loading && (
          <div className="categoryGroup">
            {categoryData.upcoming.data?.map((element, index) => (
              <img
                src={tmdbBaseURL + element.poster_path}
                alt={element.title}
                key={index}
                loading="lazy"
                className="movieThumbnail"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCategories;
