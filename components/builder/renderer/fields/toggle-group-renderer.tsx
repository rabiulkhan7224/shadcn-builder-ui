"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ToggleGroup as ToggleGroupElement } from "@/lib/schema/form-builder.schema";
interface ToggleGroupFieldProps {
  element: ToggleGroupElement;
}
export default function ToggleGroupField({ element }: ToggleGroupFieldProps) {
  return (
    <Field className={element.className}>
      {" "}
      {element.label && <FieldLabel>{element.label}</FieldLabel>}{" "}
      <ToggleGroup
        type={element.type}
        disabled={element.disabled}
        variant="outline"
      >
        {" "}
        {element.options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {" "}
            {option.label}{" "}
          </ToggleGroupItem>
        ))}{" "}
      </ToggleGroup>{" "}
      {element.description && (
        <FieldDescription> {element.description} </FieldDescription>
      )}{" "}
    </Field>
  );
}
