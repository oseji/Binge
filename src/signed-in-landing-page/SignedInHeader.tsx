import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase-config/firebase";

import { setFalse, setTrue } from "../redux/loginState";
import { loading, notLoading } from "../redux/loadingState";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress } from "@mui/material";

import { clearSearch } from "../redux/searchStateSlice";

import logo from "../assets/Binge.svg";
import menu from "../assets/menu.svg";
import closeMenu from "../assets/icons8-close.svg";

import searchIcon from "../assets/searchicon.svg";
import avatar from "../assets/avatar.png";
import editProfileIcon from "../assets/editProfile.svg";
import logoutIcon from "../assets/logout.svg";
import heartIcon from "../assets/icons8-heart-100.png";
import { RootState } from "../redux/store";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLDivElement>;
};

const Header = (props: headerProps) => {
  const menuRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);

  const isLoading = useSelector(
    (state: RootState) => state.loadingSetter.isLoading
  );
  const dispatch = useDispatch();

  const logOut = async () => {
    dispatch(loading());

    try {
      await signOut(auth);
      console.log("logged out successfully");

      dispatch(setFalse());
    } catch (err: any) {
      if (err) {
        dispatch(setTrue());
      }
      console.log(err);
    } finally {
      dispatch(notLoading());
    }
  };

  // menu toggle
  useEffect(() => {
    if (menuRef.current) {
      if (menuToggled) {
        menuRef.current.classList.remove("menuHidden");
        menuRef.current.classList.add("menuShow");
        props.mainScreenRef.current?.classList.add("hideMainScreen");
      }

      if (!menuToggled) {
        menuRef.current.classList.add("menuHidden");
        menuRef.current.classList.remove("menuShow");
        props.mainScreenRef.current?.classList.remove("hideMainScreen");
      }
    }
  }, [menuToggled]);

  return (
    <div>
      {/* header for tablets and desktops */}
      <header className="bigScreenHeader top-5">
        <Link to={"/"} onClick={() => dispatch(clearSearch())}>
          <img src={logo} alt="Binge Logo" className="headerLogo" />
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-10 ">
          <Link to={"/Search"} id="searchBtn">
            <img
              src={searchIcon}
              alt=" search icon"
              className=" cursor-pointer h-5"
            />
          </Link>

          <div className=" flex flex-col items-start relative">
            <img
              src={avatar}
              alt="profile picture"
              className=" cursor-pointer"
              onClick={() => {
                modalRef.current?.classList.toggle("scale-0");
              }}
            />

            <div
              ref={modalRef}
              className=" transition ease-in-out duration-200 scale-0 w-36 flex flex-col gap-5 p-4 rounded-md text-sm bg-black absolute top-14 right-2"
            >
              <Link to={"/MyList"}>
                <button className=" capitalize flex flex-row gap-3 items-center cursor-pointer">
                  <img src={heartIcon} alt="heart icon" className=" h-4" />
                  <span> my list</span>
                </button>
              </Link>

              <button className=" flex flex-row gap-3 items-center cursor-pointer">
                <img src={editProfileIcon} alt="edit profile icon" />
                <span>Edit profile</span>
              </button>

              <button
                className=" flex flex-row gap-3 items-center"
                onClick={logOut}
              >
                <div className="  flex flex-row gap-3 items-center">
                  <img src={logoutIcon} alt="edit profile icon" />
                  <span>Sign out</span>
                </div>

                {isLoading && (
                  <CircularProgress color="inherit" size={"1.2rem"} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* header for phones */}
      <header className="smallScreenHeader ">
        <div className=" flex flex-row justify-between items-start">
          <img src={logo} alt="Binge Logo" className=" h-8" />

          <img
            src={menuToggled ? closeMenu : menu}
            alt="menu image"
            className=" h-8"
            onClick={() => setMenuToggled((prev) => !prev)}
          />
        </div>

        <div className="menuHidden " ref={menuRef}>
          <ul className="flex flex-col items-start  gap-16 bg-black text-2xl uppercase ">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/MyList"}>My List</Link>
            </li>
            <li>my profile</li>

            <Link
              to={"/Search"}
              className=" flex flex-row items-center gap-3 text-2xl uppercase"
            >
              <span>Search</span>
              {/* <img
                src={searchIcon}
                alt=" search icon"
                className=" cursor-pointer h-5"
              /> */}
            </Link>

            <button
              className=" flex flex-row gap-3 items-center text-2xl uppercase"
              onClick={logOut}
            >
              <span>Sign out</span>
              <img src={logoutIcon} alt="edit profile icon" className=" h-5" />
            </button>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
