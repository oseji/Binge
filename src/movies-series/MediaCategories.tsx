import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setmediaID } from "../redux/mediaID";
import { CircularProgress } from "@mui/material";
import { setmediaType } from "../redux/mediaType";

type movieType = {
  poster_path: string;
  title: string;
  id: number;
};

type categoryDataType = {
  data: movieType[];
  loading: boolean;
  error: any;
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
  const history = useHistory();
  const dispatch = useDispatch();

  const [categoryData, setCategoryData] = useState<
    Record<string, categoryDataType>
  >(() => {
    const initialState: Record<string, categoryDataType> = {}; // Only initialize the categories we received in props

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
    }
  };

  useEffect(() => {
    props.information.categories.forEach((element) => {
      fetchData(element);
    });
  }, []);

  useEffect(() => {
    console.log(categoryData);
  });

  return (
    <div className="movieCategories">
      {props.information.categories.map((category, idx) => (
        <div key={category} className="category">
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
                  key={index}
                  src={tmdbBaseURL + element.poster_path}
                  alt={element.title}
                  data-id={element.id}
                  loading="lazy"
                  className="movieThumbnail"
                  onClick={() => {
                    console.log(element.title, element.id);
                    dispatch(setmediaID(element.id));
                    dispatch(setmediaType(props.information.type));

                    history.push("/Details");
                  }}
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
