export interface Repository {
  id: number;
  github_id: number;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: string | null;
  topics: string[];
  size: number;
  homepage_url: string | null;
  archived: boolean;
  fork: boolean;
  stars_gained: number;
  health_score: number;
  friendliness_score: number;
  maturity_score: number;
  trending_score: number;
  good_first_issue_count: number;
  has_contributing: boolean;
  pr_merge_rate: number;
  avg_issue_response_hours: number;
  star_history: { date: string; stars: number }[];
}

export type TimePeriod = "daily" | "weekly" | "monthly" | "yearly";
export type SortOption =
  | "stars_gained"
  | "stars"
  | "forks"
  | "recent_activity"
  | "trending_score"
  | "friendliness_score";
export type MaturityLevel =
  | "experimental"
  | "growing"
  | "production"
  | "established";
export type HealthLevel = "highly_active" | "moderate" | "slow" | "stale";

export interface Filters {
  search: string;
  language: string;
  timePeriod: TimePeriod;
  starsMin: number;
  starsMax: number;
  forksMin: number;
  forksMax: number;
  createdAfter: string;
  updatedAfter: string;
  license: string;
  sortBy: SortOption;
  domain: string;
  hasGoodFirstIssues: boolean;
  beginnerFriendly: boolean;
  risingFromObscurity: boolean;
  maturity: MaturityLevel | "";
  health: HealthLevel | "";
}

export const DEFAULT_FILTERS: Filters = {
  search: "",
  language: "",
  timePeriod: "weekly",
  starsMin: 0,
  starsMax: 0,
  forksMin: 0,
  forksMax: 0,
  createdAfter: "",
  updatedAfter: "",
  license: "",
  sortBy: "stars_gained",
  domain: "",
  hasGoodFirstIssues: false,
  beginnerFriendly: false,
  risingFromObscurity: false,
  maturity: "",
  health: "",
};

export const LANGUAGES = [
  "Any",
  "Python",
  "JavaScript",
  "TypeScript",
  "Rust",
  "Go",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Swift",
  "Kotlin",
  "PHP",
  "Dart",
  "Scala",
  "Elixir",
  "Haskell",
  "Lua",
  "R",
  "Shell",
  "Zig",
  "C",
  "Objective-C",
  "Vue",
  "HTML",
  "CSS",
];

export const LICENSES = [
  "Any",
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "GPL-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "ISC",
  "MPL-2.0",
  "Unlicense",
];

export const DOMAINS = [
  "Any",
  "AI / Machine Learning",
  "Web Development",
  "Mobile",
  "DevOps / Infrastructure",
  "Security",
  "Data Science",
  "Game Development",
  "Blockchain / Web3",
  "CLI Tools",
  "Desktop Apps",
  "Embedded / IoT",
  "Databases",
  "Networking",
  "Testing",
];

export interface FilterPreset {
  name: string;
  description: string;
  filters: Partial<Filters>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  {
    name: "Hot Today",
    description: "Repos gaining the most stars today",
    filters: { timePeriod: "daily", sortBy: "stars_gained" },
  },
  {
    name: "Beginner Friendly",
    description: "Great for first-time contributors",
    filters: { beginnerFriendly: true, sortBy: "friendliness_score" },
  },
  {
    name: "Hidden Gems",
    description: "Rising from obscurity — undiscovered projects",
    filters: { risingFromObscurity: true, sortBy: "trending_score" },
  },
  {
    name: "Production Ready",
    description: "Mature, well-maintained projects",
    filters: { maturity: "production", health: "highly_active" },
  },
  {
    name: "Weekend Projects",
    description: "Small repos perfect for a quick contribution",
    filters: {
      hasGoodFirstIssues: true,
      starsMin: 50,
      starsMax: 5000,
      sortBy: "friendliness_score",
    },
  },
];
