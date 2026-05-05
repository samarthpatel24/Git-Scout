"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEFAULT_FILTERS, Filters, Repository } from "@/types";
import { MOCK_REPOS } from "@/lib/mock-data";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { RepoModal } from "@/components/RepoModal";

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

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
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center group gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-extrabold text-lg transition-transform group-hover:rotate-12">
                G.
              </div>
              <span className="text-sm font-bold tracking-tight text-white hidden sm:block">
                GitScout
              </span>
            </Link>
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
          <div className="mt-4">
            <FilterPresets
              activePreset={activePreset}
              onSelect={handlePresetSelect}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-6 py-8 gap-8">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              <span className="text-white">{filteredRepos.length}</span>{" "}
              repositories
            </p>
          </div>

          <div className="space-y-3">
            {filteredRepos.map((repo) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                onClick={() => setSelectedRepo(repo)}
              />
            ))}
            {filteredRepos.length === 0 && (
              <div className="text-center py-24 rounded-[2rem] bg-[#111111] border border-[#222222]">
                <div className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                  Nothing here.
                </div>
                <p className="text-[#666666] text-sm mt-2 mb-8">
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
        </main>
      </div>

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
