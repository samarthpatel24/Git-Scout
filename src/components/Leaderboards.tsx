"use client";

import { useEffect, useState, useCallback } from "react";
import { Repository } from "@/types";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function getGrowthRate(repo: Repository): number {
  if (repo.stars <= 0) return 0;
  return (repo.stars_gained / repo.stars) * 100;
}

type Period = "daily" | "weekly";

function PeriodToggle({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="flex bg-[#111111] rounded-lg p-0.5 border border-[#1a1a1a]">
      {(["daily", "weekly"] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${
            value === p
              ? "bg-[#1a1a1a] text-white"
              : "text-[#555555] hover:text-[#888888]"
          }`}
        >
          {p === "daily" ? "Day" : "Week"}
        </button>
      ))}
    </div>
  );
}

function LeaderboardEntry({
  rank,
  repo,
  metric,
  metricLabel,
  metricColor,
  onClick,
}: {
  rank: number;
  repo: Repository;
  metric: string;
  metricLabel: string;
  metricColor: string;
  onClick: () => void;
}) {
  const [, name] = repo.full_name.split("/");
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#161616] transition-colors text-left group"
    >
      <span className="text-xs font-bold text-[#333333] w-5 text-center shrink-0">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-[#FF6B50] transition-colors">
          {name}
        </p>
        <p className="text-[10px] text-[#555555] truncate">
          {repo.full_name.split("/")[0]}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs font-bold ${metricColor}`}>{metric}</p>
        <p className="text-[9px] text-[#444444] uppercase tracking-wider">{metricLabel}</p>
      </div>
    </button>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group ml-0.5 self-center">
      <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#333333] text-[8px] leading-none font-bold text-[#555555] cursor-help hover:border-[#555555] hover:text-[#888888] transition-colors">
        ?
      </span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[10px] text-[#cccccc] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
        {text}
      </span>
    </span>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2 px-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <div className="w-5 h-3 rounded bg-[#1a1a1a] animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="w-24 h-3 rounded bg-[#1a1a1a] animate-pulse" />
            <div className="w-16 h-2 rounded bg-[#141414] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Leaderboards({
  onSelectRepo,
}: {
  repos?: Repository[];
  onSelectRepo: (repo: Repository) => void;
}) {
  const [risingPeriod, setRisingPeriod] = useState<Period>("daily");
  const [contribPeriod, setContribPeriod] = useState<Period>("weekly");
  const [rising, setRising] = useState<Repository[]>([]);
  const [contributors, setContributors] = useState<Repository[]>([]);
  const [loadingRising, setLoadingRising] = useState(true);
  const [loadingContrib, setLoadingContrib] = useState(true);

  const fetchRising = useCallback(async (period: Period) => {
    setLoadingRising(true);
    try {
      const res = await fetch(`/api/repos?period=${period}&starsMin=700&starsMax=100000&perPage=30&sort=stars`);
      if (res.ok) {
        const data = await res.json();
        const sorted = (data.items || [])
          .filter((r: Repository) => r.stars_gained > 0)
          .sort((a: Repository, b: Repository) => getGrowthRate(b) - getGrowthRate(a))
          .slice(0, 5);
        setRising(sorted);
      }
    } catch { /* silent */ }
    setLoadingRising(false);
  }, []);

  const fetchContrib = useCallback(async (period: Period) => {
    setLoadingContrib(true);
    try {
      const res = await fetch(`/api/repos?period=${period}&starsMin=500&starsMax=100000&perPage=30&sort=updated`);
      if (res.ok) {
        const data = await res.json();
        const sorted = (data.items || [])
          .filter((r: Repository) => r.forks > 10)
          .sort((a: Repository, b: Repository) => {
            const aRatio = a.forks / Math.max(1, a.stars);
            const bRatio = b.forks / Math.max(1, b.stars);
            return bRatio - aRatio;
          })
          .slice(0, 5);
        setContributors(sorted);
      }
    } catch { /* silent */ }
    setLoadingContrib(false);
  }, []);

  useEffect(() => { fetchRising(risingPeriod); }, [risingPeriod, fetchRising]);
  useEffect(() => { fetchContrib(contribPeriod); }, [contribPeriod, fetchContrib]);

  return (
    <aside className="hidden xl:flex flex-col gap-6 w-[340px] shrink-0">
      {/* Fastest Rising */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 sticky top-[140px]">
        <div className="flex items-center justify-between mb-5 px-1 pt-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666666] inline-flex items-center gap-1">
              Fastest Rising
              <InfoTooltip text="Ranked by star growth rate — stars gained relative to total stars" />
            </h3>
          </div>
          <PeriodToggle value={risingPeriod} onChange={setRisingPeriod} />
        </div>
        {loadingRising ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="space-y-0.5">
            {rising.map((repo, i) => (
              <LeaderboardEntry
                key={repo.id}
                rank={i + 1}
                repo={repo}
                metric={`${getGrowthRate(repo).toFixed(1)}%`}
                metricLabel="growth"
                metricColor="text-emerald-400"
                onClick={() => onSelectRepo(repo)}
              />
            ))}
            {rising.length === 0 && (
              <p className="text-xs text-[#444444] text-center py-4">No data yet</p>
            )}
          </div>
        )}
      </div>

      {/* Top Contributors' Picks */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-5 px-1 pt-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666666] inline-flex items-center gap-1">
              Top Contributors
              <InfoTooltip text="Ranked by fork-to-star ratio among recently active repos" />
            </h3>
          </div>
          <PeriodToggle value={contribPeriod} onChange={setContribPeriod} />
        </div>
        {loadingContrib ? (
          <LeaderboardSkeleton />
        ) : (
          <div className="space-y-0.5">
            {contributors.map((repo, i) => (
              <LeaderboardEntry
                key={repo.id}
                rank={i + 1}
                repo={repo}
                metric={formatNumber(repo.forks)}
                metricLabel="forks"
                metricColor="text-sky-400"
                onClick={() => onSelectRepo(repo)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
