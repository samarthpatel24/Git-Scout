"use client";

import { FILTER_PRESETS, DEFAULT_FILTERS, Filters } from "@/types";
import { Button } from "@/components/ui/button";
import { Flame, Heart, Sparkles, Shield, Coffee } from "lucide-react";

const PRESET_ICONS: Record<string, React.ReactNode> = {
  "Hot Today": <Flame className="w-3 h-3" />,
  "Beginner Friendly": <Heart className="w-3 h-3" />,
  "Hidden Gems": <Sparkles className="w-3 h-3" />,
  "Production Ready": <Shield className="w-3 h-3" />,
  "Weekend Projects": <Coffee className="w-3 h-3" />,
};

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
          <Button
            key={preset.name}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className={`text-xs gap-1.5 transition-all duration-200 ${
              isActive
                ? "bg-primary/90 shadow-md shadow-primary/20"
                : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
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
            {PRESET_ICONS[preset.name]}
            {preset.name}
          </Button>
        );
      })}
    </div>
  );
}
