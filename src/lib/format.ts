const regionNames = safeDisplayNames("region");
const languageNames = safeDisplayNames("language");

function safeDisplayNames(type: "region" | "language") {
  try {
    return new Intl.DisplayNames(["en"], { type });
  } catch {
    return null;
  }
}

export const countryName = (code?: string) => (code ? regionNames?.of(code) ?? code : undefined);

export const languageName = (code?: string) => (code ? languageNames?.of(code) ?? code : undefined);

/** 139 → "2h 19m" */
export function runtime(minutes?: number | null) {
  if (!minutes) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

export function longDate(iso?: string | null) {
  if (!iso) return undefined;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ageOn(birthday?: string | null, until?: string | null) {
  if (!birthday) return undefined;
  const b = new Date(`${birthday}T00:00:00`);
  const e = until ? new Date(`${until}T00:00:00`) : new Date();
  let age = e.getFullYear() - b.getFullYear();
  const m = e.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && e.getDate() < b.getDate())) age--;
  return age;
}

export const score = (v?: number) => (v ? v.toFixed(1) : undefined);

export function compact(n?: number) {
  if (!n) return undefined;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function money(n?: number) {
  if (!n) return undefined;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
