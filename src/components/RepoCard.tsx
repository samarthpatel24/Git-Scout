"use client";

import { Repository } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  GitFork,
  Clock,
  TrendingUp,
  Heart,
  CircleDot,
  ExternalLink,
} from "lucide-react";

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
  if (score >= 60) return "text-yellow-400";
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
    PHP: "bg-indigo-300",
    Dart: "bg-sky-400",
  };
  return colors[lang] || "bg-zinc-400";
}

export function RepoCard({ repo }: { repo: Repository }) {
  const [owner, name] = repo.full_name.split("/");

  return (
    <div className="group relative rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 transition-all duration-200 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {repo.language && (
              <span
                className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)} ring-2 ring-background`}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {owner}
            </span>
            <span className="text-muted-foreground/40">/</span>
            <a
              href={`https://github.com/${repo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
            >
              {name}
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
            {repo.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {repo.topics.slice(0, 4).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs font-normal bg-secondary/80 hover:bg-secondary text-secondary-foreground/80"
              >
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 4 && (
              <Badge variant="secondary" className="text-xs font-normal opacity-60">
                +{repo.topics.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            +{formatNumber(repo.stars_gained)}
          </div>
          {repo.good_first_issue_count > 0 && (
            <Badge
              variant="outline"
              className="text-xs text-sky-400 border-sky-400/30 bg-sky-400/5"
            >
              {repo.good_first_issue_count} good first issues
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5 mt-4 pt-3.5 border-t border-border/40 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400/70" />
          {formatNumber(repo.stars)}
        </span>
        <span className="flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5" />
          {formatNumber(repo.forks)}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(repo.pushed_at)}
        </span>
        <span
          className={`flex items-center gap-1.5 ml-auto font-medium ${getHealthColor(repo.health_score)}`}
        >
          <Heart className="w-3.5 h-3.5" />
          {repo.health_score}%
        </span>
      </div>
    </div>
  );
}
