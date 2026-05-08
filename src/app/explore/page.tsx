"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { DEFAULT_FILTERS, Filters, Repository } from "@/types";
import { filterRepos } from "@/lib/filter-repos";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterPresets } from "@/components/FilterPresets";
import { RepoCard } from "@/components/RepoCard";
import { RepoModal } from "@/components/RepoModal";
import { Leaderboards } from "@/components/Leaderboards";

const MAX_PAGES = 33;

export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [activePreset, setActivePreset] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

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
    fetchRepos(filters);
  }, [filters.language, filters.timePeriod, filters.starsMin, filters.starsMax, filters.license, filters.sortBy, fetchRepos]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || loading || loadingMore || !hasMore) return;
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
  }, [loadMore, loading, loadingMore, hasMore]);

  const filteredRepos = useMemo(
    () => filterRepos(repos, filters, true),
    [repos, filters]
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

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 gap-8">
        <FilterSidebar filters={filters} onChange={(f) => { setActivePreset(""); setFilters(f); }} />

        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              <span className="text-white">
                {totalCount > 0 ? totalCount.toLocaleString() : filteredRepos.length}
              </span>{" "}
              repositories found
              {filteredRepos.length > 0 && totalCount > 0 && (
                <span className="ml-2 text-[#444444]">
                  · showing {filteredRepos.length}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-3">
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
          </div>
        </main>

        <Leaderboards repos={filteredRepos} onSelectRepo={setSelectedRepo} />
      </div>

      {selectedRepo && (
        <RepoModal repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </div>
  );
}
