"use client";

import { useState, useEffect } from "react";

export function TypewriterHero() {
  const text = "/GitScout";
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [showDot, setShowDot] = useState(false);
  const [dotBlink, setDotBlink] = useState(true);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function typeNext() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        const delay = i === 1 ? 200 : 80 + Math.random() * 60;
        timeout = setTimeout(typeNext, delay);
      } else {
        setTyping(false);
        setTimeout(() => setShowDot(true), 300);
      }
    }

    timeout = setTimeout(typeNext, 600);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showDot) return;
    const interval = setInterval(() => setDotBlink((b) => !b), 530);
    return () => clearInterval(interval);
  }, [showDot]);

  return (
    <h1 className="text-[12vw] md:text-[10vw] font-bold text-white leading-[0.9] tracking-[-0.05em]">
      {displayed}
      {showDot && (
        <span
          className="inline-block w-[0.08em] h-[0.08em] bg-white ml-[0.06em] mb-[0.08em] align-baseline transition-opacity duration-100"
          style={{ opacity: dotBlink ? 1 : 0.15 }}
        />
      )}
    </h1>
  );
}
