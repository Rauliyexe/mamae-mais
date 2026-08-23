import { useState, useEffect } from "react";

/**
 * Custom hook that syncs React state with localStorage.
 * Falls back to defaultValue if key doesn't exist or JSON.parse fails.
 */
export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to parse key "${key}":`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[useLocalStorage] Failed to write key "${key}":`, e);
    }
  }, [key, value]);

  return [value, setValue];
}
