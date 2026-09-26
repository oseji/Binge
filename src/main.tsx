import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App.tsx";
import { WatchlistProvider } from "./hooks/useWatchlist.tsx";
import { history } from "./lib/history.ts";
import { tmdb } from "./lib/tmdb.ts";
import { store } from "./redux/store.ts";
import "./index.css";

// Start the hero's data while Firebase restores the session
tmdb("/trending/all/week").catch(() => {});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router history={history as never}>
      <Provider store={store}>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </Provider>
    </Router>
  </StrictMode>
);
