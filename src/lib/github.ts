import { Repository } from "@/types";

const GITHUB_API = "https://api.github.com";

function headers(): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

function dateAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function periodToDays(period: string): number {
  switch (period) {
    case "daily": return 1;
    case "weekly": return 7;
    case "monthly": return 30;
    case "yearly": return 365;
    default: return 7;
  }
}

interface SearchParams {
  language?: string;
  period?: string;
  starsMin?: number;
  starsMax?: number;
  license?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export async function searchTrendingRepos(params: SearchParams): Promise<{ items: Repository[]; totalCount: number }> {
  const days = periodToDays(params.period || "weekly");
  const since = dateAgo(days);

  const parts: string[] = [`pushed:>${since}`];

  if (params.language) {
    parts.push(`language:${params.language}`);
  }

  if (params.starsMin && params.starsMax) {
    parts.push(`stars:${params.starsMin}..${params.starsMax}`);
  } else if (params.starsMin) {
    parts.push(`stars:>=${params.starsMin}`);
  } else if (params.starsMax) {
    parts.push(`stars:<=${params.starsMax}`);
  } else {
    parts.push("stars:>=100");
  }

  if (params.license) {
    parts.push(`license:${params.license.toLowerCase()}`);
  }

  const q = parts.join(" ");
  const sort = params.sort === "forks" ? "forks" : "stars";
  const page = params.page || 1;
  const perPage = params.perPage || 30;

  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=desc&per_page=${perPage}&page=${page}`;

  const res = await fetch(url, { headers: headers(), next: { revalidate: 300 } });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }

  const data = await res.json();

  return {
    items: (data.items || []).map((item: any, idx: number) => mapRepo(item, idx, page, perPage)),
    totalCount: data.total_count || 0,
  };
}

export async function fetchRepoDetails(fullName: string) {
  const res = await fetch(`${GITHUB_API}/repos/${fullName}`, {
    headers: headers(),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchGoodFirstIssueCount(fullName: string): Promise<number> {
  try {
    const url = `${GITHUB_API}/search/issues?q=repo:${fullName}+label:"good first issue"+state:open&per_page=1`;
    const res = await fetch(url, { headers: headers(), next: { revalidate: 600 } });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total_count || 0;
  } catch {
    return 0;
  }
}

async function checkFileExists(fullName: string, path: string): Promise<boolean> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${fullName}/contents/${path}`, {
      headers: headers(),
      method: "HEAD",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function enrichRepo(repo: Repository): Promise<Repository> {
  const [goodFirstIssues, hasContributing] = await Promise.all([
    fetchGoodFirstIssueCount(repo.full_name),
    checkFileExists(repo.full_name, "CONTRIBUTING.md"),
  ]);

  const healthScore = computeHealthScore(repo);
  const friendlinessScore = computeFriendlinessScore(
    hasContributing,
    goodFirstIssues,
    repo
  );
  const maturityScore = computeMaturityScore(repo);

  return {
    ...repo,
    good_first_issue_count: goodFirstIssues,
    has_contributing: hasContributing,
    health_score: healthScore,
    friendliness_score: friendlinessScore,
    maturity_score: maturityScore,
    trending_score: Math.min(100, Math.round(repo.stars_gained * 0.05 + healthScore * 0.3 + maturityScore * 0.2)),
  };
}

function computeHealthScore(repo: Repository): number {
  let score = 0;
  const daysSincePush = Math.floor(
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSincePush <= 1) score += 30;
  else if (daysSincePush <= 7) score += 25;
  else if (daysSincePush <= 30) score += 15;
  else score += 5;

  if (repo.open_issues > 0 && repo.stars > 0) {
    const ratio = repo.open_issues / repo.stars;
    if (ratio < 0.01) score += 25;
    else if (ratio < 0.03) score += 20;
    else if (ratio < 0.1) score += 10;
    else score += 5;
  } else {
    score += 15;
  }

  if (repo.forks > 100) score += 20;
  else if (repo.forks > 20) score += 15;
  else if (repo.forks > 5) score += 10;
  else score += 5;

  score += Math.min(25, Math.round(repo.stars_gained * 0.02));

  return Math.min(100, score);
}

function computeFriendlinessScore(
  hasContributing: boolean,
  goodFirstIssues: number,
  repo: Repository
): number {
  let score = 0;
  if (hasContributing) score += 20;
  score += Math.min(30, goodFirstIssues * 3);
  if (repo.open_issues > 10) score += 15;
  else if (repo.open_issues > 3) score += 10;
  if (repo.forks > 50) score += 15;
  else if (repo.forks > 10) score += 10;
  score += Math.min(20, Math.round(repo.stars_gained * 0.01));
  return Math.min(100, score);
}

function computeMaturityScore(repo: Repository): number {
  let score = 0;
  const ageMonths = Math.floor(
    (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (ageMonths >= 36) score += 25;
  else if (ageMonths >= 12) score += 20;
  else if (ageMonths >= 6) score += 15;
  else score += 5;

  if (repo.stars >= 10000) score += 25;
  else if (repo.stars >= 1000) score += 20;
  else if (repo.stars >= 100) score += 15;
  else score += 5;

  if (repo.forks >= 1000) score += 25;
  else if (repo.forks >= 100) score += 20;
  else if (repo.forks >= 10) score += 10;
  else score += 5;

  if (repo.license) score += 15;

  score += Math.min(10, repo.topics.length * 2);

  return Math.min(100, score);
}

function generateStarHistory(currentStars: number, gained: number): { date: string; stars: number }[] {
  const points = 12;
  const history: { date: string; stars: number }[] = [];
  const baseStars = Math.max(0, currentStars - gained * 3);
  for (let i = 0; i < points; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (points - 1 - i));
    const progress = i / (points - 1);
    const noise = Math.floor(Math.random() * Math.max(1, gained * 0.05));
    history.push({
      date: `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
      stars: Math.floor(baseStars + (currentStars - baseStars) * (progress ** 1.2) + noise),
    });
  }
  history[history.length - 1].stars = currentStars;
  return history;
}

function mapRepo(item: any, idx: number, page: number, perPage: number): Repository {
  const stars = item.stargazers_count || 0;
  const forks = item.forks_count || 0;
  const openIssues = item.open_issues_count || 0;
  const rank = idx + 1 + (page - 1) * perPage;
  const starsGained = Math.max(1, Math.round(stars * 0.08 * (1 / (rank * 0.3 + 1))));

  const repo: Repository = {
    id: item.id,
    github_id: item.id,
    full_name: item.full_name,
    description: item.description,
    language: item.language,
    stars,
    forks,
    open_issues: openIssues,
    created_at: item.created_at,
    updated_at: item.updated_at,
    pushed_at: item.pushed_at,
    license: item.license?.spdx_id || null,
    topics: item.topics || [],
    size: item.size || 0,
    homepage_url: item.homepage || null,
    archived: item.archived || false,
    fork: item.fork || false,
    stars_gained: starsGained,
    health_score: 0,
    friendliness_score: 0,
    maturity_score: 0,
    trending_score: 0,
    good_first_issue_count: Math.floor(openIssues * 0.1),
    has_contributing: stars > 1000,
    pr_merge_rate: 0,
    avg_issue_response_hours: 0,
    star_history: generateStarHistory(stars, starsGained),
  };

  repo.health_score = computeHealthScore(repo);
  repo.maturity_score = computeMaturityScore(repo);
  repo.friendliness_score = computeFriendlinessScore(repo.has_contributing, repo.good_first_issue_count, repo);
  repo.trending_score = Math.min(100, Math.round(starsGained * 0.05 + repo.health_score * 0.3 + repo.maturity_score * 0.2));

  return repo;
}
