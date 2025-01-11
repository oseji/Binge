import { useState, useRef } from "react";

import Header from "../signed-in-landing-page/SignedInHeader";

const Search = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const mainScreenRef = useRef<HTMLDivElement>(null);

  return (
    <div className=" min-h-screen">
      <Header mainScreenRef={mainScreenRef} />

      <div className=" pt-32 ">
        <div className=" w-fit mx-auto flex flex-col items-center gap-2">
          <div className=" w-full flex flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Search by Title, Genre, People"
              value={searchedTerm}
              onChange={(e) => {
                setSearchedTerm(e.target.value);
              }}
              className=" w-full p-4 rounded"
            />
            <button className=" rounded px-6 py-4 bg-[#9B51E0]">Search</button>
          </div>

          <div className=" flex flex-row items-center gap-2">
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
    </div>
  );
};

export default Search;
