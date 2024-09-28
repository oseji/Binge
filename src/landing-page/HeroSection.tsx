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

      <div className=" text-center">
        <h1>Welcome to Binge!</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum
          morbi.
        </p>

        <div className=" flex flex-col items-center gap-3">
          <button className=" bg-white px-4 py-2 rounded-md">
            Wanna Join Binge? Sign Up
          </button>

          <button className=" bg-white px-4 py-2 rounded-md">
            Start 7-day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
