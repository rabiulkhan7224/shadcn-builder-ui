"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { Switch as SwitchElement } from "@/lib/schema/form-builder.schema";
interface SwitchFieldProps {
  element: SwitchElement;
}
export default function SwitchField({ element }: SwitchFieldProps) {
  return (
    <Field orientation="horizontal" className={element.className}>
      {" "}
      <Switch
        id={element.id}
        name={element.name}
        checked={element.checked}
        disabled={element.disabled}
      />{" "}
      <div className="space-y-1">
        {" "}
        {element.label && (
          <FieldLabel htmlFor={element.id}> {element.label} </FieldLabel>
        )}{" "}
        {element.description && (
          <FieldDescription> {element.description} </FieldDescription>
        )}{" "}
      </div>{" "}
    </Field>
  );
}
