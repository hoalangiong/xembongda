"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/utils";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/search?q=${encodeURIComponent(value)}`));
        const data = await res.json();
        setResults(data.data || []);
        setOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Tìm đội bóng..."
        className="w-36 rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-900 placeholder-gray-500 transition focus:w-48 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:w-40 sm:focus:w-56"
      />

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {loading ? (
            <p className="px-4 py-3 text-sm text-gray-500">Đang tìm...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Không tìm thấy.</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto py-1">
              {results.slice(0, 8).map((item: any) => (
                <li key={item.team.id}>
                  <Link
                    href={`/doi/${item.team.id}`}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.team.logo && (
                      <img src={item.team.logo} alt={item.team.name} className="h-6 w-6" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.team.name}</p>
                      <p className="text-xs text-gray-500">{item.team.country}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
