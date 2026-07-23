"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface OptionItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  loading?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  loading = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = options.find((opt) => opt.id === value);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="w-full justify-between font-normal text-xs h-10 px-3 bg-background"
      >
        <span className="truncate">
          {selectedItem ? selectedItem.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-7 border-none bg-transparent p-0 text-xs focus-visible:ring-0 shadow-none"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto p-1 text-xs">
            {loading ? (
              <div className="p-3 text-center text-muted-foreground">Loading options...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">No matches found.</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-orange-50 hover:text-[#E8621A]",
                    value === opt.id && "bg-orange-100/70 text-[#E8621A] font-bold"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-[10px] text-muted-foreground">{opt.sublabel}</span>
                    )}
                  </div>
                  {value === opt.id && <Check className="size-4 text-[#E8621A]" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
