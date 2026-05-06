"use client";

import { useEffect, useRef, useState } from "react";

const TUBE_COLORS = ["#E55F47", "#CC5039", "#E57D64"];
const LIGHT_COLORS = ["#E55F47", "#E53E2B", "#CC5039", "#E59E80"];

function randomColors(count: number) {
  return Array.from({ length: count }, () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  );
}

export function TubesBackground({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!canvasRef.current) return;
      try {
        const cdnUrl = "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";
        const mod = await (Function(`return import("${cdnUrl}")`)() as Promise<any>);
        if (!mounted) return;

        const app = mod.default(canvasRef.current, {
          tubes: {
            colors: TUBE_COLORS,
            lights: { intensity: 180, colors: LIGHT_COLORS },
          },
        });

        tubesRef.current = app;
        setReady(true);
      } catch (e) {
        console.error("TubesBackground failed to load:", e);
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  function handleClick() {
    if (!tubesRef.current) return;
    tubesRef.current.tubes.setColors(randomColors(3));
    tubesRef.current.tubes.setLightsColors(randomColors(4));
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: "none", opacity: 0.90 }}
      />
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}
