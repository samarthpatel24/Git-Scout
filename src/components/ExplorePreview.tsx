"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEFAULT_FILTERS, Filters, Repository } from "@/types";
import { MOCK_REPOS } from "@/lib/mock-data";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { RepoModal } from "@/components/RepoModal";

const PREVIEW_REPOS = MOCK_REPOS.slice(0, 3);

export function ExplorePreview() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const filteredRepos = useMemo(
    () => filterRepos(PREVIEW_REPOS, filters),
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
      {/* Search + Presets */}
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

      <div className="mb-8">
        <FilterPresets
          activePreset={activePreset}
          onSelect={handlePresetSelect}
        />
      </div>

      {/* Demo repos */}
      <div className="space-y-3">
        {filteredRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onClick={() => setSelectedRepo(repo)}
          />
        ))}
        {filteredRepos.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-[#111111] border border-[#222222]">
            <div className="text-3xl font-bold tracking-tighter text-white mb-2">
              Nothing here.
            </div>
            <p className="text-[#666666] text-sm mt-2">
              Try a different preset or reset filters.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/explore"
          className="inline-block px-10 py-4 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-bold text-sm tracking-wide uppercase rounded-xl transition-all"
        >
          Explore All Repositories →
        </Link>
        <p className="text-[#555555] text-xs mt-3">
          Full filtering with 15+ options, all repos, and detailed scores.
        </p>
      </div>

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
