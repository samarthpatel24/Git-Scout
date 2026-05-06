import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

function headers(): HeadersInit {
  const h: HeadersInit = { Accept: "application/vnd.github.cloak-preview+json" };
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

async function getCommitCount(repo: string, since: string): Promise<number> {
  try {
    const q = encodeURIComponent(`repo:${repo} committer-date:>${since}`);
    const res = await fetch(`${GITHUB_API}/search/commits?q=${q}&per_page=1`, {
      headers: headers(),
      next: { revalidate: 600 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total_count || 0;
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const repos = sp.get("repos")?.split(",").filter(Boolean) || [];
  const period = sp.get("period") || "weekly";
  const days = period === "daily" ? 1 : 7;
  const since = dateAgo(days);

  if (repos.length === 0) {
    return NextResponse.json({ counts: {} });
  }

  const limited = repos.slice(0, 15);

  const results = await Promise.all(
    limited.map(async (repo) => ({
      repo,
      count: await getCommitCount(repo, since),
    }))
  );

  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.repo] = r.count;
  }

  return NextResponse.json({ counts });
}
