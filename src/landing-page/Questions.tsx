import { useState } from "react";
import Icon from "../components/Icon";

const faqs = [
  {
    q: "How does Binge work?",
    a: "Binge is a discovery app for films and series. Browse this week's programme, search by title or by person, open any title for its cast, trailer, where it's streaming and what to watch next, then save what you like to My List.",
  },
  {
    q: "Is Binge free?",
    a: "Yes, all of it. Browsing, search, trailers and where-to-watch work without an account, and a free account adds My List. The pricing section is a design concept only; there is nothing to pay.",
  },
  {
    q: "Can I watch films on Binge?",
    a: "No. Binge plays trailers, not films. Each title page lists where it's streaming, renting or on sale in your country, with a link out to the full list of services.",
  },
  {
    q: "How do I save something for later?",
    a: "Open any title and choose Save to My List. Your list is stored with your account, so it's there on any device you sign in on. There's a guest login if you'd rather not register.",
  },
  {
    q: "Where does the data come from?",
    a: "Titles, artwork, cast and details come from The Movie Database (TMDB). Streaming availability comes from JustWatch through TMDB, and trailers play from YouTube. Binge uses the TMDB API but is not endorsed or certified by TMDB.",
  },
];

export default function Questions() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="wrap pt-[var(--section-y)] scroll-mt-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 id="faq-heading" className="t-title lg:col-span-4 lg:sticky lg:top-24 self-start">
          Questions
        </h2>

        <div className="lg:col-span-8 border-t-[3px] border-paper">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="faq-q w-full flex items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="t-head">{faq.q}</span>
                    <span className="faq-icon flex-shrink-0 w-9 h-9 rounded-full border border-rule-strong flex items-center justify-center" data-open={isOpen}>
                      <Icon name="plus" size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-a" data-open={isOpen} {...(isOpen ? {} : { inert: "" })}>
                  <div className="overflow-hidden">
                    <p className="text-paper-muted leading-relaxed pb-6 pr-14 max-w-[68ch]">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
