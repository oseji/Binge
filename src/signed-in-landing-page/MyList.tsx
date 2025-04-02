import axios from "axios";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

type MediaItem = {
  id: number;
  mediaType: "movie" | "tv";
};

import backArrow from "../assets/previous.svg";
const MyList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [likedMedia, setLikedMedia] = useState<MediaItem[]>([]);

  const fetchLikedMedia = async () => {
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
        const likedContent = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: data.id, mediaType: data.mediaType };
        });

        // Update the state with the fetched liked IDs
        setLikedMedia(likedContent);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedia = async ({
    id,
    mediaType,
  }: {
    id: number;
    mediaType: "movie" | "tv" | "person";
  }) => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Secure API Key storage
    const BASE_URL = "https://api.themoviedb.org/3";

    try {
      const response = await axios.get(`${BASE_URL}/${mediaType}/${id}`, {
        params: { language: "en-US" },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      setLikedMedia(response.data);
      console.log("Fetched media:", response.data);

      return { ...response.data, mediaType }; // Return data with mediaType for context
    } catch (error) {
      console.error(`Error fetching ${mediaType} with ID ${id}:`, error);
      throw error; // Re-throw error for handling in calling function
    }
  };

  const fetchAllMedia = () => {
    const promises = likedMedia.map((item) => fetchMedia(item));
    return Promise.all(promises);
  };

  useEffect(() => {
    fetchLikedMedia().then(() => fetchAllMedia());
  }, []);

  useEffect(() => {
    if (likedMedia.length > 0) {
      fetchAllMedia()
        .then((mediaArray) => {
          console.log("Fetched media:", mediaArray);
          setLikedMedia(mediaArray);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, []);

  useEffect(() => {
    console.log("liked media", likedMedia);
  }, [likedMedia]);

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
          <div>
            {likedMedia.length > 0 ? (
              <div>
                {likedMedia.map((media) => (
                  <div key={media.id}>{media.mediaType}</div>
                ))}
              </div>
            ) : (
              <div>no liked media found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
