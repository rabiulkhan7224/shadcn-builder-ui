"use client";

import * as React from "react";
import { format as formatDate } from "date-fns";
import { CalendarDays, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DatePicker as DatePickerElement } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  element: DatePickerElement;
}

export function DatePickerField({ element }: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  const initialDate = React.useMemo(() => {
    if (typeof element.defaultValue === "string" && element.defaultValue) {
      const parsed = new Date(element.defaultValue);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return undefined;
  }, [element.defaultValue]);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    initialDate
  );

  const formatPattern = element.format || "PPP";

  const formattedDisplay = React.useMemo(() => {
    if (!selectedDate) return null;
    try {
      return formatDate(selectedDate, formatPattern);
    } catch {
      return selectedDate.toLocaleDateString();
    }
  }, [selectedDate, formatPattern]);

  const disabledDates = React.useMemo(() => {
    const matchers: Array<{ before?: Date; after?: Date }> = [];
    if (element.minDate) {
      const min = new Date(element.minDate);
      if (!isNaN(min.getTime())) matchers.push({ before: min });
    }
    if (element.maxDate) {
      const max = new Date(element.maxDate);
      if (!isNaN(max.getTime())) matchers.push({ after: max });
    }
    return matchers.length > 0 ? matchers : undefined;
  }, [element.minDate, element.maxDate]);

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.disabled) return;
    setSelectedDate(undefined);
  };

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
          <Button
            id={element.id}
            type="button"
            variant="outline"
            disabled={element.disabled}
            className={cn(
              "w-full justify-between text-left font-normal h-9 px-3",
              !selectedDate && "text-muted-foreground",
              element.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">
                {formattedDisplay || element.placeholder || "Pick a date"}
              </span>
            </div>

            {selectedDate && !element.disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e as unknown as React.MouseEvent)}
                className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label="Clear date"
              >
                <X className="size-3.5" />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDate}
            disabled={disabledDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}

export default DatePickerField;
