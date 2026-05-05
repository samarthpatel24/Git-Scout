"use client";

import { Repository } from "@/types";

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

export function RepoCard({ repo }: { repo: Repository }) {
  const [owner, name] = repo.full_name.split("/");

  return (
    <a
      href={`https://github.com/${repo.full_name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="bg-[#111111] rounded-2xl p-6 border border-transparent hover:border-[#333333] hover:bg-[#161616] transition-all duration-300">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
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

            {/* Description */}
            <p className="text-sm text-[#888888] leading-relaxed line-clamp-2 mb-3">
              {repo.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#222222] text-[#666666] bg-[#0a0a0a]"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 4 && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#222222] text-[#444444]">
                  +{repo.topics.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Right metrics */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{formatNumber(repo.stars_gained)}
            </div>
            {repo.good_first_issue_count > 0 && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {repo.good_first_issue_count} good first issues
              </span>
            )}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-[#1a1a1a] text-xs text-[#555555]">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-amber-400/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {formatNumber(repo.stars)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {formatNumber(repo.forks)}
          </span>
          {repo.language && (
            <span className="flex items-center gap-1.5">
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            {formatDate(repo.pushed_at)}
          </span>
          <span className={`flex items-center gap-1.5 ml-auto font-bold ${getHealthColor(repo.health_score)}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {repo.health_score}%
          </span>
        </div>
      </div>
    </a>
  );
}
