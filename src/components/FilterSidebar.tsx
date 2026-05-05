"use client";

import { Filters, LANGUAGES, LICENSES, DOMAINS } from "@/types";

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555] mb-1.5 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-sm text-[#cccccc] outline-none focus:border-[#FF6B50]/40 transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterInput({
  label,
  type = "number",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string | number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555] mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 px-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-sm text-[#cccccc] placeholder-[#333333] outline-none focus:border-[#FF6B50]/40 transition-colors"
      />
    </div>
  );
}

function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div
        className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
          checked
            ? "bg-[#FF6B50] border-[#FF6B50]"
            : "border-[#333333] group-hover:border-[#555555]"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className="text-sm text-[#888888] group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <aside className="w-[280px] shrink-0 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Standard Filters */}
      <div className="bg-[#111111] rounded-2xl p-5 border border-[#1a1a1a]">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#FF6B50] mb-5">
          Filters
        </h3>

        <div className="space-y-4">
          <FilterSelect
            label="Language"
            value={filters.language || "Any"}
            options={LANGUAGES}
            onChange={(v) => update({ language: v === "Any" ? "" : v })}
          />

          <FilterSelect
            label="Time Period"
            value={filters.timePeriod}
            options={["daily", "weekly", "monthly", "yearly"]}
            onChange={(v) => update({ timePeriod: v as Filters["timePeriod"] })}
          />

          <div className="grid grid-cols-2 gap-3">
            <FilterInput
              label="Stars Min"
              placeholder="0"
              value={filters.starsMin}
              onChange={(v) => update({ starsMin: parseInt(v) || 0 })}
            />
            <FilterInput
              label="Stars Max"
              placeholder="Any"
              value={filters.starsMax}
              onChange={(v) => update({ starsMax: parseInt(v) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FilterInput
              label="Forks Min"
              placeholder="0"
              value={filters.forksMin}
              onChange={(v) => update({ forksMin: parseInt(v) || 0 })}
            />
            <FilterInput
              label="Forks Max"
              placeholder="Any"
              value={filters.forksMax}
              onChange={(v) => update({ forksMax: parseInt(v) || 0 })}
            />
          </div>

          <FilterInput
            label="Created After"
            type="date"
            placeholder=""
            value={filters.createdAfter}
            onChange={(v) => update({ createdAfter: v })}
          />

          <FilterInput
            label="Updated After"
            type="date"
            placeholder=""
            value={filters.updatedAfter}
            onChange={(v) => update({ updatedAfter: v })}
          />

          <FilterSelect
            label="License"
            value={filters.license || "Any"}
            options={LICENSES}
            onChange={(v) => update({ license: v === "Any" ? "" : v })}
          />

          <FilterSelect
            label="Sort By"
            value={filters.sortBy}
            options={[
              "stars_gained",
              "stars",
              "forks",
              "recent_activity",
              "trending_score",
              "friendliness_score",
            ]}
            onChange={(v) => update({ sortBy: v as Filters["sortBy"] })}
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-[#111111] rounded-2xl p-5 border border-[#1a1a1a]">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#4F46E5] mb-5">
          Advanced
        </h3>

        <div className="space-y-4">
          <FilterSelect
            label="Domain / Field"
            value={filters.domain || "Any"}
            options={DOMAINS}
            onChange={(v) => update({ domain: v === "Any" ? "" : v })}
          />

          <FilterSelect
            label="Maturity"
            value={filters.maturity || "any"}
            options={["any", "experimental", "growing", "production", "established"]}
            onChange={(v) =>
              update({ maturity: v === "any" ? "" : (v as Filters["maturity"]) })
            }
          />

          <FilterSelect
            label="Activity Health"
            value={filters.health || "any"}
            options={["any", "highly_active", "moderate", "slow", "stale"]}
            onChange={(v) =>
              update({ health: v === "any" ? "" : (v as Filters["health"]) })
            }
          />

          <div className="pt-2 border-t border-[#1a1a1a] space-y-3">
            <FilterCheckbox
              id="good-first-issues"
              label="Has Good First Issues"
              checked={filters.hasGoodFirstIssues}
              onChange={(v) => update({ hasGoodFirstIssues: v })}
            />
            <FilterCheckbox
              id="beginner-friendly"
              label="Beginner Friendly"
              checked={filters.beginnerFriendly}
              onChange={(v) => update({ beginnerFriendly: v })}
            />
            <FilterCheckbox
              id="rising"
              label="Rising From Obscurity"
              checked={filters.risingFromObscurity}
              onChange={(v) => update({ risingFromObscurity: v })}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
