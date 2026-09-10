"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { RadioGroup as RadioGroupElement } from "@/lib/schema/form-builder.schema";

interface RadioGroupFieldProps {
  element: RadioGroupElement;
}

export default function RadioGroupField({ element }: RadioGroupFieldProps) {
  return (
    <Field className={element.className}>
      {element.label && <FieldLabel>{element.label}</FieldLabel>}

      <RadioGroup
        name={element.name}
        disabled={element.disabled}
        defaultValue={
          typeof element.defaultValue === "string"
            ? element.defaultValue
            : undefined
        }
      >
        {element.options.map((option) => (
          <Field key={option.value} orientation="horizontal">
            <RadioGroupItem value={option.value} disabled={option.disabled} />

            <FieldLabel className="font-normal">{option.label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}
