import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";
import { Link } from "react-router-dom";

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
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedIds();
  }, []);

  useEffect(() => {
    console.log("likedIds", likedIds);
  }, [likedIds]);

  return (
    <div className=" myList">
      <div className=" flex flex-row justify-between items-center">
        <Link to={"/"}>
          <img src={backArrow} alt="back arrow" />
        </Link>

        <h1 className=" text-3xl font-bold capitalize">my list</h1>
      </div>

      {/* list content */}
      <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10"></div>
    </div>
  );
};

export default MyList;
