"use client";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex-1 max-w-xl">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search repositories, topics, or stacks..."
        className="w-full h-10 pl-11 pr-4 rounded-xl bg-[#111111] border border-[#222222] text-sm text-white placeholder-[#555555] outline-none focus:border-[#FF6B50]/40 transition-colors"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
