import playIcon from "../assets/circle-play.svg";
import infoOutline from "../assets/info_outline.svg";

const HeroSection = () => {
  return (
    <div
      className=" min-h-screen bg-cover relative"
      style={{
        backgroundImage: `url("/signed in hero bg.jpg")`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className=" absolute w-full h-full min-h-screen top-0 left-0 bg-black bg-opacity-45"></div>

      <div className=" absolute min-w-full min-h-[80dvh] md:min-h-[100dvh] flex flex-col justify-center pt-5  pb-20 md:pb-0 px-5 xl:px-10">
        <h1 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
          The Boy Who Cried Wolf
        </h1>

        <p className=" w-full md:w-3/4">
          Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum
          morbi tet verte lorem ipsum dolor sit ami consuer e bibebudy bibut
          lorem ipsum
        </p>

        <div className=" flex flex-row items-center gap-5 font-semibold my-5">
          <span>Fantasy</span>
          <span>Movie</span>
          <span>Play</span>
          <span>2023</span>
        </div>

        <div className=" flex flex-row gap-5">
          <button className=" flex flex-row items-center gap-2 px-4 py-2 bg-white text-black rounded-md">
            <img src={playIcon} alt="play icon" />
            Play
          </button>

          <button className=" flex flex-row items-center gap-2 px-4 py-2 bg-[#333333] rounded-md">
            <img src={infoOutline} alt="info icon" />
            More info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
