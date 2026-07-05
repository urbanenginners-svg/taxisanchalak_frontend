import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { AxiosResponse } from 'axios';
import { getErrorMessage } from '../api/client';
import type { PaginatedResponse } from '../types';

/**
 * Shared data-fetching behaviour for every paginated list screen in the app:
 * initial load, pull-to-refresh, infinite scroll and error handling —
 * all built on top of the existing paginated REST endpoints (no API changes).
 */
export function usePaginatedList<T>(fetchPage: (page: number) => Promise<AxiosResponse<PaginatedResponse<T>>>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageRef = useRef(1);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    setError(null);
    try {
      const res = await fetchRef.current(1);
      pageRef.current = 1;
      setItems(res.data.data);
      setHasNextPage(res.data.meta.hasNextPage);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load({ silent: true });
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    try {
      const next = pageRef.current + 1;
      const res = await fetchRef.current(next);
      pageRef.current = next;
      setItems((prev) => [...prev, ...res.data.data]);
      setHasNextPage(res.data.meta.hasNextPage);
    } catch {
      // Pagination failures fail silently — the user still has the current page.
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, loadingMore]);

  useFocusEffect(
    useCallback(() => {
      load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return { items, setItems, loading, refreshing, loadingMore, error, hasNextPage, load, refresh, loadMore };
}
