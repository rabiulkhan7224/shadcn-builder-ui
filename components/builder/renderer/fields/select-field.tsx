"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Select as SelectElement } from "@/lib/schema/form-builder.schema";

interface SelectFieldProps {
  element: SelectElement;
}

export default function SelectField({ element }: SelectFieldProps) {
  return (
    <Field className={element.className}>
      {element.label && (
        <FieldLabel htmlFor={element.id}>{element.label}</FieldLabel>
      )}

      <Select disabled={element.disabled}>
        <SelectTrigger id={element.id}>
          <SelectValue placeholder={element.placeholder} />
        </SelectTrigger>

        <SelectContent>
          {element.options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}
