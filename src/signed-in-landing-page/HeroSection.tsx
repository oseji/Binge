import { useEffect, useState } from "react";
import axios from "axios";
import playIcon from "../assets/circle-play.svg";
import infoOutline from "../assets/info_outline.svg";
import { useDispatch } from "react-redux";
import { setmediaID } from "../redux/mediaID";
import { setmediaType } from "../redux/mediaType";
import { useHistory } from "react-router-dom";

type TrendingMovie = {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    genre_ids: number[];
    release_date: string;
    vote_average: number;
    media_type: string;
};

const GENRE_MAP: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

const HeroSection = () => {
    const [featured, setFeatured] = useState<TrendingMovie | null>(null);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get(
                    "https://api.themoviedb.org/3/trending/movie/week",
                    {
                        params: { language: "en-US" },
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                        },
                    },
                );
                const movies: TrendingMovie[] = res.data.results;
                const pick = movies.find((m) => m.backdrop_path) ?? movies[0];
                setFeatured(pick);
            } catch {
                // silently fail — hero stays hidden
            }
        };
        fetchTrending();
    }, []);

    const goToDetails = () => {
        if (!featured) return;
        dispatch(setmediaID(featured.id));
        dispatch(setmediaType("movie"));
        history.push("/Details");
    };

    if (!featured) return <div className="min-h-[60vh] bg-[#09090F]" />;

    const backdropURL = `https://image.tmdb.org/t/p/original${featured.backdrop_path}`;
    const year = featured.release_date?.split("-")[0];
    const genres = featured.genre_ids
        .slice(0, 2)
        .map((id) => GENRE_MAP[id])
        .filter(Boolean);

    return (
        <div
            className="relative min-h-screen bg-center bg-cover"
            style={{ backgroundImage: `url("${backdropURL}")` }}
        >
            {/* Cinematic layered overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090F] via-[#09090F]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090F]/80 via-[#09090F]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-5 md:px-10 lg:px-14 pt-[72px]">
                {/* Genre + year pills */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#9B51E0]/80 text-white backdrop-blur-sm">
                        Trending
                    </span>
                    {genres.map((g) => (
                        <span
                            key={g}
                            className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10"
                        >
                            {g}
                        </span>
                    ))}
                    {year && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/10">
                            {year}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1
                    className="mb-4 font-bold leading-none tracking-tight text-white"
                    style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
                >
                    {featured.title}
                </h1>

                {/* Description */}
                <p className="max-w-lg text-sm leading-relaxed text-white/60 md:text-base mb-7 line-clamp-3">
                    {featured.overview}
                </p>

                {/* Buttons */}
                <div className="flex flex-row items-center gap-3">
                    <button
                        className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
                        onClick={goToDetails}
                    >
                        <img src={playIcon} alt="" className="h-5" />
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
