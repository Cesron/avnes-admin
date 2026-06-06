"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FamiliesFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function FamiliesFilters({
  searchValue,
  onSearchChange,
}: FamiliesFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-2 min-w-[250px] flex-1 max-w-md">
        <label
          htmlFor="families-search"
          className="text-sm font-medium text-muted-foreground"
        >
          Buscar
        </label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="families-search"
            placeholder="Buscar por código penpal o nombre de niño..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
