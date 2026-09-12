import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { CircularProgress } from "@mui/material";

import { auth } from "../firebase-config/firebase";
import { RootState } from "../redux/store";
import { setFalse, setTrue } from "../redux/loginState";
import { loading, notLoading } from "../redux/loadingState";
import { clearSearch } from "../redux/searchStateSlice";

import logo from "../assets/Binge.svg";
import menuImg from "../assets/menu.svg";
import closeImg from "../assets/icons8-close.svg";
import searchIcon from "../assets/searchicon.svg";
import avatar from "../assets/avatar.png";
import logoutIcon from "../assets/logout.svg";
import heartIcon from "../assets/icons8-heart-100.png";

type HeaderProps = {
  /** Page content to collapse while the mobile menu is open */
  mainScreenRef?: React.RefObject<HTMLElement>;
};

const NAV = [
  { to: "/", label: "Home" },
  { to: "/Movies", label: "Movies" },
  { to: "/Series", label: "Series" },
];

const HEADER_BG = { background: "rgba(9,9,15,0.88)", backdropFilter: "blur(20px)" };

const Header = ({ mainScreenRef }: HeaderProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [menuToggled, setMenuToggled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isLoggedIn = useSelector((state: RootState) => state.loginSetter.isLoggedIn);
  const isLoading = useSelector((state: RootState) => state.loadingSetter.isLoading);
  const dispatch = useDispatch();

  const logOut = async () => {
    dispatch(loading());
    try {
      await signOut(auth);
      dispatch(setFalse());
    } catch {
      dispatch(setTrue());
    } finally {
      dispatch(notLoading());
    }
  };

  const closeMenu = () => setMenuToggled(false);

  // Close the account dropdown on outside click or Escape (Escape returns focus to the trigger)
  useEffect(() => {
    if (!dropdownOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
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

  // Mobile menu open/close
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    menu.classList.toggle("menuShow", menuToggled);
    menu.classList.toggle("menuHidden", !menuToggled);
    mainScreenRef?.current?.classList.toggle("hideMainScreen", menuToggled);
  }, [menuToggled, mainScreenRef]);

  const navLinkClass =
    "inline-block px-3 py-3 text-[0.9375rem] font-medium text-white/70 hover:text-white transition-colors duration-200";

  return (
    <div>
      {/* ── Desktop ── */}
      <header
        className="hidden md:flex fixed top-0 inset-x-0 z-50 h-[68px] items-center justify-between px-6 lg:px-10 border-b border-line"
        style={HEADER_BG}
      >
        <div className="flex items-center gap-6">
          <Link to={"/"} onClick={() => dispatch(clearSearch())}>
            <img src={logo} alt="Binge Logo" className="headerLogo" />
          </Link>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink exact={item.to === "/"} to={item.to} className={navLinkClass} activeClassName="!text-white">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {isLoggedIn ? (
          <nav aria-label="Account" className="flex items-center gap-2">
            <Link
              to={"/Search"}
              aria-label="Search"
              onClick={() => dispatch(clearSearch())}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-white/5 opacity-60 hover:opacity-100 transition-opacity duration-200"
            >
              <img src={searchIcon} alt="" className="h-5" />
            </Link>

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
                ref={dropdownRef}
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
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                  onClick={logOut}
                >
                  <img src={logoutIcon} alt="" className="h-4 opacity-80" />
                  <span>Sign out</span>
                  {isLoading && <CircularProgress aria-label="Loading" color="inherit" size="0.875rem" className="ml-auto" />}
                </button>
              </div>
            </div>
          </nav>
        ) : (
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
        )}
      </header>

      {/* ── Mobile ── */}
      <header className="md:hidden sticky top-0 z-50 border-b border-line" style={HEADER_BG}>
        <div className="flex justify-between items-center p-4">
          <Link to={"/"} onClick={closeMenu}>
            <img src={logo} alt="Binge Logo" className="h-8" />
          </Link>
          <button
            type="button"
            aria-label={menuToggled ? "Close menu" : "Open menu"}
            aria-expanded={menuToggled}
            aria-controls="mobile-menu"
            onClick={() => setMenuToggled((p) => !p)}
            className="flex items-center justify-center w-11 h-11 -mr-2 rounded-full"
          >
            <img src={menuToggled ? closeImg : menuImg} alt="" className="h-7" />
          </button>
        </div>

        <nav id="mobile-menu" aria-label="Primary" className="menuHidden" ref={menuRef}>
          <ul className="flex flex-col gap-8 text-xl uppercase pl-5 pt-6 pb-10">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={closeMenu}>{item.label}</Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li><Link to={"/MyList"} onClick={closeMenu}>My List</Link></li>
                <li><Link to={"/Search"} onClick={closeMenu}>Search</Link></li>
                <li>
                  <button
                    type="button"
                    className="flex items-center gap-3 text-red-400 uppercase text-xl"
                    onClick={() => { logOut(); closeMenu(); }}
                  >
                    Sign out
                    <img src={logoutIcon} alt="" className="h-5 opacity-70" />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to={"/LoginPage"} onClick={closeMenu} className="text-accent-text">Log in</Link></li>
                <li><Link to={"/RegistrationPage"} onClick={closeMenu}>Sign up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
