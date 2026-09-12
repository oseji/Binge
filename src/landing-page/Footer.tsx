import { Link } from "react-router-dom";
import footerLogo from "../assets/footer-logo.svg";
import github from "../assets/github.png";

const footerLinks = [
  {
    heading: "Browse",
    links: [
      { label: "Home", to: "/" },
      { label: "Movies", to: "/Movies" },
      { label: "Series", to: "/Series" },
      { label: "Search", to: "/Search" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", to: "/LoginPage" },
      { label: "Sign up", to: "/RegistrationPage" },
      { label: "My List", to: "/MyList" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Pricing", to: "/#pricing" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
];

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-10 lg:gap-20 px-5 md:px-10 py-14">
        {/* Brand */}
        <div className="flex-shrink-0">
          <img src={footerLogo} alt="Binge Logo" className="h-8 mb-4 opacity-80" />
          <p className="text-fg-subtle text-sm leading-relaxed max-w-[240px]">
            Discover what to watch next. Explore thousands of titles, trailers, and reviews — all in one place.
          </p>
        </div>

        {/* Links grid */}
        <nav aria-label="Footer" className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full lg:w-auto">
          {footerLinks.map((col) => (
            <div className="footerCol" key={col.heading}>
              <h3 className="footerColHeading">{col.heading}</h3>
              {col.links.map((link) =>
                // In-page anchors need a real <a> so the browser jumps to the section
                link.to.startsWith("/#") ? (
                  <a key={link.label} href={link.to}>{link.label}</a>
                ) : (
                  <Link key={link.label} to={link.to}>{link.label}</Link>
                )
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line py-6 px-5 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-fg-subtle text-sm">© {new Date().getFullYear()} Binge. All rights reserved.</p>
        <div className="footerIconsGrp">
          <a
            href="https://github.com/oseji/Binge"
            target="_blank"
            rel="noreferrer"
            aria-label="Binge on GitHub"
            className="footerIcon"
          >
            <img src={github} alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
