<p align="center">
  <img src="public/assets/banner.png" alt="GitScout" width="100%" />
</p>

<p align="center">
  <strong>Discover trending GitHub repositories with advanced filters, scoring algorithms, and contribution-focused insights.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &nbsp;·&nbsp;
  <a href="#tech-stack">Tech Stack</a> &nbsp;·&nbsp;
  <a href="#getting-started">Getting Started</a> &nbsp;·&nbsp;
  <a href="#roadmap">Roadmap</a>
</p>

---

## Features

- **15+ Filters** — Language, stars, forks, time period, license, domain, maturity, health, and more
- **Smart Presets** — Hot Today, Beginner Friendly, Hidden Gems, Production Ready, Weekend Projects
- **Scoring Algorithms** — Health, contribution friendliness, maturity, and trending scores for every repo
- **Domain Discovery** — Filter by field: AI/ML, Web Dev, Mobile, DevOps, Security, Data Science, etc.
- **Contribution Focus** — Surface repos with good first issues, responsive maintainers, and high merge rates
- **Infinite Scroll** — Browse thousands of repos with automatic pagination
- **Repo Detail Modal** — Star history charts, score breakdowns, and quick links to contribute

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data Source | GitHub REST API |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/samarthpatel24/gitscout.git
cd gitscout

# Install dependencies
npm install

# Add your GitHub token (optional, increases rate limits)
echo "GITHUB_TOKEN=your_token_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

## Roadmap

- [ ] Proper scoring engine with daily computation pipeline
- [ ] User accounts with GitHub OAuth
- [ ] Saved filters and watchlists with email alerts
- [ ] Community signals (Reddit, Hacker News mentions)
- [ ] Historical trending snapshots
- [ ] RSS feeds per language/domain

## License

MIT

---

<p align="center">
  Built by <a href="https://github.com/samarthpatel24">Samarth Patel</a>
</p>
