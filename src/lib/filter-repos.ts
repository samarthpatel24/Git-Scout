import { Repository, Filters } from "@/types";

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "AI / Machine Learning": ["machine-learning", "deep-learning", "ai", "ml", "neural-network", "nlp", "computer-vision", "tensorflow", "pytorch", "llm", "gpt", "transformer"],
  "Web Development": ["web", "frontend", "backend", "react", "vue", "angular", "nextjs", "nodejs", "express", "django", "flask", "rails", "html", "css", "javascript", "typescript"],
  "Mobile": ["mobile", "android", "ios", "react-native", "flutter", "swift", "kotlin", "swiftui", "jetpack-compose"],
  "DevOps / Infrastructure": ["devops", "docker", "kubernetes", "k8s", "ci-cd", "terraform", "ansible", "aws", "gcp", "azure", "infrastructure", "cloud", "monitoring"],
  "Security": ["security", "cybersecurity", "pentest", "vulnerability", "encryption", "authentication", "oauth", "firewall", "malware"],
  "Data Science": ["data-science", "data-analysis", "pandas", "numpy", "jupyter", "visualization", "statistics", "analytics", "data-engineering", "etl"],
  "Game Development": ["game", "gamedev", "unity", "unreal", "godot", "game-engine", "2d", "3d", "opengl", "vulkan"],
  "Blockchain / Web3": ["blockchain", "web3", "ethereum", "solidity", "crypto", "defi", "nft", "smart-contract", "solana"],
  "CLI Tools": ["cli", "command-line", "terminal", "shell", "bash", "console", "tui"],
  "Desktop Apps": ["desktop", "electron", "tauri", "gtk", "qt", "winforms", "wpf", "gui"],
  "Embedded / IoT": ["embedded", "iot", "arduino", "raspberry-pi", "firmware", "rtos", "microcontroller"],
  "Databases": ["database", "sql", "nosql", "mongodb", "postgresql", "mysql", "redis", "sqlite", "orm"],
  "Networking": ["networking", "http", "grpc", "websocket", "tcp", "proxy", "vpn", "dns", "protocol"],
  "Testing": ["testing", "test", "unit-test", "e2e", "cypress", "jest", "selenium", "qa", "automation"],
};

function matchesDomain(repo: Repository, domain: string): boolean {
  const keywords = DOMAIN_KEYWORDS[domain];
  if (!keywords) return true;
  const searchable = [
    ...repo.topics.map((t) => t.toLowerCase()),
    repo.description?.toLowerCase() || "",
    repo.full_name.toLowerCase(),
  ].join(" ");
  return keywords.some((kw) => searchable.includes(kw));
}

export function filterRepos(repos: Repository[], filters: Filters, serverFiltered = false): Repository[] {
  if (!Array.isArray(repos)) return [];
  const seen = new Set<number>();
  let result = repos.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (!serverFiltered) {
    if (filters.language) {
      result = result.filter(
        (r) => r.language?.toLowerCase() === filters.language.toLowerCase()
      );
    }

    if (filters.starsMin > 0) {
      result = result.filter((r) => r.stars >= filters.starsMin);
    }

    if (filters.starsMax > 0) {
      result = result.filter((r) => r.stars <= filters.starsMax);
    }

    if (filters.license) {
      result = result.filter(
        (r) => r.license?.toLowerCase() === filters.license.toLowerCase()
      );
    }
  }

  if (filters.forksMin > 0) {
    result = result.filter((r) => r.forks >= filters.forksMin);
  }

  if (filters.forksMax > 0) {
    result = result.filter((r) => r.forks <= filters.forksMax);
  }

  if (filters.createdAfter) {
    const date = new Date(filters.createdAfter);
    result = result.filter((r) => new Date(r.created_at) >= date);
  }

  if (filters.updatedAfter) {
    const date = new Date(filters.updatedAfter);
    result = result.filter((r) => new Date(r.pushed_at) >= date);
  }

  if (filters.domain) {
    result = result.filter((r) => matchesDomain(r, filters.domain));
  }

  if (filters.hasGoodFirstIssues) {
    result = result.filter((r) => r.good_first_issue_count > 0);
  }

  if (filters.beginnerFriendly) {
    result = result.filter(
      (r) => r.friendliness_score >= 70 && r.good_first_issue_count >= 5
    );
  }

  if (filters.risingFromObscurity) {
    result = result.filter(
      (r) => r.stars < 20000 && r.stars_gained > 200
    );
  }

  if (filters.maturity) {
    result = result.filter((r) => {
      switch (filters.maturity) {
        case "experimental":
          return r.maturity_score < 40;
        case "growing":
          return r.maturity_score >= 40 && r.maturity_score < 65;
        case "production":
          return r.maturity_score >= 65 && r.maturity_score < 85;
        case "established":
          return r.maturity_score >= 85;
        default:
          return true;
      }
    });
  }

  if (filters.health) {
    result = result.filter((r) => {
      switch (filters.health) {
        case "highly_active":
          return r.health_score >= 80;
        case "moderate":
          return r.health_score >= 60 && r.health_score < 80;
        case "slow":
          return r.health_score >= 40 && r.health_score < 60;
        case "stale":
          return r.health_score < 40;
        default:
          return true;
      }
    });
  }

  result.sort((a, b) => {
    switch (filters.sortBy) {
      case "stars_gained":
        return b.stars_gained - a.stars_gained;
      case "stars":
        return b.stars - a.stars;
      case "forks":
        return b.forks - a.forks;
      case "recent_activity":
        return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
      case "trending_score":
        return b.trending_score - a.trending_score;
      case "friendliness_score":
        return b.friendliness_score - a.friendliness_score;
      default:
        return b.stars_gained - a.stars_gained;
    }
  });

  return result;
}
