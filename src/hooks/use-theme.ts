import { useEffect, useState } from "react";

const KEY = "medoogle:theme";
export type Theme = "light" | "dark";

function apply(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.style.colorScheme = t;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let t: Theme = "light";
    try {
      const saved = localStorage.getItem(KEY) as Theme | null;
      t = saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {}
    setTheme(t);
    apply(t);
  }, []);

  function setAndStore(next: Theme) {
    setTheme(next);
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }

  return { theme, isDark: theme === "dark", toggle: () => setAndStore(theme === "dark" ? "light" : "dark"), setTheme: setAndStore };
}
