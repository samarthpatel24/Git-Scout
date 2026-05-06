"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FilterIcon({ visible }: { visible: boolean }) {
  const base = "transition-all duration-700 ease-out";
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
      {/* Filter funnel */}
      <path
        d="M40 30 L160 30 L115 80 L115 130 L85 140 L85 80 Z"
        className={`${base} ${visible ? "opacity-100" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "200ms" }}
        stroke="#FF6B50"
        strokeWidth="2"
        fill="#FF6B50"
        fillOpacity="0.08"
      />
      {/* Floating filter tags */}
      {[
        { x: 30, y: 15, label: "Python", delay: "400ms", color: "#10b981" },
        { x: 110, y: 8, label: "★ 1k+", delay: "550ms", color: "#f59e0b" },
        { x: 70, y: 148, label: "MIT", delay: "700ms", color: "#8b5cf6" },
      ].map((tag) => (
        <g
          key={tag.label}
          className={`${base} ${visible ? "opacity-100" : "opacity-0 scale-75"}`}
          style={{ transitionDelay: tag.delay, transformOrigin: `${tag.x + 20}px ${tag.y + 10}px` }}
        >
          <rect x={tag.x} y={tag.y} width="50" height="20" rx="10" fill={tag.color} fillOpacity="0.15" stroke={tag.color} strokeWidth="1" />
          <text x={tag.x + 25} y={tag.y + 13} textAnchor="middle" fill={tag.color} fontSize="8" fontWeight="bold" fontFamily="monospace">{tag.label}</text>
        </g>
      ))}
      {/* Dots flowing through */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={100}
          cy={50 + i * 25}
          r="3"
          fill="#FF6B50"
          className={`${base} ${visible ? "opacity-60" : "opacity-0"}`}
          style={{ transitionDelay: `${800 + i * 150}ms` }}
        />
      ))}
    </svg>
  );
}

function ScoreIcon({ visible }: { visible: boolean }) {
  const base = "transition-all duration-700 ease-out";
  const bars = [
    { h: 50, color: "#10b981", label: "H", delay: "300ms" },
    { h: 70, color: "#3b82f6", label: "F", delay: "450ms" },
    { h: 40, color: "#f59e0b", label: "M", delay: "600ms" },
    { h: 85, color: "#FF6B50", label: "T", delay: "750ms" },
  ];
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
      {/* Score bars */}
      {bars.map((bar, i) => {
        const x = 30 + i * 40;
        return (
          <g key={bar.label}>
            <rect
              x={x}
              y={visible ? 130 - bar.h : 130}
              width="24"
              height={visible ? bar.h : 0}
              rx="4"
              fill={bar.color}
              fillOpacity="0.2"
              stroke={bar.color}
              strokeWidth="1.5"
              className={`${base}`}
              style={{ transitionDelay: bar.delay }}
            />
            <text
              x={x + 12}
              y="145"
              textAnchor="middle"
              fill="#666666"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
              className={`${base} ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: bar.delay }}
            >
              {bar.label}
            </text>
            {/* Score value */}
            <text
              x={x + 12}
              y={visible ? 125 - bar.h : 125}
              textAnchor="middle"
              fill={bar.color}
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
              className={`${base} ${visible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: `${parseInt(bar.delay) + 200}ms` }}
            >
              {bar.h}
            </text>
          </g>
        );
      })}
      {/* Sparkle */}
      <circle
        cx="170" cy="25" r="6"
        fill="#FF6B50"
        fillOpacity={visible ? 0.3 : 0}
        className={base}
        style={{ transitionDelay: "900ms" }}
      />
      <circle
        cx="170" cy="25" r="2"
        fill="#FF6B50"
        className={`${base} ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "900ms" }}
      />
    </svg>
  );
}

function ContributeIcon({ visible }: { visible: boolean }) {
  const base = "transition-all duration-700 ease-out";
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" fill="none">
      {/* Git branch lines */}
      <path
        d="M60 20 L60 90 Q60 110 80 110 L140 110"
        stroke="#444444"
        strokeWidth="2"
        strokeDasharray="4 4"
        className={`${base} ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "200ms" }}
      />
      <path
        d="M60 50 Q60 70 80 70 L120 70"
        stroke="#FF6B50"
        strokeWidth="2"
        className={`${base} ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "400ms" }}
      />
      {/* Commit dots */}
      {[
        { cx: 60, cy: 20, color: "#666666", delay: "300ms" },
        { cx: 60, cy: 50, color: "#FF6B50", delay: "450ms" },
        { cx: 120, cy: 70, color: "#FF6B50", delay: "600ms" },
        { cx: 60, cy: 90, color: "#666666", delay: "500ms" },
        { cx: 140, cy: 110, color: "#10b981", delay: "700ms" },
      ].map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="6"
          fill={dot.color}
          fillOpacity="0.2"
          stroke={dot.color}
          strokeWidth="2"
          className={`${base} ${visible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
          style={{ transitionDelay: dot.delay, transformOrigin: `${dot.cx}px ${dot.cy}px` }}
        />
      ))}
      {/* PR merge badge */}
      <g
        className={`${base} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        style={{ transitionDelay: "800ms" }}
      >
        <rect x="100" y="25" width="80" height="24" rx="12" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="1" />
        <text x="140" y="40" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">PR MERGED</text>
      </g>
      {/* Good first issue badge */}
      <g
        className={`${base} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        style={{ transitionDelay: "950ms" }}
      >
        <rect x="80" y="125" width="100" height="24" rx="12" fill="#3b82f6" fillOpacity="0.12" stroke="#3b82f6" strokeWidth="1" />
        <text x="130" y="140" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="bold" fontFamily="monospace">GOOD FIRST ISSUE</text>
      </g>
    </svg>
  );
}

const STEPS = [
  {
    step: "1",
    title: "Set your filters",
    desc: "Pick your language, star range, domain, maturity level. Use presets for quick discovery or build your own filter combo.",
    Icon: FilterIcon,
  },
  {
    step: "2",
    title: "Browse scored repos",
    desc: "Every repo is scored on health, contribution friendliness, maturity, and trending momentum. No more guessing.",
    Icon: ScoreIcon,
  },
  {
    step: "3",
    title: "Start contributing",
    desc: "Find repos with good first issues, responsive maintainers, and high merge rates. Jump straight to the contribution guide.",
    Icon: ContributeIcon,
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const { ref, visible } = useInView(0.25);

  return (
    <div ref={ref} className="relative flex items-stretch gap-8">
      {/* Timeline */}
      <div className="hidden md:flex flex-col items-center shrink-0 w-8">
        <div
          className={`w-3 h-3 rounded-full border-2 border-[#FF6B50] transition-all duration-500 ${visible ? "bg-[#FF6B50] scale-100" : "bg-transparent scale-75"}`}
          style={{ transitionDelay: `${index * 200}ms` }}
        />
        {index < STEPS.length - 1 && (
          <div className={`w-px flex-1 transition-all duration-700 ${visible ? "bg-[#333333]" : "bg-transparent"}`}
            style={{ transitionDelay: `${index * 200 + 300}ms` }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-[1.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center transition-all duration-700 hover:border-[#2a2a2a] hover:bg-[#0e0e0e] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        {/* Illustration */}
        <div className="w-full md:w-[240px] h-[160px] shrink-0 bg-[#111111] rounded-xl border border-[#1a1a1a] p-4">
          <step.Icon visible={visible} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            {step.title}
          </h3>
          <p className="text-sm text-[#777777] leading-relaxed">
            {step.desc}
          </p>
        </div>

        {/* Big number */}
        <div
          className={`hidden md:block text-[7rem] font-black leading-none select-none shrink-0 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
          style={{
            transitionDelay: `${index * 200 + 400}ms`,
            color: "rgba(255, 107, 80, 0.2)",
          }}
        >
          {step.step}
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="space-y-6">
      {STEPS.map((step, i) => (
        <StepCard key={step.step} step={step} index={i} />
      ))}
    </div>
  );
}
