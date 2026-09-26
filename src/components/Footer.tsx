import { Link } from "react-router-dom";
import Icon from "./Icon";

const INDEX = [
  [
    { label: "Movies", to: "/Movies" },
    { label: "Series", to: "/Series" },
    { label: "Search", to: "/Search" },
    { label: "My List", to: "/MyList" },
  ],
  [
    { label: "Log in", to: "/LoginPage" },
    { label: "Sign up", to: "/RegistrationPage" },
    { label: "Passes (a concept)", to: "/#passes" },
    { label: "Questions", to: "/#faq" },
  ],
];

// End credits: who supplied what, set as a billing block
const CREDITS = [
  { role: "Film & series data", name: "The Movie Database (TMDB)", href: "https://www.themoviedb.org" },
  { role: "Where to watch", name: "JustWatch, via TMDB", href: "https://www.justwatch.com" },
  { role: "Trailers", name: "YouTube", href: "https://www.youtube.com" },
  { role: "Design & build", name: "oseji", href: "https://github.com/oseji" },
];

export default function Footer() {
  return (
    <footer className="relative mt-[var(--section-y)] overflow-hidden">
      <div className="wrap">
        <div className="strand-rule" />
        <div className="grid gap-12 pt-8 pb-14 md:grid-cols-12">
          <div className="md:col-span-5 lg:col-span-4">
            <p className="t-head text-paper max-w-[30ch]">
              A free film and series discovery app. It plays trailers, never films, and it's honest about that.
            </p>
            <Link to="/Search" className="link-arrow t-credit mt-6 py-2">
              Find something to watch <Icon name="arrowRight" size={16} />
            </Link>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 lg:col-span-4 grid grid-cols-2 gap-6">
            {INDEX.map((col, i) => (
              <ul key={i} className="flex flex-col">
                {col.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="inline-block py-1.5 text-sm text-paper-muted hover:text-paper transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </nav>

          <dl className="md:col-span-4 flex flex-col gap-4">
            {CREDITS.map((c) => (
              <div key={c.role}>
                <dt className="t-micro text-paper-subtle">{c.role}</dt>
                <dd className="mt-1">
                  <a href={c.href} target="_blank" rel="noreferrer" className="text-sm text-paper hover:text-signal transition-colors">
                    {c.name}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 py-6 border-t border-rule">
          <p className="text-xs text-paper-subtle max-w-[62ch]">
            © {new Date().getFullYear()} Binge. This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <a href="https://github.com/oseji/Binge" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-paper-muted hover:text-paper transition-colors py-2">
            <Icon name="github" size={18} /> Source on GitHub
          </a>
        </div>
      </div>

      <p aria-hidden="true" className="footer-mark select-none px-[calc(var(--gutter)*0.6)] -mb-[0.13em] whitespace-nowrap">
        Binge
      </p>
    </footer>
  );
}
