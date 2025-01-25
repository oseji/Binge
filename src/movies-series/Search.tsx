import { useState, useRef, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import Header from "../signed-in-landing-page/SignedInHeader";
import axios from "axios";

type mediaContent = {
  poster_path: string | null;
  profile_path: string | null;
  title: string;
  name: string;
  media_type: string;
  id: number;
};

const Search = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const mainScreenRef = useRef<HTMLDivElement>(null);
  const tmdbBaseURL = "https://image.tmdb.org/t/p/w500/";

  const [data, setData] = useState<mediaContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  // const [mediaType, setMediaType] = useState<"movie" | "tv" | "person" | null>(
  //   null
  // );

  const searchForItem = async () => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/search/multi",
      params: {
        query: searchedTerm,
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
      setData(response.data.results);

      // console.log(response.data.results);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      console.log(error, data, isLoading);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

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
              value={searchedTerm}
              onChange={(e) => {
                setSearchedTerm(e.target.value);
              }}
              className=" w-full p-4 rounded outline-0 text-black"
            />

            <button
              className=" rounded px-6 py-4 bg-[#9B51E0]"
              onClick={() => searchForItem()}
            >
              Search
            </button>
          </form>

          {/* filters */}
          <div className="flex flex-wrap flex-row items-center gap-2">
            <p className=" rounded-md px-4 py-2 border border-purple-900">
              action
            </p>
            <p className=" rounded-md px-4 py-2 border border-purple-900">
              romance
            </p>
            <p className=" rounded-md px-4 py-2 border border-purple-900">
              fantasy
            </p>
            <p className=" rounded-md px-4 py-2 border border-purple-900">
              sci-fi
            </p>
            <p className=" rounded-md px-4 py-2 border border-purple-900">
              comedy
            </p>
          </div>
        </div>
      </div>

      {/* results section */}
      {isLoading ? (
        <div className=" w-full flex flex-col items-center justify-center min-h-fit flex-1">
          <CircularProgress />
        </div>
      ) : (
        <div className=" p-10">
          <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            {data.map((element, index) => (
              <div key={index}>
                {element.profile_path ? (
                  <div>
                    <img
                      src={tmdbBaseURL + element.profile_path}
                      alt={element.name || element.title}
                      className=" movieThumbnail"
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
                      className=" movieThumbnail"
                    />

                    <p className=" text-center">
                      {element.name || element.title}
                    </p>
                  </div>
                ) : (
                  <p className=" text-center">{`No image found for ${
                    element.name || element.title
                  } ${element.media_type}`}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
