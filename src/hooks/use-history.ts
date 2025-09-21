import { useState, useCallback, useEffect } from 'react';
import { db, auth } from '@/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { HistoryRequest } from '@/types/history.type';

export function useHistory() {
  const [history, setHistory] = useState<HistoryRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadHistory = useCallback(async () => {
    if (!userId) {
      setError('Error: Sign in to have access to history, loadhistory error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const ref = collection(db, 'users', userId, 'history');
      const q = query(ref, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HistoryRequest, 'id'>),
      }));
      setHistory(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError('Failed to load history, unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveHistory = useCallback(
    async (request: Omit<HistoryRequest, 'id'>) => {
      if (!userId) {
        setError('Error: Sign in to have access to history, saveHistory error');
        return;
      }
      try {
        const ref = collection(db, 'users', userId, 'history');
        await addDoc(ref, {
          ...request,
          timestamp: request.timestamp || new Date().toISOString(),
        });
        await loadHistory();
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message);
        else setError('Failed to save history, unknown error');
      }
    },
    [loadHistory, userId]
  );

  return {
    history,
    loading,
    error,
    loadHistory,
    authLoading,
    saveHistory,
    userId,
  };
}
