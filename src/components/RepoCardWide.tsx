"use client";

import { Repository } from "@/types";
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

function getHealthColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getHealthBg(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-amber-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-400",
    JavaScript: "bg-yellow-300",
    Python: "bg-emerald-400",
    Rust: "bg-orange-400",
    Go: "bg-cyan-400",
    Java: "bg-red-400",
    "C++": "bg-pink-400",
    Ruby: "bg-red-500",
    Swift: "bg-orange-300",
    Kotlin: "bg-purple-400",
    "C#": "bg-green-400",
  };
  return colors[lang] || "bg-[#888888]";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function RepoCardWide({
  repo,
  onClick,
  index = 0,
}: {
  repo: Repository;
  onClick: () => void;
  index?: number;
}) {
  const [owner, name] = repo.full_name.split("/");

  return (
    <div
      onClick={onClick}
      className="group block cursor-pointer animate-[fadeSlideIn_0.4s_ease_both]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="bg-[#111111] rounded-2xl border border-transparent hover:border-[#333333] hover:bg-[#141414] transition-all duration-300">
        <div className="flex items-stretch p-6 gap-6">
          {/* Left — Info */}
          <div className="flex-[4] min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                {repo.language && (
                  <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
                )}
                <span className="text-sm text-[#666666]">{owner}</span>
                <span className="text-[#333333]">/</span>
                <span className="text-base font-bold text-white group-hover:text-[#FF6B50] transition-colors">
                  {name}
                </span>
                <svg
                  className="w-3.5 h-3.5 text-[#333333] opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p className="text-sm text-[#888888] leading-relaxed line-clamp-2 mb-3">
                {repo.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {repo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#222222] text-[#666666] bg-[#0a0a0a]"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 5 && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#222222] text-[#444444]">
                  +{repo.topics.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* Center — Star Chart */}
          <div className="flex-[3.5] min-w-0 flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444] mb-2">
              Star History
            </span>
            <div className="flex-1 min-h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={repo.star_history || []}>
                  <defs>
                    <linearGradient id={`grad-${repo.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B50" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#FF6B50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "10px",
                      fontSize: "11px",
                      color: "#ebebeb",
                    }}
                    formatter={(value) => [formatNumber(Number(value)), "Stars"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="stars"
                    stroke="#FF6B50"
                    strokeWidth={1.5}
                    fill={`url(#grad-${repo.id})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right — Metrics */}
          <div className="flex-[2] shrink-0 flex flex-col items-end justify-between gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{formatNumber(repo.stars_gained)}
            </div>
            <div className="text-right space-y-1.5">
              <div className="flex items-center gap-1.5 justify-end text-xs text-[#888888]">
                <svg className="w-3.5 h-3.5 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white font-bold">{formatNumber(repo.stars)}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end text-xs text-[#888888]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-white font-bold">{formatNumber(repo.forks)}</span>
              </div>
            </div>
            {repo.good_first_issue_count > 0 && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {repo.good_first_issue_count} good first issues
              </span>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-6 px-6 py-3.5 border-t border-[#1a1a1a] text-xs text-[#555555]">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
              {repo.language}
            </span>
          )}
          {repo.license && <span>{repo.license}</span>}
          <span>Created {formatDate(repo.created_at)}</span>
          <span>Pushed {timeAgo(repo.pushed_at)}</span>
          <span className={`flex items-center gap-2 ml-auto font-bold ${getHealthColor(repo.health_score)}`}>
            <span className="text-[#444444] font-normal">Health</span>
            <span className="flex items-center gap-1.5">
              <span className="w-16 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden inline-block">
                <span
                  className={`block h-full rounded-full ${getHealthBg(repo.health_score)}`}
                  style={{ width: `${repo.health_score}%` }}
                />
              </span>
              {repo.health_score}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
