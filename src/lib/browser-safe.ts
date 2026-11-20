/**
 * SSR and Edge-safe browser utilities for Next.js.
 * Guarantees that window, localStorage, and navigator never throw during server-rendering or hydration.
 */

export const isBrowser = (): boolean => typeof window !== "undefined";

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore if storage quota exceeded or disabled in private browsing
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Ignore
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
