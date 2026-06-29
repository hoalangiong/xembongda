"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
      className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white dark:hover:bg-gray-700"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
