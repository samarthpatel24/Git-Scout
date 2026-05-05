"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <Input
        type="text"
        placeholder="Search repositories, topics, or stacks..."
        className="pl-9 h-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
