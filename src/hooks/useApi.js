/**
 * useApi — thin wrapper around an async API function.
 * Handles loading, error, cancellation (AbortController via ignore flag),
 * and prevents state updates on unmounted components.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(apiGetDashboardStats);
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, params = null, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const mountedRef             = useRef(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = params !== null ? await apiFn(params) : await apiFn();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong.';
        setError(msg);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFn, params, ...deps]);

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => { mountedRef.current = false; };
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
