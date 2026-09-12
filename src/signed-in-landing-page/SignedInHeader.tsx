import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase-config/firebase";

import { setFalse, setTrue } from "../redux/loginState";
import { loading, notLoading } from "../redux/loadingState";
import { useDispatch, useSelector } from "react-redux";
import { clearSearch } from "../redux/searchStateSlice";
import { RootState } from "../redux/store";

import { CircularProgress } from "@mui/material";

import logo from "../assets/Binge.svg";
import menuImg from "../assets/menu.svg";
import closeImg from "../assets/icons8-close.svg";
import searchIcon from "../assets/searchicon.svg";
import avatar from "../assets/avatar.png";
import logoutIcon from "../assets/logout.svg";
import heartIcon from "../assets/icons8-heart-100.png";

type headerProps = {
  mainScreenRef: React.RefObject<HTMLElement>;
};

const Header = (props: headerProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isLoading = useSelector((state: RootState) => state.loadingSetter.isLoading);
  const dispatch = useDispatch();

  const logOut = async () => {
    dispatch(loading());
    try {
      await signOut(auth);
      dispatch(setFalse());
    } catch (err: any) {
      if (err) dispatch(setTrue());
    } finally {
      dispatch(notLoading());
    }
  };

  // Close dropdown on outside click or Escape (Escape also returns focus to the trigger)
  useEffect(() => {
    if (!dropdownOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        avatarRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdownOpen]);

  // Mobile menu toggle
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

  const closeMenu = () => setMenuToggled(false);

  return (
    <div>
      {/* ── Fixed desktop header ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 w-full h-[68px] flex-row items-center justify-between px-6 lg:px-10 backdrop-blur-xl border-b border-line"
        style={{ background: "rgba(9,9,15,0.88)" }}
      >
        <Link to={"/"} onClick={() => dispatch(clearSearch())}>
          <img src={logo} alt="Binge Logo" className="headerLogo" />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link
            to={"/Search"}
            aria-label="Search"
            onClick={() => dispatch(clearSearch())}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/5 opacity-60 hover:opacity-100 transition-opacity duration-200"
          >
            <img src={searchIcon} alt="" className="h-5" />
          </Link>

          {/* Avatar + dropdown */}
          <div className="relative">
            <button
              ref={avatarRef}
              type="button"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              aria-controls="account-menu"
              className="flex items-center justify-center w-11 h-11 rounded-full ring-2 ring-transparent hover:ring-accent/60 transition-all duration-200"
              onClick={() => setDropdownOpen((p) => !p)}
            >
              <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            </button>

            <div
              ref={modalRef}
              id="account-menu"
              role="menu"
              aria-label="Account"
              className={`absolute top-12 right-0 w-44 flex flex-col gap-1 p-2 rounded-2xl border border-line shadow-2xl shadow-black/60 z-50 transition-all duration-200 origin-top-right ${
                dropdownOpen
                  ? "visible opacity-100 scale-100 pointer-events-auto"
                  : "invisible opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ background: "rgba(16,16,26,0.97)", backdropFilter: "blur(20px)" }}
            >
              <Link
                to={"/MyList"}
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <img src={heartIcon} alt="" className="h-4 opacity-80" />
                My List
              </Link>

              <div className="h-px bg-white/5 mx-2" />

              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                onClick={logOut}
              >
                <img src={logoutIcon} alt="" className="h-4 opacity-80" />
                <span>Sign out</span>
                {isLoading && <CircularProgress aria-label="Loading" color="inherit" size="0.875rem" className="ml-auto" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile header ── */}
      <header
        className="md:hidden sticky top-0 z-50 border-b border-line"
        style={{ background: "rgba(9,9,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex justify-between items-center p-4">
          <Link to={"/"}>
            <img src={logo} alt="Binge Logo" className="h-8" />
          </Link>
          <button
            type="button"
            aria-label={menuToggled ? "Close menu" : "Open menu"}
            aria-expanded={menuToggled}
            aria-controls="signed-in-mobile-menu"
            onClick={() => setMenuToggled((p) => !p)}
            className="flex items-center justify-center w-11 h-11 -mr-2 rounded-full"
          >
            <img src={menuToggled ? closeImg : menuImg} alt="" className="h-7" />
          </button>
        </div>

        <nav id="signed-in-mobile-menu" aria-label="Primary" className="menuHidden" ref={menuRef}>
          <ul className="flex flex-col gap-10 text-xl uppercase pl-5 pt-6 pb-10">
            <li><Link to={"/"} onClick={closeMenu}>Home</Link></li>
            <li><Link to={"/MyList"} onClick={closeMenu}>My List</Link></li>
            <li><Link to={"/Search"} onClick={closeMenu}>Search</Link></li>
            <li>
              <button
                className="flex items-center gap-3 text-red-400 uppercase text-xl"
                onClick={() => { logOut(); closeMenu(); }}
              >
                Sign out
                <img src={logoutIcon} alt="" className="h-5 opacity-70" />
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
