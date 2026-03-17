import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseDataResult<T> extends UseDataState<T> {
  reload: () => Promise<void>;
}

export const useData = <T,>(
  fetchFunction: () => Promise<T>,
  deps: readonly unknown[] = []
): UseDataResult<T> => {
  const [state, setState] = useState<UseDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const fetchRef = useRef(fetchFunction);

  useEffect(() => {
    fetchRef.current = fetchFunction;
  }, [fetchFunction]);

  const loadData = useCallback(async () => {
    let nextData: T | null = null;
    let nextError: string | null = null;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      nextData = await fetchRef.current();
    } catch (err) {
      nextError = err instanceof Error ? err.message : 'An error occurred';
    }

    setState({
      data: nextData,
      loading: false,
      error: nextError,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fetchRef.current();
        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'An error occurred',
          });
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, deps);

  return {
    ...state,
    reload: loadData,
  };
};
