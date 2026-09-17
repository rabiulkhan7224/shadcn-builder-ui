"use client";

import * as React from "react";
import type { H1 as H1Element } from "@/lib/schema/form-builder.schema";
import { cn } from "@/lib/utils";

interface H1FieldProps {
  element: H1Element;
}

export function H1Field({ element }: H1FieldProps) {
  return (
    <h1
      id={element.id}
      className={cn(
        "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground",
        element.className
      )}
    >
      {element.content || "Heading 1"}
    </h1>
  );
}

export default H1Field;
