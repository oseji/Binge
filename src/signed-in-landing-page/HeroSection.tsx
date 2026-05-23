import playIcon from "../assets/circle-play.svg";
import infoOutline from "../assets/info_outline.svg";

const HeroSection = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("/signed in hero bg.jpg")` }}
    >
      {/* Cinematic layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090F]/80 via-[#09090F]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-5 md:px-10 lg:px-14 pt-[72px]">
        {/* Genre + rating pills */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#9B51E0]/80 text-white backdrop-blur-sm">
            Featured
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10">
            Fantasy
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10">
            2023
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-bold text-white leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
        >
          The Boy Who<br className="hidden md:block" /> Cried Wolf
        </h1>

        {/* Description */}
        <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mb-7">
          A young shepherd who cried wolf one too many times learns the hard
          lesson of trust, truth, and consequence in this timeless tale.
        </p>

        {/* Buttons */}
        <div className="flex flex-row items-center gap-3">
          <button className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:shadow-white/10">
            <img src={playIcon} alt="" className="h-5" />
            Play
          </button>
          <button className="flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm text-white/80 hover:text-white transition-all duration-200 border border-white/15 hover:border-white/30 hover:bg-white/5">
            <img src={infoOutline} alt="" className="h-4 opacity-70" />
            More info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
