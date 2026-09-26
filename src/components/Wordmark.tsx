type Props = { className?: string };

/** The widescreen frame plus the name, set in the display cut */
export default function Wordmark({ className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="relative block w-[1.45em] h-[1.02em] rounded-sm bg-ink-0 ring-1 ring-rule-strong">
        <span className="absolute inset-x-[0.12em] top-1/2 -translate-y-1/2 h-[0.6em] bg-signal rounded-[1px]" />
      </span>
      <span className="font-[900] uppercase leading-none tracking-[0.01em]" style={{ fontStretch: "64%" }}>
        Binge
      </span>
    </span>
  );
}
