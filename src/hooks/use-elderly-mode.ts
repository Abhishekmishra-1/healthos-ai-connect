import { useEffect, useState } from "react";

const KEY = "medoogle:elderly";

export function useElderlyMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) === "1";
      setOn(v);
      document.documentElement.classList.toggle("elderly", v);
    } catch {}
  }, []);

  function toggle(v?: boolean) {
    const next = typeof v === "boolean" ? v : !on;
    setOn(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
      document.documentElement.classList.toggle("elderly", next);
    } catch {}
  }

  return { on, toggle };
}