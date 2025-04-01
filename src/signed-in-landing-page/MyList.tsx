import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

import backArrow from "../assets/previous.svg";
const MyList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const fetchLikedIds = async () => {
    setIsLoading(true);
    const user = auth.currentUser;

    try {
      if (user) {
        // Reference the user's LikedContent subcollection
        const likedContentRef = collection(
          db,
          `users/${user.email}/LikedContent`
        );

        // Fetch all documents in the LikedContent collection
        const querySnapshot = await getDocs(likedContentRef);

        // Extract the IDs from the documents
        const likedIds = querySnapshot.docs.map((doc) => doc.data().id);

        // Update the state with the fetched liked IDs
        setLikedIds(likedIds);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  function fetchMedia({ id, mediaType }) {
    const apiKey = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;
    const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error fetching ${mediaType} ${id}: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => ({
        ...data,
        mediaType, // Keep track of whether it's a movie or TV show
      }));
  }

  useEffect(() => {
    fetchLikedIds();
  }, []);

  useEffect(() => {
    console.log("likedIds", likedIds);
  }, [likedIds]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return (
    <div className=" myList">
      <div className=" flex flex-row justify-between items-center">
        <Link to={"/"}>
          <img src={backArrow} alt="back arrow" />
        </Link>

        <h1 className=" text-3xl font-bold capitalize">my list</h1>
      </div>

      {/* list content */}
      <div>
        {isLoading ? (
          <div className=" min-h-[90dvh] flex justify-center items-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default MyList;
