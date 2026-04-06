import { useState, useEffect, useCallback } from 'react';
import type { User, UserData, QuizResult } from '@/types';

const STORAGE_KEY = 'dota2-role-finder-user';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: UserData = JSON.parse(stored);
        setUser(data.user);
        setResults(data.results || []);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && user) {
      const data: UserData = { user, results };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [user, results, isLoaded]);

  const createUser = useCallback((name: string): User => {
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    setUser(newUser);
    setResults([]);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setResults([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addResult = useCallback((result: QuizResult) => {
    setResults((prev) => [...prev, result]);
  }, []);

  const getLastPositionResult = useCallback((): QuizResult | null => {
    const positionResults = results.filter(
      (r): r is Extract<QuizResult, { type: 'position_quiz' }> =>
        r.type === 'position_quiz'
    );
    return positionResults.length > 0
      ? positionResults[positionResults.length - 1]
      : null;
  }, [results]);

  const getLastHeroResult = useCallback(
    (positionIndex?: number): QuizResult | null => {
      const heroResults = results.filter(
        (r): r is Extract<QuizResult, { type: 'hero_quiz' }> =>
          r.type === 'hero_quiz' &&
          (positionIndex === undefined || r.heroPositionIndex === positionIndex)
      );
      return heroResults.length > 0
        ? heroResults[heroResults.length - 1]
        : null;
    },
    [results]
  );

  return {
    user,
    results,
    isLoaded,
    createUser,
    logout,
    addResult,
    getLastPositionResult,
    getLastHeroResult,
  };
}
