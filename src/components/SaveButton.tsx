import { Link, useLocation } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";
import type { MediaType } from "../lib/tmdb";
import Icon from "./Icon";

type Props = { type: MediaType; id: number; title: string; className?: string };

export default function SaveButton({ type, id, title, className = "btn btn-ghost" }: Props) {
  const { user, authReady, has, isBusy, toggle } = useWatchlist();
  const { pathname } = useLocation();

  if (!authReady) return <span className={`${className} invisible`} aria-hidden="true">Save</span>;

  if (!user) {
    return (
      <Link to={`/LoginPage?next=${encodeURIComponent(pathname)}`} className={className}>
        <Icon name="bookmark" size={18} />
        Log in to save
      </Link>
    );
  }

  const saved = has(type, id);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      disabled={isBusy(type, id)}
      onClick={() => toggle(type, id, title)}
    >
      <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={18} className={saved ? "text-signal" : undefined} />
      {saved ? "In My List" : "Save to My List"}
    </button>
  );
}
