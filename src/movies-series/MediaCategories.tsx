import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

type movieType = {
  poster_path: string;
  title: string;
};

type categoryDataType = {
  data: movieType[];
  loading: boolean;
  error: any;
};

type informationType = {
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
    // Only initialize the categories we received in props
    props.information.categories.forEach((category) => {
      initialState[category] = { data: [], loading: false, error: null };
    });
    return initialState;
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

      console.log("Category Data:", categoryData);
      console.log("Categories from props:", props.information.categories);
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
        <div key={idx} className="category">
          <h3 className="categoryGroupHeading">
            {props.information.titles[idx]}
          </h3>

          {categoryData[category]?.loading && (
            <div className="movieSpinnerContainer">
              <CircularProgress color="inherit" />
            </div>
          )}

          {!categoryData[category]?.loading && (
            <div className="categoryGroup">
              {categoryData[category]?.data?.map((element, index) => (
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
      ))}
    </div>
  );
};

export default MediaCategories;
