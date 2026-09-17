"use client";

import * as React from "react";
import { FieldDescription } from "@/components/ui/field";
import type { Description as DescriptionElement } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface DescriptionFieldProps {
  element: DescriptionElement;
}

export function DescriptionField({ element }: DescriptionFieldProps) {
  return (
    <FieldDescription
      id={element.id}
      className={cn("text-sm text-muted-foreground", element.className)}
    >
      {element.content || "Description or informative text for this section."}
    </FieldDescription>
  );
}

export default DescriptionField;
