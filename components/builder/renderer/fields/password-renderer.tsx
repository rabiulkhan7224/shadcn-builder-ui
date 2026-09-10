"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import type { PasswordInput } from "@/lib/schema/form-builder.schema";

interface PasswordFieldProps {
  element: PasswordInput;
}

export default function PasswordField({ element }: PasswordFieldProps) {
  return (
    <Field className={element.className}>
      {element.label && (
        <FieldLabel htmlFor={element.id}>{element.label}</FieldLabel>
      )}

      <Input
        id={element.id}
        name={element.name}
        type="password"
        placeholder={element.placeholder}
        disabled={element.disabled}
        defaultValue={
          typeof element.defaultValue === "string"
            ? element.defaultValue
            : undefined
        }
      />

      {element.description && (
        <FieldDescription>{element.description}</FieldDescription>
      )}
    </Field>
  );
}
