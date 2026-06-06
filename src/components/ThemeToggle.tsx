import { createSignal, onMount } from "solid-js";

type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function readTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("dark");

  onMount(() => {
    setTheme(readTheme());
  });

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <button
      aria-label="Toggle color theme"
      class="theme-toggle"
      data-theme-toggle
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true">{theme() === "dark" ? "☾" : "☀"}</span>
    </button>
  );
}
