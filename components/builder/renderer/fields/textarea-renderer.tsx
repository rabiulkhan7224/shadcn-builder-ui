"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Textarea as TextareaElement } from "@/lib/schema/form-builder.schema";
interface TextareaFieldProps {
  element: TextareaElement;
}
export default function TextareaField({ element }: TextareaFieldProps) {
  return (
    <Field className={element.className}>
      {" "}
      {element.label && (
        <FieldLabel htmlFor={element.id}> {element.label} </FieldLabel>
      )}{" "}
      <Textarea
        id={element.id}
        name={element.name}
        placeholder={element.placeholder}
        disabled={element.disabled}
        defaultValue={
          typeof element.defaultValue === "string"
            ? element.defaultValue
            : undefined
        }
      />{" "}
      {element.description && (
        <FieldDescription> {element.description} </FieldDescription>
      )}{" "}
    </Field>
  );
}
