"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/bongda/sw.js").catch(() => {
        // ignore registration errors
      });
    }
  }, []);

  return null;
}
