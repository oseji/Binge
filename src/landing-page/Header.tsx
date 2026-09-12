import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import menuImg from "../assets/menu.svg";
import closeImg from "../assets/icons8-close.svg";
import logo from "../assets/Binge.svg";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLElement>;
};

const Header = (props: headerProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);

  useEffect(() => {
    if (menuRef.current) {
      if (menuToggled) {
        menuRef.current.classList.remove("menuHidden");
        menuRef.current.classList.add("menuShow");
        props.mainScreenRef.current?.classList.add("hideMainScreen");
      } else {
        menuRef.current.classList.add("menuHidden");
        menuRef.current.classList.remove("menuShow");
        props.mainScreenRef.current?.classList.remove("hideMainScreen");
      }
    }
  }, [menuToggled]);

  return (
    <div>
      {/* Desktop / tablet */}
      <header className="bigScreenHeader">
        <nav aria-label="Primary">
          <ul className="headerList">
            <li><Link to={"/"}>Home</Link></li>
            <li><Link to={"/Movies"}>Movies</Link></li>
            <li><Link to={"/Series"}>Series</Link></li>
          </ul>
        </nav>

        <Link to={"/"}>
          <img src={logo} alt="Binge Logo" className="headerLogo" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={"/LoginPage"}
            className="inline-flex items-center min-h-11 px-5 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/5"
          >
            Log in
          </Link>
          <Link
            to={"/RegistrationPage"}
            className="inline-flex items-center min-h-11 px-5 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent-deep transition-all duration-200 shadow-lg shadow-purple-900/30"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Mobile */}
      <header className="smallScreenHeader">
        <div className="flex flex-row justify-between items-center">
          <Link to={"/"}>
            <img src={logo} alt="Binge Logo" className="h-8" />
          </Link>
          <button
            type="button"
            aria-label={menuToggled ? "Close menu" : "Open menu"}
            aria-expanded={menuToggled}
            aria-controls="landing-mobile-menu"
            onClick={() => setMenuToggled((prev) => !prev)}
            className="flex items-center justify-center w-11 h-11 -mr-2 rounded-full"
          >
            <img src={menuToggled ? closeImg : menuImg} alt="" className="h-7" />
          </button>
        </div>

        <nav id="landing-mobile-menu" aria-label="Primary" className="menuHidden" ref={menuRef}>
          <ul className="flex flex-col gap-8 text-2xl uppercase pt-8 pl-2">
            <li><Link to={"/"} onClick={() => setMenuToggled(false)}>Home</Link></li>
            <li><Link to={"/Movies"} onClick={() => setMenuToggled(false)}>Movies</Link></li>
            <li><Link to={"/Series"} onClick={() => setMenuToggled(false)}>Series</Link></li>
            <li>
              <Link to={"/LoginPage"} onClick={() => setMenuToggled(false)} className="text-accent-text">
                Log in
              </Link>
            </li>
            <li>
              <Link to={"/RegistrationPage"} onClick={() => setMenuToggled(false)}>
                Sign up
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
