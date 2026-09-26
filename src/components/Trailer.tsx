import { useState } from "react";
import Icon from "./Icon";

type Props = { videoKey: string; title: string; name?: string };

/**
 * Click-to-load YouTube player. The iframe (and YouTube's ~1MB of script) only
 * arrives when someone actually wants to watch, and it uses the no-cookie domain.
 */
export default function Trailer({ videoKey, title, name }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video bg-ink-1 overflow-hidden">
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
          title={`${title}: ${name ?? "trailer"}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="trailer-cover group absolute inset-0 w-full h-full text-left">
          <img
            src={`https://i.ytimg.com/vi/${videoKey}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-0/90 via-ink-0/20 to-transparent" />
          <span className="absolute left-5 bottom-5 right-5 flex items-center gap-4">
            <span className="play-disc flex items-center justify-center w-14 h-14 rounded-full bg-paper text-ink-0 flex-shrink-0">
              <Icon name="play" size={22} />
            </span>
            <span>
              <span className="t-credit text-paper block">Play trailer</span>
              {name && <span className="text-sm text-paper-muted line-clamp-1">{name}</span>}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
