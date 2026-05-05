"use client";

import { Repository } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Star,
  GitFork,
  Clock,
  TrendingUp,
  Heart,
  CircleDot,
} from "lucide-react";

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function getHealthColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-500",
    JavaScript: "bg-yellow-400",
    Python: "bg-green-500",
    Rust: "bg-orange-600",
    Go: "bg-cyan-500",
    Java: "bg-red-500",
    "C++": "bg-pink-500",
    Ruby: "bg-red-600",
    Swift: "bg-orange-500",
    Kotlin: "bg-purple-500",
    "C#": "bg-green-600",
    PHP: "bg-indigo-400",
    Dart: "bg-sky-500",
  };
  return colors[lang] || "bg-gray-400";
}

export function RepoCard({ repo }: { repo: Repository }) {
  const [owner, name] = repo.full_name.split("/");

  return (
    <Card className="p-5 hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {repo.language && (
              <span
                className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}
              />
            )}
            <a
              href={`https://github.com/${repo.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 truncate"
            >
              {owner} /
            </a>
          </div>
          <a
            href={`https://github.com/${repo.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            {name}
          </a>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {repo.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {repo.topics.slice(0, 4).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="text-xs font-normal"
              >
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 4 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{repo.topics.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{formatNumber(repo.stars_gained)}</span>
          </div>
          {repo.good_first_issue_count > 0 && (
            <Badge
              variant="outline"
              className="text-xs text-emerald-600 border-emerald-300"
            >
              {repo.good_first_issue_count} good first issues
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {formatNumber(repo.stars)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {formatNumber(repo.forks)}
        </span>
        {repo.language && (
          <span className="flex items-center gap-1">
            <CircleDot className="w-3.5 h-3.5" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(repo.pushed_at)}
        </span>
        <span
          className={`flex items-center gap-1 ml-auto ${getHealthColor(repo.health_score)}`}
        >
          <Heart className="w-3.5 h-3.5" />
          {repo.health_score}% health
        </span>
      </div>
    </Card>
  );
}
