"us e client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import type { Checkbox as CheckboxElement } from "@/lib/schema/form-builder.schema";
interface CheckboxFieldProps {
  element: CheckboxElement;
}
export default function CheckboxField({ element }: CheckboxFieldProps) {
  return (
    <Field orientation="horizontal" className={element.className}>
      {" "}
      <Checkbox
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
