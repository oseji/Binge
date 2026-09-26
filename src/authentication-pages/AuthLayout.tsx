import { ReactNode, useState } from "react";
import Header from "../components/Header";
import Icon from "../components/Icon";
import Img from "../components/Img";
import { useTmdb } from "../hooks/useTmdb";
import { backdrop, MediaItem, Paged } from "../lib/tmdb";

type Props = { title: string; intro?: ReactNode; children: ReactNode };

export default function AuthLayout({ title, intro, children }: Props) {
  const { data } = useTmdb<Paged<MediaItem>>("/trending/movie/week");
  const still = data?.results.find((m) => m.backdrop_path)?.backdrop_path;

  return (
    <>
      <Header />
      <main id="main" className="relative min-h-[100svh] flex items-center justify-center pt-[calc(var(--header-h)+2rem)] pb-12 px-5">
        <div className="still" aria-hidden="true">
          {still && <Img src={backdrop(still, "w1280")} alt="" eager className="opacity-30" />}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-0 via-ink-0/70 to-ink-0/40" />

        <div className="relative w-full max-w-[27rem] bg-ink-0/90 border border-rule-strong rounded backdrop-blur-md shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
          <div className="h-[3px] bg-signal" />
          <div className="p-7 md:p-10">
            <h1 className="t-title !text-[clamp(2.25rem,6vw,3.25rem)]">{title}</h1>
            {intro && <p className="text-paper-muted mt-3">{intro}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="label t-micro">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && reveal ? "text" : type}
          inputMode={type === "email" ? "email" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`field ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            onClick={() => setReveal((r) => !r)}
            className="btn-icon absolute right-0.5 top-1/2 -translate-y-1/2 text-paper-subtle hover:text-paper"
          >
            <Icon name={reveal ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-[#ff8a80] border-t border-[#ff8a80]/40 pt-3 first-letter:uppercase">
      {message}
    </p>
  );
}

/** Only same-site paths are honoured, so ?next can't bounce people off-site */
export function safeNext(search: string) {
  const next = new URLSearchParams(search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
