import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { setmediaID } from "../redux/mediaID";
import { setmediaType } from "../redux/mediaType";
import { setSearchResults } from "../redux/searchStateSlice";
import { setSearchTerm } from "../redux/searchStateSlice";

import { CircularProgress } from "@mui/material";

import Header from "../signed-in-landing-page/SignedInHeader";

const Search = () => {
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const searchTerm = useSelector((state: RootState) => state.search.term);
  const searchResults = useSelector((state: RootState) => state.search.results);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const history = useHistory();
  const dispatch = useDispatch();

  const searchForItem = async () => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/search/multi",
      params: {
        query: searchTerm,
        include_adult: "false",
        language: "en-US",
        page: "1",
      },
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGEwY2RkZGUyM2I5NzJjM2U2MzMwMjIyMTQ0M2VjMSIsIm5iZiI6MTY5OTkwOTMyOS4yMzQsInN1YiI6IjY1NTI4ZWQxZDRmZTA0MDBhYzM0ZTBmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xrsUAKPhkB21DPZwhnIP0RpRQpR8iRHTgzbCL_2jWaE",
      },
    };

    setIsLoading(true);

    try {
      const response = await axios.request(options);

      dispatch(setSearchResults(response.data.results));
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      console.log(error, isLoading);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <div className=" min-h-[100dvh] flex flex-col">
      <Header mainScreenRef={mainScreenRef} />

      <div className=" pt-32 px-5 md:px-10">
        <div className=" w-full md:w-fit mx-auto flex flex-col items-center gap-5 md:gap-2">
          {/* search bar */}
          <form
            className=" w-full flex flex-col md:flex-row items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();

              searchForItem();
            }}
          >
            <input
              type="text"
              placeholder="Search by Title, Genre, People"
              value={searchTerm}
              onChange={(e) => {
                dispatch(setSearchTerm(e.target.value));
              }}
              className=" w-full p-4 rounded outline-0 text-black"
              id="searchBar"
            />

            <button
              className=" w-full md:w-auto rounded px-6 py-4 bg-[#9B51E0]"
              onClick={() => searchForItem()}
              id="searchForMediaBtn"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* results section */}
      {isLoading ? (
        <div className=" w-full flex flex-col items-center justify-center min-h-fit flex-1">
          <CircularProgress color="inherit" />
        </div>
      ) : searchResults.length !== 0 ? (
        <div className=" p-10">
          <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 lg:gap-8">
            {searchResults.map((element, index) => (
              <div key={index}>
                {element.profile_path ? (
                  <div>
                    <img
                      src={tmdbBaseURL + element.profile_path}
                      alt={element.name || element.title}
                      className=" w-[500px] h-full rounded-lg cursor-pointer"
                      onClick={() => {
                        dispatch(setmediaID(element.id));
                        dispatch(setmediaType(element.media_type));
                        history.push("/Details");
                      }}
                    />

                    <p className=" text-center">
                      {element.name || element.title}
                    </p>
                  </div>
                ) : element.poster_path ? (
                  <div>
                    <img
                      src={tmdbBaseURL + element.poster_path}
                      alt={element.name || element.title}
                      className=" w-[500px] h-full rounded-lg cursor-pointer"
                      onClick={() => {
                        dispatch(setmediaID(element.id));
                        dispatch(setmediaType(element.media_type));
                        history.push("/Details");
                      }}
                    />

                    <p className=" text-center">
                      {element.name || element.title}
                    </p>
                  </div>
                ) : (
                  <p className=" flex flex-col justify-center h-full text-center">{`No image found for ${
                    element.name || element.title
                  } ${element.media_type}`}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className=" w-full flex flex-col items-center justify-center min-h-fit flex-1">
          No results found
        </div>
      )}
    </div>
  );
};

export default Search;
