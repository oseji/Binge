import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import menu from "../assets/menu.svg";
import closeMenu from "../assets/icons8-close.svg";
import logo from "../assets/Binge.svg";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLDivElement>;
};

const Header = (props: headerProps) => {
  const menuRef = useRef<HTMLImageElement>(null);
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
  }, [menuToggled]);

  return (
    <div>
      {/* header for tablets and desktops */}
      <header className="bigScreenHeader md:top-12 lg:top-10 xl:top-8">
        <ul className="headerList">
          <li>
            <Link to={"/Movies"}>Movies</Link>
          </li>

          <li>
            <Link to={"/Series"}>Series</Link>
          </li>
        </ul>

        <Link to={"/"}>
          <img src={logo} alt="Binge Logo" className="headerLogo" />
        </Link>

        <ul className="headerList">
          <Link to={"/LoginPage"}>
            <li>Login</li>
          </Link>

          <Link to={"/RegistrationPage"}>
            <li>Sign up</li>
          </Link>
        </ul>
      </header>

      {/* header for phones */}
      <header className="smallScreenHeader ">
        <div className=" flex flex-row justify-between items-start">
          <Link to={"/"}>
            <img src={logo} alt="Binge Logo" className=" h-8" />
          </Link>

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
              <Link to={"/Movies"}>Movies</Link>
            </li>

            <li>
              <Link to={"/Series"}>Series</Link>
            </li>

            <Link to={"/LoginPage"}>
              <li onClick={() => setMenuToggled(false)}>Login</li>
            </Link>

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
