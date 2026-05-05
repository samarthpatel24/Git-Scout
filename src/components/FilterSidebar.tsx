"use client";

import { Filters, LANGUAGES, LICENSES, DOMAINS } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <aside className="w-72 shrink-0 space-y-5 overflow-y-auto max-h-[calc(100vh-10rem)] pr-3 scrollbar-thin">
      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          Filters
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Language</Label>
            <Select
              value={filters.language || "Any"}
              onValueChange={(v) =>
                update({ language: v === "Any" ? "" : v ?? "" })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Time Period</Label>
            <Select
              value={filters.timePeriod}
              onValueChange={(v) =>
                update({ timePeriod: (v ?? "weekly") as Filters["timePeriod"] })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Stars Min</Label>
              <Input
                type="number"
                className="h-8 text-sm bg-background/50"
                placeholder="0"
                value={filters.starsMin || ""}
                onChange={(e) =>
                  update({ starsMin: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Stars Max</Label>
              <Input
                type="number"
                className="h-8 text-sm bg-background/50"
                placeholder="Any"
                value={filters.starsMax || ""}
                onChange={(e) =>
                  update({ starsMax: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Forks Min</Label>
              <Input
                type="number"
                className="h-8 text-sm bg-background/50"
                placeholder="0"
                value={filters.forksMin || ""}
                onChange={(e) =>
                  update({ forksMin: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5">Forks Max</Label>
              <Input
                type="number"
                className="h-8 text-sm bg-background/50"
                placeholder="Any"
                value={filters.forksMax || ""}
                onChange={(e) =>
                  update({ forksMax: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Created After</Label>
            <Input
              type="date"
              className="h-8 text-sm bg-background/50"
              value={filters.createdAfter}
              onChange={(e) => update({ createdAfter: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Updated After</Label>
            <Input
              type="date"
              className="h-8 text-sm bg-background/50"
              value={filters.updatedAfter}
              onChange={(e) => update({ updatedAfter: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">License</Label>
            <Select
              value={filters.license || "Any"}
              onValueChange={(v) =>
                update({ license: v === "Any" ? "" : v ?? "" })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LICENSES.map((lic) => (
                  <SelectItem key={lic} value={lic}>
                    {lic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(v) =>
                update({ sortBy: (v ?? "stars_gained") as Filters["sortBy"] })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stars_gained">Stars Gained</SelectItem>
                <SelectItem value="stars">Total Stars</SelectItem>
                <SelectItem value="forks">Forks</SelectItem>
                <SelectItem value="recent_activity">Recent Activity</SelectItem>
                <SelectItem value="trending_score">Trending Score</SelectItem>
                <SelectItem value="friendliness_score">
                  Contribution Score
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-chart-3 mb-4">
          Advanced
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Domain / Field</Label>
            <Select
              value={filters.domain || "Any"}
              onValueChange={(v) =>
                update({ domain: v === "Any" ? "" : v ?? "" })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Maturity</Label>
            <Select
              value={filters.maturity || "any"}
              onValueChange={(v) =>
                update({
                  maturity: !v || v === "any" ? "" : (v as Filters["maturity"]),
                })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
                <SelectItem value="growing">Growing</SelectItem>
                <SelectItem value="production">Production Ready</SelectItem>
                <SelectItem value="established">Established</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-1.5">Activity Health</Label>
            <Select
              value={filters.health || "any"}
              onValueChange={(v) =>
                update({
                  health: !v || v === "any" ? "" : (v as Filters["health"]),
                })
              }
            >
              <SelectTrigger className="h-8 text-sm bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="highly_active">Highly Active</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="stale">Stale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="opacity-30" />

          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="good-first-issues"
                checked={filters.hasGoodFirstIssues}
                onCheckedChange={(checked) =>
                  update({ hasGoodFirstIssues: !!checked })
                }
              />
              <Label htmlFor="good-first-issues" className="text-sm text-muted-foreground cursor-pointer">
                Has Good First Issues
              </Label>
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id="beginner-friendly"
                checked={filters.beginnerFriendly}
                onCheckedChange={(checked) =>
                  update({ beginnerFriendly: !!checked })
                }
              />
              <Label htmlFor="beginner-friendly" className="text-sm text-muted-foreground cursor-pointer">
                Beginner Friendly
              </Label>
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id="rising"
                checked={filters.risingFromObscurity}
                onCheckedChange={(checked) =>
                  update({ risingFromObscurity: !!checked })
                }
              />
              <Label htmlFor="rising" className="text-sm text-muted-foreground cursor-pointer">
                Rising From Obscurity
              </Label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
