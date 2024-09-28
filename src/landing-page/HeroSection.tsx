import logo from "../assets/Binge.svg";

const HeroSection = () => {
  return (
    <section className="HeroSection">
      <header>
        <ul className="headerList">
          <li>Movies</li>
          <li>Series</li>
          <li>Tv Shows</li>
        </ul>

        <img src={logo} alt="Binge Logo" />

        <ul className="headerList">
          <li>Choose your language</li>
          <li>Sign up</li>
        </ul>
      </header>

      <div className=" text-center mt-28">
        <h1 className="sectionHeading">
          Welcome to Bin<span className=" text-[#9B51E0]">ge!</span>
        </h1>

        <p className="sectionSubHeading w-[435px] mx-auto">
          Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum
          morbi.
        </p>

        <div className=" flex flex-col items-center gap-3 mt-5">
          <button className="heroSectionBtns bg-[#9B51E0] rounded-md">
            Wanna Join Binge? Sign Up
          </button>

          <button className="heroSectionBtns bg-transparent text-[#9B51E0] outline-[#9B51E0] outline ">
            Start 7-day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
