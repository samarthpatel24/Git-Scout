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
import { RotateCcw, Compass } from "lucide-react";

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
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-3/5 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-3 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                GitScout
              </h1>
            </div>
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters({ ...filters, search })}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
          <div className="mt-4">
            <FilterPresets
              activePreset={activePreset}
              onSelect={handlePresetSelect}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-6 gap-8">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">
                {filteredRepos.length}
              </span>{" "}
              repositories found
            </p>
          </div>

          <div className="space-y-3">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
            {filteredRepos.length === 0 && (
              <div className="text-center py-20 rounded-xl border border-border/50 bg-card/30">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Compass className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-foreground text-lg font-medium">
                  No repositories match your filters
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Try adjusting your filters or selecting a different preset.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5"
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
