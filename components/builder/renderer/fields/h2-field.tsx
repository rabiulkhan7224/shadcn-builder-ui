"use client";

import * as React from "react";
import type { H2 as H2Element } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface H2FieldProps {
  element: H2Element;
}

export function H2Field({ element }: H2FieldProps) {
  return (
    <h2
      id={element.id}
      className={cn(
        "scroll-m-20 border-b pb-1.5 text-2xl font-semibold tracking-tight text-foreground first:mt-0",
        element.className
      )}
    >
      {element.content || "Heading 2"}
    </h2>
  );
}

export default H2Field;
