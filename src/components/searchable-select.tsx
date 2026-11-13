"use client";

import { SearchIcon } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { cn } from "@/lib/cn";
import { normalizeString } from "@/utils/normalize-string";

type SelectOption = { value: string; label: string };

type SearchableSelectProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange" | "children"
> & {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
};

function matchesSearch(option: SelectOption, query: string) {
  return normalizeString(option.label).includes(normalizeString(query.trim()));
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  className,
  disabled,
  ref,
  ...props
}: SearchableSelectProps) {
  const portalContainer = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(option) => {
        if (option) onValueChange(option.value);
      }}
      isItemEqualToValue={(option, current) => option.value === current.value}
      filter={matchesSearch}
      inputValue={query}
      onInputValueChange={setQuery}
      onOpenChange={(open) => {
        if (open) setQuery("");
      }}
      disabled={disabled}
      autoHighlight
    >
      <ComboboxTrigger
        {...props}
        ref={(element) => {
          // Keep the popup inside the form dialog's focus and scroll boundaries.
          portalContainer.current =
            element?.closest('[data-slot="dialog-content"]') ?? null;
          if (typeof ref === "function") return ref(element);
          if (ref) ref.current = element;
        }}
        type="button"
        disabled={disabled}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:h-9",
          className,
        )}
      >
        <span
          className={cn(
            "truncate text-start",
            !selected && "text-muted-foreground",
          )}
        >
          <ComboboxValue placeholder={placeholder} />
        </span>
      </ComboboxTrigger>
      <ComboboxContent
        container={portalContainer}
        aria-label={searchPlaceholder}
        className="min-w-(--anchor-width) [&>[data-slot=input-group]]:h-11 md:[&>[data-slot=input-group]]:h-9"
      >
        <ComboboxInput
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          showTrigger={false}
          autoComplete="off"
        >
          <InputGroupAddon align="inline-start">
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxEmpty render={<output aria-live="polite" />}>
          No se encontraron resultados.
        </ComboboxEmpty>
        <ComboboxList className="max-h-[min(18rem,calc(var(--available-height)-3.5rem))]">
          {(option: SelectOption) => (
            <ComboboxItem
              key={option.value}
              value={option}
              className="min-h-11 break-words md:min-h-8"
            >
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
