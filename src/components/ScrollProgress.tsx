"use client";

import { useEffect, useState } from "react";

/** Barre fine (2px) en haut, dont la largeur suit le % de scroll. */
export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setWidth(Number.isFinite(scrolled) ? scrolled : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}
