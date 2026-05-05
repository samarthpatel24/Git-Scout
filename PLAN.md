# GitScout — Project Plan

## What
GitHub trending repository discovery platform with advanced filtering, contribution-friendliness scoring, and personalized recommendations.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Python data pipeline
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (GitHub OAuth)
- **Deploy:** Vercel + Railway

## Phases

### Phase 1 — MVP
- Standard filters: language, time period, stars, forks, date created, last updated, license, sort
- Advanced filters: domain/field tags, "Good First Issues" toggle, beginner friendly preset
- Repo cards with metrics (stars gained, health indicator, language, topics)
- Trending algorithm v1 (stars gained in period)
- Filter presets: "Hot Today", "Beginner Friendly", "Hidden Gems"
- Python data pipeline to fetch/score repos via GitHub API

### Phase 2 — Smart Discovery
- Scoring engine: contribution friendliness, health, maturity (computed daily)
- All advanced filters: maturity, health, stack, responsiveness, PR merge rate
- "Match Me" mode: input skills, get matched repos
- Community signals: Reddit/HN mentions
- Historical snapshots
- Repo detail page with full stats

### Phase 3 — Engagement
- User accounts (GitHub OAuth)
- Watchlists & alerts
- Saved filter combos
- RSS feeds
- Custom scoring weights
- Competitor clustering
