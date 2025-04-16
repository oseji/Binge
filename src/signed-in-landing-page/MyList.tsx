import axios from "axios";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setmediaID } from "../redux/mediaID";
import { setmediaType } from "../redux/mediaType";
import { CircularProgress } from "@mui/material";

type MediaItem = {
  id: number;
  mediaType: "movie" | "tv";
};

type detailedMediaItem = {
  id: number;
  mediaType: "movie" | "tv";
  name: string;
  title: string;
  overview: string;
  poster_path: string;
};

import backArrow from "../assets/previous.svg";
const MyList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [likedMedia, setLikedMedia] = useState<MediaItem[]>([]);
  const [detailedMedia, setDetailedMedia] = useState<detailedMediaItem[]>([]);
  const tmdbBasePosterURL = "https://image.tmdb.org/t/p/w500/";

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

      setDetailedMedia(response.data);

      return { ...response.data, mediaType }; // Return data with mediaType for context
    } catch (error) {
      console.error(`Error fetching ${mediaType} with ID ${id}:`, error);
      throw error; // Re-throw error for handling in calling function
    }
  };

  const fetchAllMedia = () => {
    const promises = likedMedia.map((item) =>
      fetchMedia({ id: item.id, mediaType: item.mediaType })
    );
    return Promise.all(promises);
  };

  useEffect(() => {
    fetchLikedMedia();
  }, []);

  useEffect(() => {
    if (likedMedia.length > 0) {
      fetchAllMedia()
        .then((mediaArray) => {
          console.log("Fetched media:", mediaArray);
          setDetailedMedia(mediaArray);
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [likedMedia]);

  useEffect(() => {
    console.log("detailed media", detailedMedia);
  }, [detailedMedia]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return (
    <div className=" myList">
      <div className=" flex flex-row justify-between items-center mb-5">
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
            {detailedMedia.length > 0 ? (
              <div className=" flex flex-col gap-5 mt-5">
                {detailedMedia.map((media, index) => (
                  <div
                    key={index}
                    className=" flex flex-row gap-5 cursor-pointer"
                    onClick={() => {
                      dispatch(setmediaID(media.id));
                      dispatch(setmediaType(media.mediaType));

                      history.push("/Details");
                    }}
                  >
                    <img
                      src={tmdbBasePosterURL + media.poster_path}
                      alt={
                        media.mediaType === "movie" ? media.title : media.name
                      }
                      className=" h-36 rounded-lg"
                    />

                    <div className=" flex flex-col gap-2">
                      <h1 className=" text-lg font-bold">
                        {media.mediaType === "movie" ? media.title : media.name}
                      </h1>

                      <p className=" text-sm">{media.overview}</p>
                    </div>
                  </div>
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
