import { useCallback, useEffect, useState } from "react";
import { peek, tmdb } from "../lib/tmdb";

type Params = Record<string, string | number | undefined>;

type State<T> = { data?: T; error?: Error; loading: boolean };

/**
 * Cached TMDB request. Starts from the cache synchronously when the response is
 * already known, so revisiting a page renders complete on the first frame.
 * Pass `null` as the path to skip the request.
 */
export function useTmdb<T>(path: string | null, params?: Params) {
  const paramsKey = JSON.stringify(params ?? {});
  const read = useCallback(
    (): State<T> => {
      const cached = path ? peek<T>(path, params) : undefined;
      return { data: cached, loading: !!path && !cached };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, paramsKey]
  );

  const [state, setState] = useState<State<T>>(read);
  const [attempt, setAttempt] = useState(0);

  // Reset synchronously when the key changes, so stale data never flashes under a new title
  const [lastKey, setLastKey] = useState(`${path}${paramsKey}`);
  if (lastKey !== `${path}${paramsKey}`) {
    setLastKey(`${path}${paramsKey}`);
    setState(read());
  }

  useEffect(() => {
    if (!path) return;
    let live = true;
    if (!peek<T>(path, params)) setState((s) => ({ ...s, loading: true, error: undefined }));
    tmdb<T>(path, params)
      .then((data) => live && setState({ data, loading: false }))
      .catch((error: Error) => live && setState({ error, loading: false }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, paramsKey, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}
