"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import type { Divider as DividerElement } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface DividerFieldProps {
  element: DividerElement;
}

export function DividerField({ element }: DividerFieldProps) {
  return (
    <div id={element.id} className={cn("py-2 w-full", element.className)}>
      <Separator />
    </div>
  );
}

export default DividerField;
