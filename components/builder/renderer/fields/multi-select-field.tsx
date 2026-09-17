"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MultiSelect as MultiSelectElement } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface MultiSelectFieldProps {
  element: MultiSelectElement;
}

export function MultiSelectField({ element }: MultiSelectFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const initialSelected = React.useMemo(() => {
    if (Array.isArray(element.defaultValue)) {
      return element.defaultValue.map(String);
    }
    if (typeof element.defaultValue === "string" && element.defaultValue) {
      return element.defaultValue.split(",").map((s) => s.trim());
    }
    return [];
  }, [element.defaultValue]);

  const [selectedValues, setSelectedValues] =
    React.useState<string[]>(initialSelected);

  const options = element.options ?? [];

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleToggle = (value: string) => {
    if (element.disabled) return;

    setSelectedValues((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      if (element.maxSelected && prev.length >= element.maxSelected) {
        return prev;
      }
      return [...prev, value];
    });
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.disabled) return;
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.disabled) return;
    setSelectedValues([]);
  };

  const selectedOptions = React.useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  return (
    <Field className={element.className}>
      {element.label && (
        <FieldLabel htmlFor={element.id}>
          {element.label}
          {element.required && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            id={element.id}
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex min-h-9 w-full flex-wrap items-center justify-between gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs transition-colors",
              "hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              element.disabled && "cursor-not-allowed opacity-50 pointer-events-none"
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground select-none">
                  {element.placeholder || "Select options..."}
                </span>
              ) : (
                selectedOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="gap-1 py-0 px-2 text-xs font-normal"
                  >
                    <span>{opt.label}</span>
                    {!element.disabled && (
                      <button
                        type="button"
                        onClick={(e) => handleRemove(opt.value, e)}
                        className="rounded-full hover:bg-muted p-0.5 focus:outline-none"
                        aria-label={`Remove ${opt.label}`}
                      >
                        <X className="size-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </Badge>
                ))
              )}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              {selectedValues.length > 0 && !element.disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-5 rounded-full p-0 hover:bg-muted hover:text-foreground"
                  onClick={handleClearAll}
                  aria-label="Clear all selections"
                >
                  <X className="size-3" />
                </Button>
              )}
              <ChevronsUpDown className="size-4 opacity-50" />
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--radix-popover-trigger-width) min-w-[200px] p-0 shadow-md"
          align="start"
        >
          {/* Search bar */}
          <div className="flex items-center border-b px-2.5 py-1.5 gap-2">
            <Search className="size-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Filter options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                const isAtLimit =
                  !isSelected &&
                  Boolean(element.maxSelected) &&
                  selectedValues.length >= (element.maxSelected ?? 0);

                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      if (!opt.disabled && !isAtLimit) {
                        handleToggle(opt.value);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent/50 font-medium",
                      (opt.disabled || isAtLimit) &&
                        "cursor-not-allowed opacity-50 pointer-events-none"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-xs border border-primary/50",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "opacity-40"
                      )}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note if maxSelected is set */}
          {element.maxSelected && (
            <div className="border-t bg-muted/20 px-2.5 py-1 text-right text-[11px] text-muted-foreground">
              {selectedValues.length} / {element.maxSelected} selected
            </div>
          )}
        </PopoverContent>
      </Popover>

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}

export default MultiSelectField;
