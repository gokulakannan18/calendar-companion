import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "system";

export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<Theme>("calendar-theme", "system");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function apply() {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);
      root.classList.toggle("dark", isDark);
    }

    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, [theme]);

  return { theme, setTheme };
}
