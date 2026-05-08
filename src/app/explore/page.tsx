"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { DEFAULT_FILTERS, FILTER_PRESETS, Filters, Repository } from "@/types";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { RepoCardWide } from "@/components/RepoCardWide";
import { RepoModal } from "@/components/RepoModal";
import { Leaderboards } from "@/components/Leaderboards";

const MAX_PAGES = 33;

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  // Custom mode state
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  // Tab mode state
  const [tabRepos, setTabRepos] = useState<Repository[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  const isTabMode = activePreset !== "";

  const buildParams = useCallback((f: Filters, p: number, initialLoad = false) => {
    const params = new URLSearchParams();
    if (f.language) params.set("language", f.language);
    params.set("period", f.timePeriod);
    if (f.starsMin) params.set("starsMin", String(f.starsMin));
    if (f.starsMax) params.set("starsMax", String(f.starsMax));
    if (f.license) params.set("license", f.license);
    params.set("sort", f.sortBy === "forks" ? "forks" : f.sortBy === "stars" ? "stars" : "updated");
    params.set("perPage", initialLoad ? "50" : "30");
    params.set("page", String(p));
    return params;
  }, []);

  const fetchRepos = useCallback(async (f: Filters, initialLoad = false) => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    const perPage = initialLoad ? 50 : 30;
    try {
      const res = await fetch(`/api/repos?${buildParams(f, 1, initialLoad).toString()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setRepos(data.items || []);
      setTotalCount(data.totalCount || 0);
      setHasMore((data.items || []).length >= perPage);
    } catch {
      setRepos([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  const fetchTabRepos = useCallback(async (presetName: string) => {
    setTabLoading(true);
    setTabRepos([]);
    const preset = FILTER_PRESETS.find((p) => p.name === presetName);
    if (!preset) { setTabLoading(false); return; }

    const period = presetName === "Hot Today" ? "daily" : "weekly";
    const brackets = [
      { min: 100, max: 1000, pick: 8 },
      { min: 1000, max: 5000, pick: 10 },
      { min: 5000, max: 15000, pick: 10 },
      { min: 15000, max: 30000, pick: 8 },
      { min: 30000, max: 60000, pick: 7 },
      { min: 60000, max: 100000, pick: 7 },
    ];

    try {
      const fetches = brackets.map(async (b) => {
        const params = new URLSearchParams();
        params.set("period", period);
        params.set("perPage", "30");
        params.set("page", "1");
        params.set("starsMin", String(b.min));
        params.set("starsMax", String(b.max));
        params.set("sort", "updated");
        const res = await fetch(`/api/repos?${params.toString()}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.items || []) as Repository[];
      });

      const results = await Promise.all(fetches);
      const presetFilters: Filters = { ...DEFAULT_FILTERS, ...preset.filters };

      const merged: Repository[] = [];
      results.forEach((items, i) => {
        const filtered = filterRepos(items, presetFilters, true)
          .filter((r) => r.stars > 0)
          .sort((a, b) => (b.stars_gained / b.stars) - (a.stars_gained / a.stars))
          .slice(0, brackets[i].pick);
        merged.push(...filtered);
      });

      merged.sort((a, b) => (b.stars_gained / b.stars) - (a.stars_gained / a.stars));
      setTabRepos(merged);
    } catch {
      setTabRepos([]);
    } finally {
      setTabLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || page >= MAX_PAGES) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await fetch(`/api/repos?${buildParams(filters, nextPage).toString()}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const newItems = data.items || [];
      setRepos((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const unique = newItems.filter((r: Repository) => !existingIds.has(r.id));
        return [...prev, ...unique];
      });
      setPage(nextPage);
      setHasMore(newItems.length >= 30 && nextPage < MAX_PAGES);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, filters, buildParams]);

  useEffect(() => {
    fetchRepos(filters, true);
  }, []);

  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return; }
    if (!isTabMode) fetchRepos(filters);
  }, [filters.language, filters.timePeriod, filters.starsMin, filters.starsMax, filters.license, filters.sortBy, fetchRepos]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || loading || loadingMore || !hasMore || isTabMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, loading, loadingMore, hasMore, isTabMode]);

  const filteredRepos = useMemo(
    () => filterRepos(repos, filters, true),
    [repos, filters]
  );

  function handlePresetSelect(name: string, presetFilters: Filters) {
    setActivePreset(name);
    setFilters(presetFilters);
    if (name) {
      fetchTabRepos(name);
    } else {
      setTabRepos([]);
    }
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setActivePreset("");
    setTabRepos([]);
  }

  const activePresetData = FILTER_PRESETS.find((p) => p.name === activePreset);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center group gap-3">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-extrabold text-lg transition-transform group-hover:rotate-12">
                G.
              </div>
              <span className="text-sm font-bold tracking-tight text-white hidden sm:block">
                GitScout
              </span>
            </Link>
            {!isTabMode && (
              <SearchBar
                value={filters.search}
                onChange={(search) => setFilters({ ...filters, search })}
              />
            )}
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

      <div className={`flex flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 gap-8`}>
        {!isTabMode && (
          <FilterSidebar filters={filters} onChange={(f) => { setActivePreset(""); setTabRepos([]); setFilters(f); }} />
        )}

        <main className="flex-1 min-w-0">
          {/* Tab mode header */}
          {isTabMode && activePresetData && (
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                {activePresetData.name}
              </h2>
              <p className="text-sm text-[#666666] mt-1">
                {activePresetData.description}
                <span className="ml-2 text-[#444444]">
                  · {activePresetData.name === "Hot Today" ? "Last 24 hours" : "Last 7 days"}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              <span className="text-white">
                {isTabMode
                  ? tabRepos.length
                  : totalCount > 0
                    ? totalCount.toLocaleString()
                    : filteredRepos.length}
              </span>{" "}
              repositories
              {!isTabMode && filteredRepos.length > 0 && totalCount > 0 && (
                <span className="ml-2 text-[#444444]">
                  · showing {filteredRepos.length}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-3">
            {/* Tab mode */}
            {isTabMode && (
              <>
                {tabLoading && (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-5 h-5 border-2 border-[#FF6B50] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!tabLoading && tabRepos.map((repo, i) => (
                  <RepoCardWide
                    key={repo.id}
                    repo={repo}
                    index={i}
                    onClick={() => setSelectedRepo(repo)}
                  />
                ))}
                {!tabLoading && tabRepos.length === 0 && (
                  <div className="text-center py-24 rounded-[2rem] bg-[#111111] border border-[#222222]">
                    <div className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                      Nothing here.
                    </div>
                    <p className="text-[#666666] text-sm mt-2 mb-8">
                      No repositories matched this filter.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-bold text-xs tracking-wide uppercase rounded-xl transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Custom mode */}
            {!isTabMode && (
              <>
                {loading && (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-5 h-5 border-2 border-[#FF6B50] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {!loading && filteredRepos.map((repo, i) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    index={i}
                    onClick={() => setSelectedRepo(repo)}
                  />
                ))}
                {!loading && filteredRepos.length === 0 && (
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

                {/* Infinite scroll trigger */}
                {!loading && hasMore && (
                  <div ref={loaderRef} className="py-8 flex justify-center">
                    {loadingMore && (
                      <div className="w-5 h-5 border-2 border-[#FF6B50] border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                )}
                {!loading && !hasMore && filteredRepos.length > 0 && (
                  <p className="py-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#444444]">
                    All loaded
                  </p>
                )}
              </>
            )}
          </div>
        </main>

        {!isTabMode && (
          <Leaderboards repos={filteredRepos} onSelectRepo={setSelectedRepo} />
        )}
      </div>

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
