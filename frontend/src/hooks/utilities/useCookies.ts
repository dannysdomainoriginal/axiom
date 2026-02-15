import { useEffect, useState } from "react";

const getCookie = (key: string) => {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) => row.startsWith(key + "="));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
};

const setCookie = (key: string, value: string, days = 1) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
};

const deleteCookie = (key: string) => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const useCookies = <T>(key: string, initialValue: T, expiryInDays: number) => {
  const [value, setValue] = useState<T>(() => {
    const cookie = getCookie(key);
    return cookie ? JSON.parse(cookie) : initialValue;
  });

  useEffect(() => {
    setCookie(key, JSON.stringify(value), expiryInDays);
  }, [key, value]);

  const remove = () => deleteCookie(key);

  return [value, setValue, remove] as [T, typeof setValue, () => void];
};

export default useCookies;
