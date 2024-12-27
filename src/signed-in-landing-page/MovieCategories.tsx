import Lotr from "../assets/LOTR.png";

const MovieCategories = () => {
  const movies = [Lotr, Lotr, Lotr, Lotr, Lotr, Lotr];

  return (
    <div className="movieCategories">
      <div>
        <h3 className="categoryGroupHeading">anime</h3>
        <div className="categoryGroup">
          {movies.map((element, index) => (
            <img
              src={element}
              alt="image thumbnail"
              key={index}
              className="movieThumbnail"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="categoryGroupHeading">thriler</h3>
        <div className="categoryGroup">
          {movies.map((element, index) => (
            <img
              src={element}
              alt="image thumbnail"
              key={index}
              className="movieThumbnail"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="categoryGroupHeading">movies</h3>
        <div className="categoryGroup">
          {movies.map((element, index) => (
            <img
              src={element}
              alt="image thumbnail"
              key={index}
              className="movieThumbnail"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="categoryGroupHeading">series</h3>
        <div className="categoryGroup">
          {movies.map((element, index) => (
            <img
              src={element}
              alt="image thumbnail"
              key={index}
              className="movieThumbnail"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="categoryGroupHeading">tv shows</h3>
        <div className="categoryGroup">
          {movies.map((element, index) => (
            <img
              src={element}
              alt="image thumbnail"
              key={index}
              className="movieThumbnail"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCategories;
