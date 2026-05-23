import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import menuImg from "../assets/menu.svg";
import closeImg from "../assets/icons8-close.svg";
import logo from "../assets/Binge.svg";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLDivElement>;
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
        <ul className="headerList">
          <li><Link to={"/Movies"}>Movies</Link></li>
          <li><Link to={"/Series"}>Series</Link></li>
          <li><Link to={"/"}>Home</Link></li>
        </ul>

        <Link to={"/"}>
          <img src={logo} alt="Binge Logo" className="headerLogo" />
        </Link>

        <div className="flex items-center gap-2">
          <Link to={"/LoginPage"}>
            <button className="px-5 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/5">
              Log in
            </button>
          </Link>
          <Link to={"/RegistrationPage"}>
            <button className="px-5 py-2 text-sm font-semibold bg-[#9B51E0] text-white rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg shadow-purple-900/30">
              Sign up
            </button>
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
            aria-label={menuToggled ? "Close menu" : "Open menu"}
            onClick={() => setMenuToggled((prev) => !prev)}
            className="p-1 focus:outline-none"
          >
            <img src={menuToggled ? closeImg : menuImg} alt="" className="h-7" />
          </button>
        </div>

        <div className="menuHidden" ref={menuRef}>
          <ul className="flex flex-col gap-8 text-2xl uppercase pt-8 pl-2">
            <li><Link to={"/"} onClick={() => setMenuToggled(false)}>Home</Link></li>
            <li><Link to={"/Movies"} onClick={() => setMenuToggled(false)}>Movies</Link></li>
            <li><Link to={"/Series"} onClick={() => setMenuToggled(false)}>Series</Link></li>
            <li>
              <Link to={"/LoginPage"} onClick={() => setMenuToggled(false)} className="text-[#9B51E0]">
                Log in
              </Link>
            </li>
            <li>
              <Link to={"/RegistrationPage"} onClick={() => setMenuToggled(false)}>
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
