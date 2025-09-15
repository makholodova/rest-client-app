import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearVariables,
  loadVariables,
  saveVariables,
  Variables,
} from '@/utils/variables';

export function useVariables() {
  const [variables, setVariables] = useState<Variables>({});

  useEffect(() => {
    setVariables(loadVariables());
  }, []);

  const add = useCallback((key: string, value: string) => {
    const trimmedKey = key.trim();
    if (!trimmedKey) return false;

    setVariables((prev) => {
      const updated = { ...prev, [trimmedKey]: value };
      saveVariables(updated);
      return updated;
    });

    return true;
  }, []);

  const remove = useCallback((key: string) => {
    let removed = false;
    setVariables((prev) => {
      if (!(key in prev)) return prev;

      const rest = Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== key)
      );

      removed = true;
      saveVariables(rest);
      return rest;
    });
    return removed;
  }, []);

  const clear = useCallback(() => {
    clearVariables();
    setVariables({});
  }, []);

  const get = useCallback((key: string) => variables[key], [variables]);

  const entries = useMemo(() => Object.entries(variables), [variables]);
  const has = entries.length > 0;

  return { variables, get, entries, has, add, remove, clear };
}
