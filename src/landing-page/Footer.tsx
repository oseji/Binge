import footerLogo from "../assets/footer-logo.svg";
import twitter from "../assets/twitter.svg";
import linkedin from "../assets/linkedin.png";
import fb from "../assets/fb.png";
import github from "../assets/github.png";

const footerLinks = [
  {
    heading: "Product",
    links: ["Overview", "Features", "Solutions", "Pricing", "Releases"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Press", "News", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Blog", "Help Center", "Events", "Tutorials", "Support"],
  },
  {
    heading: "Legal",
    links: ["Terms", "Privacy", "Cookies", "Licences", "Settings"],
  },
];

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-10 lg:gap-20 px-5 md:px-10 py-14">
        {/* Brand */}
        <div className="flex-shrink-0">
          <img src={footerLogo} alt="Binge Logo" className="h-8 mb-4 opacity-80" />
          <p className="text-[#505068] text-sm leading-relaxed max-w-[240px]">
            Discover what to watch next. Explore thousands of titles, trailers, and reviews — all in one place.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full lg:w-auto">
          {footerLinks.map((col) => (
            <div className="footerCol" key={col.heading}>
              <p className="footerColHeading">{col.heading}</p>
              {col.links.map((link) => (
                <p key={link}>{link}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6 px-5 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[#404058] text-sm">© 2024 Binge, Inc. All rights reserved.</p>
        <div className="footerIconsGrp">
          <img src={twitter} alt="Twitter" className="footerIcon" />
          <img src={linkedin} alt="LinkedIn" className="footerIcon" />
          <img src={fb} alt="Facebook" className="footerIcon" />
          <img src={github} alt="GitHub" className="footerIcon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
