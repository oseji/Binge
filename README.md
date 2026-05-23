# Binge

A Netflix-inspired streaming platform frontend built with React and TypeScript.

## What it does

Binge lets users browse, search, and manage a watchlist of movies and TV series. Unauthenticated visitors see a marketing landing page; authenticated users get a personalised home feed, browsing pages, and a saved list.

## Features

- **Landing page** — hero section, feature highlights, pricing plans, and FAQ, all animated with GSAP scroll triggers
- **Authentication** — sign up, log in, and password reset via Firebase Auth (email/password and Google)
- **Movies & Series** — dedicated browsing pages with category filtering
- **Search** — real-time search across movies and series
- **Detail view** — trailer playback and full media info
- **My List** — save and manage favourite titles
- **Subscription plans** — Professional, Premium, and Organisational tiers with Paystack/Flutterwave payment integration

## Tech stack

- React 18 + TypeScript (Vite)
- Redux Toolkit for global auth and UI state
- React Router v5
- Tailwind CSS + MUI
- Firebase (Auth + Firestore)
- GSAP for animations

## Getting started

```bash
npm install
npm run dev
```

Set up a `.env` file with your Firebase and payment gateway credentials before running.
