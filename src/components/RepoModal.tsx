"use client";

import { Repository } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function getHealthColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[#888888]">{label}</span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function RepoModal({
  repo,
  onClose,
}: {
  repo: Repository;
  onClose: () => void;
}) {
  const [owner, name] = repo.full_name.split("/");
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleClose]);

  return createPortal(
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 ${closing ? "animate-[fadeOut_0.25s_ease_forwards]" : "animate-[fadeIn_0.2s_ease]"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${closing ? "animate-[fadeOut_0.25s_ease_forwards]" : "animate-[fadeIn_0.3s_ease]"}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-[2rem] border border-[#222222] shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${closing ? "animate-[modalSlideDown_0.25s_ease_forwards]" : "animate-[modalSlideUp_0.35s_cubic-bezier(0.16,1,0.3,1)]"}`}>
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-[#333333] flex items-center justify-center hover:bg-white hover:text-black transition-all text-[#888888]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-sm text-[#666666]">{owner}</span>
            <span className="text-[#333333]">/</span>
            <span className="text-2xl font-bold text-white">{name}</span>
          </div>
          <p className="text-sm text-[#888888] leading-relaxed max-w-xl">
            {repo.description}
          </p>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mt-4">
            {repo.topics.map((topic) => (
              <span
                key={topic}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#222222] text-[#666666] bg-[#111111]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Star History Chart */}
        <div className="px-8 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              Star History
            </span>
          </div>
          <div className="h-48 bg-[#111111] rounded-2xl p-4 border border-[#1a1a1a]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={repo.star_history || []}>
                <defs>
                  <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B50" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FF6B50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#555555" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#555555" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(v)}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #333333",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#ebebeb",
                  }}
                  formatter={(value) => [formatNumber(Number(value)), "Stars"]}
                />
                <Area
                  type="monotone"
                  dataKey="stars"
                  stroke="#FF6B50"
                  strokeWidth={2}
                  fill="url(#starGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Stars", value: formatNumber(repo.stars), icon: "★" },
            { label: "Forks", value: formatNumber(repo.forks), icon: "⑂" },
            { label: "Issues", value: repo.open_issues.toString(), icon: "◉" },
            { label: "Gained", value: `+${formatNumber(repo.stars_gained)}`, icon: "↑" },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[#111111] rounded-xl p-4 border border-[#1a1a1a] text-center"
            >
              <div className="text-lg text-[#444444] mb-1">{m.icon}</div>
              <div className="text-xl font-bold text-white">{m.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555] mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div className="px-8 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666]">
              Scores
            </span>
          </div>
          <div className="bg-[#111111] rounded-2xl p-5 border border-[#1a1a1a] space-y-4">
            <ScoreBar label="Health" value={repo.health_score} color="bg-emerald-400" />
            <ScoreBar label="Contribution Friendliness" value={repo.friendliness_score} color="bg-sky-400" />
            <ScoreBar label="Maturity" value={repo.maturity_score} color="bg-amber-400" />
            <ScoreBar label="Trending" value={repo.trending_score} color="bg-[#FF6B50]" />
          </div>
        </div>

        {/* Details */}
        <div className="px-8 pb-4">
          <div className="bg-[#111111] rounded-2xl p-5 border border-[#1a1a1a]">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#555555]">Language</span>
                <p className="text-white font-medium">{repo.language || "N/A"}</p>
              </div>
              <div>
                <span className="text-[#555555]">License</span>
                <p className="text-white font-medium">{repo.license || "N/A"}</p>
              </div>
              <div>
                <span className="text-[#555555]">Created</span>
                <p className="text-white font-medium">{formatDate(repo.created_at)}</p>
              </div>
              <div>
                <span className="text-[#555555]">Last Push</span>
                <p className="text-white font-medium">{formatDate(repo.pushed_at)}</p>
              </div>
              <div>
                <span className="text-[#555555]">PR Merge Rate</span>
                <p className="text-white font-medium">{Math.round(repo.pr_merge_rate * 100)}%</p>
              </div>
              <div>
                <span className="text-[#555555]">Avg Response</span>
                <p className="text-white font-medium">{repo.avg_issue_response_hours}h</p>
              </div>
              <div>
                <span className="text-[#555555]">Good First Issues</span>
                <p className={`font-medium ${repo.good_first_issue_count > 0 ? "text-emerald-400" : "text-[#666666]"}`}>
                  {repo.good_first_issue_count}
                </p>
              </div>
              <div>
                <span className="text-[#555555]">Has CONTRIBUTING.md</span>
                <p className={`font-medium ${repo.has_contributing ? "text-emerald-400" : "text-[#666666]"}`}>
                  {repo.has_contributing ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 pt-4 flex gap-3">
          <a
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-bold text-xs tracking-wide uppercase rounded-xl transition-all text-center"
          >
            View on GitHub
          </a>
          {repo.has_contributing && (
            <a
              href={`https://github.com/${repo.full_name}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-[#1a1a1a] hover:bg-[#222222] text-white font-bold text-xs tracking-wide uppercase rounded-xl transition-all text-center border border-[#333333]"
            >
              Contribution Guide
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
