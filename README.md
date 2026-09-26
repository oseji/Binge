# Binge

A film and series discovery app built with React and TypeScript, on live data from TMDB. It plays trailers, never films, and it's honest about that.

Live: https://binge-beta.vercel.app

## What it does

- **Home**: a title sequence over this week's most-watched film. Point at any trending poster and the screen recuts to that film's still.
- **Browse**: Movies and Series pages organised as strands (In cinemas, Coming soon, Top rated, On air this week...), each with a full "See all" grid, plus browsing by genre with sorting.
- **Search**: results update as you type, with filters for films, series and people. The query lives in the URL, so searches can be shared. Press `/` on any page to jump to it.
- **Title pages**: cast and crew, the official trailer, where it's streaming, renting or on sale in your country (switchable), seasons for series, and "More like this". Every name and genre links onward.
- **People pages**: biography, best-known work and a full filmography filterable by department.
- **My List**: save any title with a free account (or the guest login). The list follows you across devices.
- **Pricing, as a concept**: a design exploration. Nothing is for sale; everything on Binge is free.

## Motion

Route changes run as View Transitions: the poster you click travels into the title page and back, and stills dissolve from page to page. Rows deal in as they arrive, the home hero opens like a projector shutter, and the footer wordmark rises with the scroll. Everything has a `prefers-reduced-motion` path that keeps state changes but drops the movement.

## Tech stack

- React 18 + TypeScript (Vite), React Router v5
- Tailwind CSS with a small token set (`tailwind.config.js`, `src/index.css`)
- GSAP for the hero sequence, the Web Animations API and CSS for everything else
- Firebase Auth + Firestore for accounts and My List
- TMDB API for all catalogue data; JustWatch (via TMDB) for streaming availability

## Getting started

```bash
npm install
npm run dev
```

Create a `.env` with `VITE_TMDB_API_KEY` (a TMDB v4 read access token) and, optionally, `VITE_YOUTUBE_API_KEY` for the trailer fallback used when TMDB has no video for a title.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming availability is provided by JustWatch.
