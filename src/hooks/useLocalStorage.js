import { useState } from "react";

// Persistent state backed by localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  function setValue(value) {
    try {
      const next = value instanceof Function ? value(storedValue) : value;
      setStoredValue(next);
      localStorage.setItem(key, JSON.stringify(next));
    } catch { /* quota */ }
  }

  return [storedValue, setValue];
}
