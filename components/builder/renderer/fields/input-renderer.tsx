import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputField } from "@/lib/schema/form-builder.schema";

interface InputRendererProps {
  element: InputField;
}
export function InputRenderer({ element }: InputRendererProps) {
  return (
    <Field className={element.className}>
      {element.label && (
        <FieldLabel htmlFor={element.id}>{element.label}</FieldLabel>
      )}

      <Input
        id={element.id}
        name={element.name}
        type={element.type ?? "text"}
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
