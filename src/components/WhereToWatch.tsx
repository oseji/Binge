import { useMemo, useState } from "react";
import { countryName } from "../lib/format";
import { detectRegion, logo, ProviderRegion, uniqueProviders as unique } from "../lib/tmdb";
import Icon from "./Icon";
import Img from "./Img";

type Props = { results?: Record<string, ProviderRegion>; title: string };

export default function WhereToWatch({ results = {}, title }: Props) {
  const regions = useMemo(
    () => Object.keys(results).sort((a, b) => (countryName(a) ?? a).localeCompare(countryName(b) ?? b)),
    [results]
  );
  const detected = detectRegion();
  const [region, setRegion] = useState(() => (results[detected] || !results.US ? detected : "US"));
  const data = results[region];

  const groups = [
    { label: "Stream", list: unique([...(data?.flatrate ?? []), ...(data?.free ?? []), ...(data?.ads ?? [])]) },
    { label: "Rent", list: unique(data?.rent ?? []) },
    { label: "Buy", list: unique(data?.buy ?? []) },
  ].filter((g) => g.list.length);

  return (
    <section aria-labelledby="watch-heading">
      <div className="strand-rule" />
      <div className="flex items-center justify-between gap-3 pt-4 pb-5">
        <h2 id="watch-heading" className="t-credit">
          Where to watch
        </h2>
        {regions.length > 0 && (
          <label className="relative inline-flex items-center">
            <span className="sr-only">Country</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="appearance-none bg-ink-1 border border-rule-strong rounded pl-3 pr-8 py-2 text-sm text-paper hover:border-paper focus:outline-none focus:border-signal max-w-[11rem] truncate"
            >
              {!results[region] && <option value={region}>{countryName(region)}</option>}
              {regions.map((r) => (
                <option key={r} value={r}>
                  {countryName(r)}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} className="absolute right-2.5 pointer-events-none text-paper-muted" />
          </label>
        )}
      </div>

      {groups.length ? (
        <div className="flex flex-col gap-5">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="t-micro text-paper-subtle mb-2.5">{g.label}</p>
              <ul className="flex flex-wrap gap-2">
                {g.list.slice(0, 8).map((p) => (
                  <li key={p.provider_id}>
                    <Img src={logo(p.logo_path)} alt={p.provider_name} title={p.provider_name} className="w-11 h-11 rounded object-cover bg-ink-2" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-paper-muted text-sm">
          {title} isn't streaming, for rent or for sale in {countryName(region) ?? "your country"} right now.
        </p>
      )}

      <p className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-rule">
        <span className="t-micro text-paper-subtle">Availability by JustWatch</span>
        {data?.link && (
          <a href={data.link} target="_blank" rel="noreferrer" className="link-arrow t-micro text-paper py-1">
            All options <Icon name="arrowRight" size={14} />
          </a>
        )}
      </p>
    </section>
  );
}
