"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type { FamilyWithChildren } from "@/services/families/get-families";
import { getFamiliesAction } from "../_lib/get-families.action";
import { FamiliesCardsGrid } from "./families-cards-grid";
import { FamiliesFilters } from "./families-filters";

interface FamiliesListViewProps {
  initialFamilies: FamilyWithChildren[];
}

export function FamiliesListView({ initialFamilies }: FamiliesListViewProps) {
  const [families, setFamilies] =
    useState<FamilyWithChildren[]>(initialFamilies);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFamilies = useCallback((searchTerm: string) => {
    startTransition(async () => {
      const result = await getFamiliesAction({
        search: searchTerm || undefined,
      });
      setFamilies(result);
    });
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchFamilies(value);
    }, 300);
  };

  const isFiltered = search.trim().length > 0;

  return (
    <div className="space-y-4">
      <FamiliesFilters
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          {isPending ? (
            "Cargando..."
          ) : (
            <>
              {families.length} {families.length === 1 ? "familia" : "familias"}
            </>
          )}
        </p>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <FamiliesCardsGrid familyList={families} isFiltered={isFiltered} />
      )}
    </div>
  );
}
