import film1 from "../assets/film1.png";
import film2 from "../assets/film2.png";
import film3 from "../assets/film3.png";

type favMediaType = {
  heading: string;
  subHeading: string;
  image: string;
}[];

const Favorites = () => {
  const favMedia: favMediaType = [
    {
      heading: "New & Classics",
      subHeading: "Series",
      image: film1,
    },
    {
      heading: "Popular",
      subHeading: "Movie",
      image: film2,
    },
    {
      heading: "New & Classics",
      subHeading: "Series",
      image: film3,
    },
  ];

  return (
    <section className="favoritesSection">
      <h1 className="sectionHeading">
        Watch your <span className=" text-[#9B51E0]">Favourites</span>
      </h1>

      <p className="sectionSubHeading">
        Lorem ipsum dolor sit amet consectetur. Aenean augue e u bibendum morbi.
      </p>

      <div className="favoritesGrp">
        {favMedia.map((element, index) => (
          <div
            className="favoritesBox"
            key={index}
            style={{
              backgroundImage: `url("src/assets/film${index + 1}.png")`,
            }}
          >
            <div className=" absolute w-full h-full top-0 left-0 bg-black bg-opacity-40"></div>

            <div className=" absolute">
              <h2 className=" font-semibold">{element.heading}</h2>
              <p>{element.subHeading}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
