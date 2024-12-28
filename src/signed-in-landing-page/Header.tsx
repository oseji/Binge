import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/Binge.svg";
import menu from "../assets/menu.svg";
import closeMenu from "../assets/icons8-close.svg";

import searchIcon from "../assets/searchicon.svg";
import notificationIcon from "../assets/notificationIcon.svg";
import avatar from "../assets/avatar.png";
import editProfileIcon from "../assets/editProfile.svg";
import logoutIcon from "../assets/logout.svg";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLDivElement>;
};

const Header = (props: headerProps) => {
  const menuRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);

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

    console.log("clicked");
  }, [menuToggled]);

  return (
    <div>
      {/* header for tablets and desktops */}
      <header className="bigScreenHeader top-5">
        <ul className="headerList xl:w-1/3">
          <li>Movies</li>
          <li>Series</li>
          <li>Tv Shows</li>
        </ul>

        <div className=" xl:w-1/3">
          <img src={logo} alt="Binge Logo" className="headerLogo mx-auto" />
        </div>

        <ul className="flex flex-col md:flex-row items-center gap-4 lg:gap-10 xl:w-1/3">
          <div className=" flex flex-row items-center gap-3 bg-black text-white px-4 py-2 rounded-md outline outline-gray-300">
            <img src={searchIcon} alt="search icon" />

            <input
              type="text"
              name="heroSearch"
              id="heroSearch"
              placeholder="Title, people, genre"
              className=" bg-transparent outline-none"
            />
          </div>

          <img src={notificationIcon} alt="notification icon" />

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
              <div className=" flex flex-row gap-3 items-center cursor-pointer">
                <img src={editProfileIcon} alt="edit profile icon" />
                <span>Edit profile</span>
              </div>

              <Link to={"/"}>
                <div className=" flex flex-row gap-3 items-center">
                  <img src={logoutIcon} alt="edit profile icon" />
                  <span>Logout</span>
                </div>
              </Link>
            </div>
          </div>
        </ul>
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
            <li>Movies</li>
            <li>Series</li>
            <li>Tv Shows</li>
            <li>Choose your language</li>
            <Link to={"/RegistrationPage"}>
              <li onClick={() => setMenuToggled(false)}>Sign up</li>
            </Link>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
