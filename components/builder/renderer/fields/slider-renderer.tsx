"use client";

import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import type { Slider as SliderElement } from "@/lib/schema/form-builder.schema";

interface SliderFieldProps {
  element: SliderElement;
}

export function SliderField({ element }: SliderFieldProps) {
  const initialValue = React.useMemo(() => {
    if (Array.isArray(element.value) && element.value.length > 0) {
      return element.value;
    }
    if (typeof element.defaultValue === "number") {
      return [element.defaultValue];
    }
    if (Array.isArray(element.defaultValue)) {
      return element.defaultValue as number[];
    }
    return [element.min ?? 0];
  }, [element.value, element.defaultValue, element.min]);

  const [currentValue, setCurrentValue] = React.useState<number[]>(initialValue);

  return (
    <Field className={element.className}>
      <div className="flex items-center justify-between">
        {element.label && (
          <FieldLabel htmlFor={element.id}>
            {element.label}
            {element.required && (
              <span className="text-destructive ml-0.5">*</span>
            )}
          </FieldLabel>
        )}
        <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {currentValue.join(", ")}
        </span>
      </div>

      <div className="pt-2 pb-1">
        <Slider
          id={element.id}
          value={currentValue}
          onValueChange={setCurrentValue}
          min={element.min ?? 0}
          max={element.max ?? 100}
          step={element.step ?? 1}
          disabled={element.disabled}
        />
      </div>

      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{element.min ?? 0}</span>
        <span>{element.max ?? 100}</span>
      </div>

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}

export default SliderField;
