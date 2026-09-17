"use client";

import * as React from "react";
import type { H3 as H3Element } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface H3FieldProps {
  element: H3Element;
}

export function H3Field({ element }: H3FieldProps) {
  return (
    <h3
      id={element.id}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
        element.className
      )}
    >
      {element.content || "Heading 3"}
    </h3>
  );
}

export default H3Field;
