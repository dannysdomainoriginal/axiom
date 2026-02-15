import { useState, useEffect } from "react";

/**
 * useDebounce
 * Returns a debounced version of a value that updates after the specified delay.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
