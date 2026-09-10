"use client";

import { FormElements } from "@/lib/schema/form-builder.schema";
import { FormElementRenderer } from "./FormElementRenderer";

interface FormRendererProps {
  elements: FormElements;
}

export function FormRenderer({ elements }: FormRendererProps) {
  return (
    <div className="space-y-6">
      {elements.map((element) => (
        <FormElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
}
