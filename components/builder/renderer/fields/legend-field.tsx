"use client";

import * as React from "react";
import { FieldLegend } from "@/components/ui/field";
import type { Legend as LegendElement } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface LegendFieldProps {
  element: LegendElement;
}

export function LegendField({ element }: LegendFieldProps) {
  return (
    <FieldLegend
      id={element.id}
      className={cn(
        "text-base font-semibold tracking-tight text-foreground",
        element.className
      )}
    >
      {element.content || "Form Section Legend"}
    </FieldLegend>
  );
}

export default LegendField;
