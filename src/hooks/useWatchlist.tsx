import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { auth, db } from "../firebase-config/firebase";
import { setFalse, setTrue } from "../redux/loginState";
import type { MediaType } from "../lib/tmdb";

export type Saved = { id: number; mediaType: MediaType; addedAt: number };

type WatchlistContext = {
  user: User | null;
  authReady: boolean;
  items: Saved[];
  listReady: boolean;
  listError: boolean;
  has: (type: MediaType, id: number) => boolean;
  isBusy: (type: MediaType, id: number) => boolean;
  toggle: (type: MediaType, id: number, title: string) => Promise<void>;
  reload: () => void;
};

const Ctx = createContext<WatchlistContext | null>(null);

// Existing saves live at users/{email}/LikedContent as { id, liked, mediaType }; kept as-is
const listRef = (user: User) => collection(db, `users/${user.email}/LikedContent`);
const keyOf = (type: MediaType, id: number) => `${type}:${id}`;

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [items, setItems] = useState<Saved[]>([]);
  const [listReady, setListReady] = useState(false);
  const [listError, setListError] = useState(false);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [attempt, setAttempt] = useState(0);

  // Firebase persists the session; mirror it into Redux so older components stay in sync
  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        dispatch(u ? setTrue() : setFalse());
        setAuthReady(true);
      }),
    [dispatch]
  );

  useEffect(() => {
    setItems([]);
    setListError(false);
    if (!user) {
      setListReady(true);
      return;
    }
    let live = true;
    setListReady(false);
    getDocs(listRef(user))
      .then((snap) => {
        if (!live) return;
        const seen = new Set<string>();
        const next: Saved[] = [];
        snap.docs.forEach((d, i) => {
          const data = d.data();
          const type: MediaType = data.mediaType === "tv" ? "tv" : "movie";
          const k = keyOf(type, data.id);
          if (seen.has(k)) return;
          seen.add(k);
          // Older saves have no timestamp; keep their stored order
          next.push({ id: data.id, mediaType: type, addedAt: data.addedAt?.toMillis?.() ?? i });
        });
        setItems(next.sort((a, b) => b.addedAt - a.addedAt));
      })
      .catch(() => live && setListError(true))
      .finally(() => live && setListReady(true));
    return () => {
      live = false;
    };
  }, [user, attempt]);

  const has = useCallback((type: MediaType, id: number) => items.some((s) => s.mediaType === type && s.id === id), [items]);
  const isBusy = useCallback((type: MediaType, id: number) => busy.has(keyOf(type, id)), [busy]);

  const toggle = useCallback(
    async (type: MediaType, id: number, title: string) => {
      if (!user) return;
      const k = keyOf(type, id);
      if (busy.has(k)) return;
      const saved = items.some((s) => s.mediaType === type && s.id === id);
      const previous = items;

      // Optimistic: the button answers immediately, Firestore catches up
      setItems(saved ? items.filter((s) => keyOf(s.mediaType, s.id) !== k) : [{ id, mediaType: type, addedAt: Date.now() }, ...items]);
      setBusy((b) => new Set(b).add(k));

      try {
        if (saved) {
          const snap = await getDocs(query(listRef(user), where("id", "==", id)));
          await Promise.all(snap.docs.filter((d) => (d.data().mediaType ?? "movie") === type).map((d) => deleteDoc(d.ref)));
          toast.success(`Removed ${title} from My List`);
        } else {
          await addDoc(listRef(user), { id, liked: true, mediaType: type, addedAt: serverTimestamp() });
          toast.success(`Saved ${title} to My List`);
        }
      } catch {
        setItems(previous);
        toast.error(saved ? `Couldn't remove ${title}. Try again.` : `Couldn't save ${title}. Try again.`);
      } finally {
        setBusy((b) => {
          const next = new Set(b);
          next.delete(k);
          return next;
        });
      }
    },
    [user, items, busy]
  );

  const reload = useCallback(() => setAttempt((a) => a + 1), []);

  const value = useMemo(
    () => ({ user, authReady, items, listReady, listError, has, isBusy, toggle, reload }),
    [user, authReady, items, listReady, listError, has, isBusy, toggle, reload]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWatchlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}
