import { useEffect, useState } from "react";

interface AsyncState<T> {
  data?: T;
  loading: boolean;
  error?: unknown;
}

/** 간단한 비동기 데이터 로딩 훅 (마운트/deps 변경 시 재실행) */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ loading: true });

  useEffect(() => {
    let active = true;
    setState({ loading: true });
    fn()
      .then((data) => active && setState({ data, loading: false }))
      .catch((error) => active && setState({ error, loading: false }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
