"use client";

import { FILTER_PRESETS, DEFAULT_FILTERS, Filters } from "@/types";

interface FilterPresetsProps {
  activePreset: string;
  onSelect: (name: string, filters: Filters) => void;
}

export function FilterPresets({ activePreset, onSelect }: FilterPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_PRESETS.map((preset) => {
        const isActive = activePreset === preset.name;
        return (
          <button
            key={preset.name}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              isActive
                ? "bg-[#FF6B50] text-black"
                : "bg-[#1a1a1a] text-[#888888] border border-[#333333] hover:border-[#FF6B50]/40 hover:text-white"
            }`}
            onClick={() =>
              onSelect(
                isActive ? "" : preset.name,
                isActive
                  ? DEFAULT_FILTERS
                  : { ...DEFAULT_FILTERS, ...preset.filters }
              )
            }
            title={preset.description}
          >
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
