import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import menu from "../assets/menu.svg";
import closeMenu from "../assets/icons8-close.svg";

import searchIcon from "../assets/searchicon.svg";
import notificationIcon from "../assets/notificationIcon.svg";
import avatar from "../assets/avatar.png";
import editProfileIcon from "../assets/editProfile.svg";
import logoutIcon from "../assets/logout.svg";
import playIcon from "../assets/circle-play.svg";
import infoOutline from "../assets/info_outline.svg";

import logo from "../assets/Binge.svg";

const HeroSection = () => {
  const menuRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);
  const mainScreenRef = useRef<HTMLDivElement>(null);

  // menu toggle
  useEffect(() => {
    if (menuRef.current) {
      if (menuToggled) {
        menuRef.current.classList.remove("menuHidden");
        menuRef.current.classList.add("menuShow");
        mainScreenRef.current?.classList.add("hideMainScreen");
      }

      if (!menuToggled) {
        menuRef.current.classList.add("menuHidden");
        menuRef.current.classList.remove("menuShow");
        mainScreenRef.current?.classList.remove("hideMainScreen");
      }
    }
  }, [menuToggled]);

  return (
    <div
      className=" min-h-screen min bg-cover"
      style={{
        backgroundImage: `url("/signed in hero bg.jpg")`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className=" absolute w-full h-full min-h-screen top-0 left-0 bg-black bg-opacity-45"></div>

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

      <div className=" absolute min-w-full min-h-[80dvh] md:min-h-[100dvh] flex flex-col justify-center pt-5  pb-20 md:pb-0 px-5 xl:px-10">
        <h1 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
          The Boy Who Cried Wolf
        </h1>

        <p className=" w-full md:w-3/4">
          Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum
          morbi tet verte lorem ipsum dolor sit ami consuer e bibebudy bibut
          lorem ipsum
        </p>

        <div className=" flex flex-row items-center gap-5 font-semibold my-5">
          <span>Fantasy</span>
          <span>Movie</span>
          <span>Play</span>
          <span>2023</span>
        </div>

        <div className=" flex flex-row gap-5">
          <button className=" flex flex-row items-center gap-2 px-4 py-2 bg-white text-black rounded-md">
            <img src={playIcon} alt="play icon" />
            Play
          </button>

          <button className=" flex flex-row items-center gap-2 px-4 py-2 bg-[#333333] rounded-md">
            <img src={infoOutline} alt="info icon" />
            More info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
