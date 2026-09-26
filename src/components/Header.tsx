import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { gsap } from "../lib/motion";

import { auth } from "../firebase-config/firebase";
import { useWatchlist } from "../hooks/useWatchlist";
import { prefersReducedMotion } from "../lib/history";
import Icon from "./Icon";
import Wordmark from "./Wordmark";

type Props = {
  /** Sits over a full-bleed still until the page scrolls */
  overlay?: boolean;
};

const NAV = [
  { to: "/", label: "Home", match: (p: string) => p === "/" },
  { to: "/Movies", label: "Movies", match: (p: string) => p.startsWith("/Movies") },
  { to: "/Series", label: "Series", match: (p: string) => p.startsWith("/Series") },
  { to: "/MyList", label: "My List", match: (p: string) => p.startsWith("/MyList") },
];

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export default function Header({ overlay = false }: Props) {
  const { pathname } = useLocation();
  const history = useHistory();
  const { user } = useWatchlist();
  const [solid, setSolid] = useState(!overlay);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (!overlay) return setSolid(true);
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // "/" jumps to search from anywhere, the way most search-first tools behave
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      e.preventDefault();
      const field = document.getElementById("search-field") as HTMLInputElement | null;
      if (field) field.focus();
      else history.push("/Search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history]);

  const logOut = async () => {
    setAccountOpen(false);
    setMenuOpen(false);
    try {
      await signOut(auth);
      toast.success("Signed out");
    } catch {
      toast.error("Couldn't sign out. Try again.");
    }
  };

  const loginHref = `/LoginPage?next=${encodeURIComponent(pathname)}`;

  return (
    <>
      <header className="site-header" data-solid={solid}>
        <div className="wrap h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/" aria-label="Binge, home" className="text-[1.625rem] py-2">
              <Wordmark />
            </Link>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="nav-link" aria-current={item.match(pathname) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              to="/Search"
              aria-label="Search"
              aria-current={pathname.startsWith("/Search") ? "page" : undefined}
              className="btn-icon md:w-auto md:px-3 md:gap-3 md:border md:border-rule md:hover:border-rule-strong md:min-w-[12.5rem] md:justify-between text-paper-muted hover:text-paper"
            >
              <span className="flex items-center gap-2.5">
                <Icon name="search" />
                <span className="hidden md:inline text-sm">Search</span>
              </span>
              <span className="kbd hidden md:inline-flex" aria-hidden="true">/</span>
            </Link>

            {user ? (
              <AccountMenu email={user.email ?? "Guest"} open={accountOpen} setOpen={setAccountOpen} onSignOut={logOut} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to={loginHref} className="nav-link">
                  Log in
                </Link>
                <Link to="/RegistrationPage" className="btn btn-signal min-h-[2.5rem]">
                  Sign up free
                </Link>
              </div>
            )}

            <button
              type="button"
              className="btn-icon md:hidden -mr-2"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu pathname={pathname} signedIn={!!user} loginHref={loginHref} onClose={() => setMenuOpen(false)} onSignOut={logOut} />}
    </>
  );
}

function AccountMenu({
  email,
  open,
  setOpen,
  onSignOut,
}: {
  email: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  onSignOut: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="account-panel"
        aria-label="Account"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-11 h-11 rounded bg-ink-3 text-paper font-[800] uppercase hover:bg-signal hover:text-ink-0 transition-colors"
        style={{ fontStretch: "80%" }}
      >
        {email.charAt(0)}
      </button>

      <div
        id="account-panel"
        hidden={!open}
        className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-ink-1 border border-rule-strong rounded shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]"
      >
        <p className="px-4 pt-4 pb-3 border-b border-rule">
          <span className="t-micro text-paper-subtle block mb-1">Signed in as</span>
          <span className="text-sm text-paper break-all">{email}</span>
        </p>
        <ul className="p-1.5">
          <li>
            <Link to="/MyList" onClick={() => setOpen(false)} className="flex items-center gap-3 px-2.5 py-2.5 rounded text-sm text-paper-muted hover:text-paper hover:bg-ink-2">
              <Icon name="bookmark" size={18} /> My List
            </Link>
          </li>
          <li>
            <button type="button" onClick={onSignOut} className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded text-sm text-paper-muted hover:text-paper hover:bg-ink-2">
              <Icon name="logout" size={18} /> Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

function MobileMenu({
  pathname,
  signedIn,
  loginHref,
  onClose,
  onSignOut,
}: {
  pathname: string;
  signedIn: boolean;
  loginHref: string;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(document.activeElement);

  const items = [
    { to: "/", label: "Home", current: pathname === "/" },
    { to: "/Movies", label: "Movies", current: pathname.startsWith("/Movies") },
    { to: "/Series", label: "Series", current: pathname.startsWith("/Series") },
    { to: "/Search", label: "Search", current: pathname.startsWith("/Search") },
    { to: "/MyList", label: "My List", current: pathname.startsWith("/MyList") },
  ];

  // Lock the page behind the overlay; restore focus to the menu button on close
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = opener.current as HTMLElement | null;
    return () => {
      root.style.overflow = prev;
      trigger?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Index lines rise out of their own masks, one after another
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".menu-line", { yPercent: 105, duration: 0.7, ease: "expo.out", stagger: 0.05 });
      gsap.from(".menu-foot", { opacity: 0, duration: 0.5, delay: 0.3 });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div id="site-menu" ref={panelRef} className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="wrap flex items-center justify-between h-[var(--header-h)] flex-shrink-0">
        <Link to="/" onClick={onClose} aria-label="Binge, home" className="text-[1.625rem] py-2">
          <Wordmark />
        </Link>
        <button ref={closeRef} type="button" className="btn-icon -mr-2" aria-label="Close menu" onClick={onClose}>
          <Icon name="close" size={24} />
        </button>
      </div>

      <nav aria-label="Primary" className="wrap flex-1 pt-8">
        <ul>
          {items.map((item) => (
            <li key={item.to} className="overflow-hidden border-b border-rule">
              <Link to={item.to} onClick={onClose} className="menu-link menu-line" aria-current={item.current ? "page" : undefined}>
                {item.label}
                <Icon name="arrowRight" size={28} className="opacity-50 flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu-foot wrap py-8 flex flex-col gap-3">
        {signedIn ? (
          <button type="button" onClick={onSignOut} className="btn btn-ghost w-full">
            <Icon name="logout" size={18} /> Sign out
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link to={loginHref} onClick={onClose} className="btn btn-ghost">
              Log in
            </Link>
            <Link to="/RegistrationPage" onClick={onClose} className="btn btn-signal">
              Sign up free
            </Link>
          </div>
        )}
        <p className="t-micro text-paper-subtle mt-2">Data from TMDB</p>
      </div>
    </div>
  );
}
