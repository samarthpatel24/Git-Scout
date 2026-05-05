import { Repository, Filters } from "@/types";

export function filterRepos(repos: Repository[], filters: Filters): Repository[] {
  let result = repos;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.language) {
    result = result.filter((r) => r.language === filters.language);
  }

  if (filters.starsMin > 0) {
    result = result.filter((r) => r.stars >= filters.starsMin);
  }

  if (filters.starsMax > 0) {
    result = result.filter((r) => r.stars <= filters.starsMax);
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

  if (filters.license) {
    result = result.filter((r) => r.license === filters.license);
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
