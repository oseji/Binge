import footerLogo from "../assets/footer-logo.svg";
import ball from "../assets/ball.png";
import finger from "../assets/finger.png";
import fb from "../assets/fb.png";
import twitter from "../assets/twitter.svg";
import linkedin from "../assets/linkedin.png";
import github from "../assets/github.png";

const Footer = () => {
  return (
    <footer>
      <div className=" flex flex-col lg:flex-row items-start justify-center gap-20 p-5 md:p-0 md:pb-10">
        <div>
          <img src={footerLogo} alt="Binge Logo" className=" pb-5" />
          <p className="w-[320px]">
            Design amazing digital experiences that create more happy in the
            world.
          </p>
        </div>

        <div className="footerCol">
          <p className="footerColHeading">Product</p>
          <p>Overview</p>
          <p>Features</p>
          <p>Solutions</p>
          <p>Tutorials</p>
          <p>Pricing</p>
          <p>Releases</p>
        </div>

        <div className="footerCol">
          <p className="footerColHeading">Company</p>
          <p>About</p>
          <p>Careers</p>
          <p>Press</p>
          <p>news</p>
          <p>media kit</p>
          <p>contact</p>
        </div>

        <div className="footerCol">
          <p className="footerColHeading">Resources</p>
          <p>blog</p>
          <p>newscenter</p>
          <p>events</p>
          <p>help center</p>
          <p>tutorials</p>
          <p>support</p>
        </div>

        <div className="footerCol">
          <p className="footerColHeading">social</p>
          <p>twitter</p>
          <p>linkedIn</p>
          <p>facebook</p>
          <p>github</p>
          <p>angel list</p>
          <p>dribble</p>
        </div>

        <div className="footerCol">
          <p className="footerColHeading">legal</p>
          <p>terms</p>
          <p>privacy</p>
          <p>cookies</p>
          <p>licences</p>
          <p>settings</p>
          <p>contact</p>
        </div>
      </div>

      <div className=" bg-[#101828] py-10 px-20 flex-col md:flex-row justify-between items-center">
        <p className="text-[#98A2B3]">© 2023 Binge. All rights reserved.</p>

        <div className="footerIconsGrp">
          <img src={twitter} alt="Twitter" className="footerIcon" />
          <img src={linkedin} alt="linkedin" className="footerIcon" />
          <img src={fb} alt="facebook" className="footerIcon" />
          <img src={github} alt="github" className="footerIcon" />
          <img src={finger} alt="fingers" className="footerIcon" />
          <img src={ball} alt="ball" className="footerIcon" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
