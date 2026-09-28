import { useCallback, useEffect, useRef, useState } from 'react';

export default function useDashboardFeeds(endpoints) {
  const key = JSON.stringify(endpoints);
  const controller = useRef(null);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setLoading(true);
    setData({});
    setErrors({});
    await Promise.allSettled(Object.entries(JSON.parse(key)).map(async ([name, url]) => {
      try {
        const response = await fetch(url, { signal: current.signal });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(typeof body.detail === 'string' ? body.detail : `Request failed (${response.status})`);
        }
        const payload = await response.json();
        if (!current.signal.aborted) setData(previous => ({ ...previous, [name]: payload }));
      } catch (error) {
        if (!current.signal.aborted) setErrors(previous => ({ ...previous, [name]: error.message }));
      }
    }));
    if (!current.signal.aborted) setLoading(false);
  }, [key]);
  useEffect(() => {
    refresh();
    return () => controller.current?.abort();
  }, [refresh]);
  return { data, errors, loading, refresh };
}
