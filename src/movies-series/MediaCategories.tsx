import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

type movieType = {
  poster_path: string;
  title: string;
  name: string;
  id: number;
};

type categoryDataType = {
  data: movieType[];
  loading: boolean;
  error: string | null;
};

type informationType = {
  type: string;
  url: string;
  categories: string[];
  titles: string[];
};

type propTypes = {
  information: informationType;
};

const MediaCategories = (props: propTypes) => {
  const [categoryData, setCategoryData] = useState<
    Record<string, categoryDataType>
  >(() => {
    const initialState: Record<string, categoryDataType> = {};
    props.information.categories.forEach((category) => {
      initialState[category] = { data: [], loading: false, error: null };
    });
    return initialState;
  });

  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const fetchData = async (category: string) => {
    const apiKey = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;

    const options = {
      method: "GET",
      url: `${props.information.url}${category}`,
      params: { language: "en-US", page: "1" },
      headers: {
        accept: "application/json",
        Authorization: apiKey,
      },
    };

    setCategoryData((prev) => ({
      ...prev,
      [category]: { ...prev[category], loading: true, error: null },
    }));

    try {
      const response = await axios.request(options);

      setCategoryData((prev) => ({
        ...prev,
        [category]: { ...prev[category], data: response.data.results },
      }));
    } catch (err) {
      setCategoryData((prev) => ({
        ...prev,
        [category]: { ...prev[category], error: "Failed to load" },
      }));
    } finally {
      setCategoryData((prev) => ({
        ...prev,
        [category]: { ...prev[category], loading: false },
      }));
    }
  };

  useEffect(() => {
    props.information.categories.forEach((element) => {
      fetchData(element);
    });
  }, []);

  return (
    <div className="movieCategories">
      {props.information.categories.map((category, idx) => (
        <div key={category} className="category">
          <h2 className="categoryGroupHeading">
            {props.information.titles[idx]}
          </h2>

          {categoryData[category]?.loading && (
            <div className="movieSpinnerContainer">
              <CircularProgress aria-label="Loading" color="inherit" />
            </div>
          )}

          {categoryData[category]?.error && (
            <div className="flex items-center gap-3 h-40 text-fg-muted text-sm">
              <span>{categoryData[category].error}</span>
              <button
                onClick={() => fetchData(category)}
                className="text-purple-400 hover:text-purple-300 underline text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {!categoryData[category]?.loading && !categoryData[category]?.error && (
            <div className="categoryGroup">
              {categoryData[category]?.data?.map((element) => (
                <Link
                  key={element.id}
                  to={`/Details/${props.information.type}/${element.id}`}
                  className="movieCard"
                  aria-label={`View ${element.title || element.name}`}
                >
                  <img
                    src={tmdbBaseURL + element.poster_path}
                    alt={element.title || element.name}
                    loading="lazy"
                    className="movieThumbnail"
                  />
                  <div className="movieCardOverlay">
                    <p className="font-semibold text-sm leading-tight">
                      {element.title || element.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaCategories;
