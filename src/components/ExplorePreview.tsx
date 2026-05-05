"use client";

import { useState, useMemo } from "react";
import { DEFAULT_FILTERS, Filters } from "@/types";
import { MOCK_REPOS } from "@/lib/mock-data";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { FilterSidebar } from "@/components/FilterSidebar";

export function ExplorePreview() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState("");

  const filteredRepos = useMemo(
    () => filterRepos(MOCK_REPOS, filters),
    [filters]
  );

  function handlePresetSelect(name: string, presetFilters: Filters) {
    setActivePreset(name);
    setFilters(presetFilters);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setActivePreset("");
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-6 mb-5">
        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
        />
        <button
          onClick={handleReset}
          className="text-[10px] font-bold text-[#888888] hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <FilterPresets
          activePreset={activePreset}
          onSelect={handlePresetSelect}
        />
      </div>

      {/* Content */}
      <div className="flex gap-8">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              <span className="text-white">{filteredRepos.length}</span>{" "}
              repositories
            </p>
          </div>

          <div className="space-y-3">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
            {filteredRepos.length === 0 && (
              <div className="text-center py-20 rounded-[2rem] bg-[#111111] border border-[#222222]">
                <div className="text-4xl font-bold tracking-tighter text-white mb-2">
                  Nothing here.
                </div>
                <p className="text-[#666666] text-sm mt-2 mb-6">
                  Try adjusting your filters or selecting a different preset.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-bold text-xs tracking-wide uppercase rounded-xl transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
