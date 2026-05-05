import { NextRequest, NextResponse } from "next/server";
import { searchTrendingRepos, enrichRepo } from "@/lib/github";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const params = {
    language: sp.get("language") || undefined,
    period: sp.get("period") || "weekly",
    starsMin: sp.get("starsMin") ? Number(sp.get("starsMin")) : undefined,
    starsMax: sp.get("starsMax") ? Number(sp.get("starsMax")) : undefined,
    license: sp.get("license") || undefined,
    sort: sp.get("sort") || "stars",
    page: sp.get("page") ? Number(sp.get("page")) : 1,
    perPage: sp.get("perPage") ? Number(sp.get("perPage")) : 30,
  };

  try {
    const { items, totalCount } = await searchTrendingRepos(params);

    const enrich = sp.get("enrich") === "true";
    const results = enrich
      ? await Promise.all(items.slice(0, 10).map(enrichRepo))
      : items;

    return NextResponse.json({ items: results, totalCount });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Failed to fetch repos" },
      { status: 500 }
    );
  }
}
