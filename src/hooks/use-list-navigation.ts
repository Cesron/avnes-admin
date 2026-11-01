"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export function useListNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [isPending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draft = useRef(search);
  const dirty = useRef(false);
  const urlSearch = params.get("search") ?? "";
  useEffect(() => {
    // An older response must not replace text typed while it was in flight.
    if (draft.current.trim() === urlSearch) {
      dirty.current = false;
    } else if (!dirty.current) {
      draft.current = urlSearch;
      setSearch(urlSearch);
    }
  }, [urlSearch]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function navigate(changes: Record<string, string | null>, replace = false) {
    if (timer.current) clearTimeout(timer.current);
    const next = new URLSearchParams(params.toString());
    next.delete("after");
    next.delete("before");
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    startTransition(() => {
      const url = `${pathname}?${next.toString()}`;
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    });
  }
  function changeSearch(value: string) {
    draft.current = value;
    dirty.current = value.trim() !== urlSearch;
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => navigate({ search: value.trim() }, true),
      300,
    );
  }
  return {
    search,
    changeSearch,
    navigate,
    params,
    isPending,
    busy: isPending || search.trim() !== (params.get("search") ?? ""),
  };
}
