"use client";

import { useState, useMemo } from "react";
import { DEFAULT_FILTERS, Filters } from "@/types";
import { MOCK_REPOS } from "@/lib/mock-data";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Home() {
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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              GitScout
            </h1>
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters({ ...filters, search })}
            />
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          <div className="mt-3">
            <FilterPresets
              activePreset={activePreset}
              onSelect={handlePresetSelect}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-6">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-zinc-500">
              {filteredRepos.length} repositories found
            </p>
          </div>

          <div className="space-y-4">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
            {filteredRepos.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-lg">
                  No repositories match your filters.
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Try adjusting your filters or selecting a different preset.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleReset}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
