import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useStickyState<T>(defaultValue: T, key: string) {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as [T, Dispatch<SetStateAction<T>>];
}

export default useStickyState;
