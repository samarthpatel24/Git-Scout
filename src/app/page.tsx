import Link from "next/link";
import { ExplorePreview } from "@/components/ExplorePreview";

const STATS = [
  { value: "15+", label: "Filters" },
  { value: "5", label: "Presets" },
  { value: "4", label: "Scoring Algorithms" },
  { value: "100%", label: "Open Source" },
];

const FEATURES = [
  {
    title: "Find what matters.",
    subtitle: "Skip the noise.",
    description:
      "Filter by language, stars, forks, dates, license, domain, tech stack, maturity level, and activity health. 15+ filters that actually work.",
    badge: "Discovery",
  },
  {
    title: "Contribute today.",
    subtitle: "Not someday.",
    description:
      "Surface repos with good first issues, high contribution friendliness scores, responsive maintainers, and strong PR merge rates.",
    badge: "Contribution",
    gradient: true,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex items-center justify-between text-sm font-medium tracking-tight">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center group">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-extrabold text-lg transition-transform group-hover:rotate-12">
              G.
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[#888888]">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#explore" className="hover:text-white transition-colors">
              Explore
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="https://github.com/samarthpatel24"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-[#888888] hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="#explore"
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-white hover:text-black border border-[#333333] rounded-lg transition-all duration-300"
          >
            Start Exploring
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-screen w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#050505_70%)] opacity-60" />
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-[12vw] md:text-[10vw] font-bold text-white leading-[0.9] tracking-[-0.05em]">
            /GitScout
          </h1>
        </div>

        <div className="absolute bottom-12 left-8 md:left-12 flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse" />
            <p className="text-xs md:text-sm font-medium leading-tight text-[#888888]">
              Discover trending repos.
              <br />
              Contribute to open source.
            </p>
          </div>
        </div>

        <div className="absolute bottom-12 right-8 md:right-12 text-right">
          <a
            href="#explore"
            className="text-white font-medium hover:text-[#FF6B50] transition-colors border-b-2 border-white hover:border-[#FF6B50] pb-1"
          >
            Explore repositories →
          </a>
        </div>
      </header>

      {/* Stats Strip */}
      <section className="py-16 px-6 md:px-12 border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#666666] mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#666666] uppercase">
            Why settle for basic trending?
          </span>
        </div>

        <h2 className="text-4xl md:text-7xl font-medium leading-[1.05] tracking-tight text-white max-w-5xl mb-24">
          Advanced filters that help you{" "}
          <span className="text-[#666666]">find your next contribution</span>{" "}
          in seconds.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`${
                feature.gradient
                  ? "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]"
                  : "bg-[#111111] hover:bg-[#161616]"
              } rounded-[2.5rem] p-12 min-h-[480px] flex flex-col justify-between relative overflow-hidden group transition-all duration-500`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest border ${
                    feature.gradient
                      ? "bg-white/10 text-white/80 border-white/20"
                      : "bg-[#1a1a1a] text-[#888888] border-[#333333]"
                  }`}
                >
                  {feature.badge}
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-2 text-white">
                  {feature.title}
                </h3>
                <h3
                  className={`text-4xl md:text-6xl font-semibold tracking-tighter mb-6 ${
                    feature.gradient
                      ? "text-white/40"
                      : "text-[#444444] group-hover:text-[#666666]"
                  } transition-colors`}
                >
                  {feature.subtitle}
                </h3>
                <p
                  className={`text-sm leading-relaxed max-w-md ${
                    feature.gradient ? "text-white/60" : "text-[#666666]"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222222] rounded-2xl overflow-hidden">
          {[
            {
              title: "Smart Presets",
              desc: "One-click filters: Hot Today, Beginner Friendly, Hidden Gems, Production Ready, Weekend Projects.",
            },
            {
              title: "Health Scoring",
              desc: "Commit velocity, issue response time, PR merge rate, and maintainer activity — all in one score.",
            },
            {
              title: "Rising Gems",
              desc: "Repos going from obscurity to trending. Low total stars, massive recent growth. True undiscovered projects.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#0a0a0a] p-10 group hover:bg-[#111111] transition-colors duration-300"
            >
              <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-[#FF6B50] transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-[#666666] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Section — Live Preview */}
      <section id="explore" className="py-32 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-[#222222] pb-10">
            <div>
              <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#FF6B50] mb-4">
                Explore
              </h2>
              <p className="text-3xl md:text-5xl font-medium tracking-tight text-white">
                Try it now.
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden md:flex items-center gap-2 text-sm text-[#888888] hover:text-white transition-colors"
            >
              Open full page
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>

          <ExplorePreview />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20 border-b border-[#222222] pb-10">
          <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#FF6B50]">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Set your filters",
              desc: "Pick your language, star range, domain, maturity level. Use presets for quick discovery or build your own filter combo.",
            },
            {
              step: "02",
              title: "Browse scored repos",
              desc: "Every repo is scored on health, contribution friendliness, maturity, and trending momentum. No more guessing.",
            },
            {
              step: "03",
              title: "Start contributing",
              desc: "Find repos with good first issues, responsive maintainers, and high merge rates. Jump straight to the contribution guide.",
            },
          ].map((item) => (
            <div key={item.step} className="group">
              <div className="text-6xl md:text-7xl font-black text-[#1a1a1a] group-hover:text-[#222222] transition-colors tracking-tighter mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#FF6B50] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="relative pt-24 pb-16 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-extrabold text-lg">
                  G.
                </div>
                <span className="text-lg font-bold text-white">GitScout</span>
              </div>
              <p className="text-sm text-[#666666] max-w-sm leading-relaxed">
                Discover trending GitHub repositories with advanced filters,
                contribution-friendliness scoring, and personalized
                recommendations. Open source, always free.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#444444] uppercase block mb-2">
                Built by
              </span>
              <span className="text-white font-semibold">Samarth Patel</span>
              <p className="text-xs text-[#666666] mt-1">
                AI/ML Engineer · Pune, India
              </p>
              <div className="flex gap-3 mt-4 justify-end">
                <a
                  href="https://github.com/samarthpatel24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#333333] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all text-[#888888]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/samarthpatel24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#333333] rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all text-[#888888]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[#111111] flex flex-col md:flex-row justify-between text-[#333333] text-[10px] font-bold uppercase tracking-widest">
            <p>&copy; 2026 GitScout. All rights reserved.</p>
            <Link
              href="/explore"
              className="hover:text-[#666666] transition-colors mt-4 md:mt-0"
            >
              Full Explore Page →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
