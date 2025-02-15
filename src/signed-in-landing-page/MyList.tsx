import backArrow from "../assets/previous.svg";
import { Link } from "react-router-dom";

const MyList = () => {
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
