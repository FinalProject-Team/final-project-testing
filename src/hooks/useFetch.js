import { useState, useEffect, useRef } from "react";

// Generic data-fetching hook with abort on unmount
// TODO: Add retry logic and error boundary integration
export function useFetch(apiFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const cancelledRef          = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setLoading(true);
    setError(null);

    apiFn()
      .then((res) => {
        if (!cancelledRef.current) { setData(res); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelledRef.current) { setError(err.message || "Something went wrong"); setLoading(false); }
      });

    return () => { cancelledRef.current = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
