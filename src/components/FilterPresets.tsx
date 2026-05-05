"use client";

import { FILTER_PRESETS, DEFAULT_FILTERS, Filters } from "@/types";
import { Button } from "@/components/ui/button";

interface FilterPresetsProps {
  activePreset: string;
  onSelect: (name: string, filters: Filters) => void;
}

export function FilterPresets({ activePreset, onSelect }: FilterPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_PRESETS.map((preset) => (
        <Button
          key={preset.name}
          variant={activePreset === preset.name ? "default" : "outline"}
          size="sm"
          className="text-xs"
          onClick={() =>
            onSelect(
              preset.name === activePreset ? "" : preset.name,
              preset.name === activePreset
                ? DEFAULT_FILTERS
                : { ...DEFAULT_FILTERS, ...preset.filters }
            )
          }
          title={preset.description}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
}
