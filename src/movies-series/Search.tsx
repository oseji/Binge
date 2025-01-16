import { useState, useRef } from "react";

import Header from "../signed-in-landing-page/SignedInHeader";
import axios from "axios";

const Search = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const mainScreenRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

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
      setData(response.data);

      console.log(response.data);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      console.log(error, data, isLoading);
      setIsLoading(false);
    }
  };

  return (
    <div className=" min-h-screen">
      <Header mainScreenRef={mainScreenRef} />

      <div className=" pt-32 px-5 md:px-10">
        <div className=" w-full md:w-fit mx-auto flex flex-col items-center gap-5 md:gap-2">
          <div className=" w-full flex flex-col md:flex-row items-center gap-2">
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
          </div>

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

      {/* <p className=" min-h-fit">search</p> */}
    </div>
  );
};

export default Search;
