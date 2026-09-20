import { z } from "zod";

import type {
  FormBuilder,
  FormElement,
  Option,
} from "@/lib/schema/form-builder.schema";

function applyValidation(schema: z.ZodType, element: FormElement): z.ZodType {
  const validation = "validation" in element ? element.validation : undefined;

  if (!validation) {
    return schema;
  }

  let result = schema;

  if (validation.required && result instanceof z.ZodString) {
    result = result.min(1, `${element.label ?? element.name} is required`);
  }

  if (validation.minLength !== undefined && result instanceof z.ZodString) {
    result = result.min(validation.minLength);
  }

  if (validation.maxLength !== undefined && result instanceof z.ZodString) {
    result = result.max(validation.maxLength);
  }

  if (validation.min !== undefined && result instanceof z.ZodNumber) {
    result = result.min(validation.min);
  }

  if (validation.max !== undefined && result instanceof z.ZodNumber) {
    result = result.max(validation.max);
  }

  if (validation.email && result instanceof z.ZodString) {
    result = result.email("Invalid email address");
  }

  if (validation.url && result instanceof z.ZodString) {
    result = result.url("Invalid URL");
  }

  if (validation.pattern && result instanceof z.ZodString) {
    result = result.regex(new RegExp(validation.pattern));
  }

  return result;
}

function createElementSchema(element: FormElement): z.ZodType | null {
  switch (element.fieldType) {
    case "Input": {
      let schema: z.ZodType;

      switch (element.type) {
        case "number":
          schema = z.coerce.number();
          break;

        case "date":
          schema = z.coerce.date();
          break;

        default:
          schema = z.string();
      }

      return applyValidation(schema, element);
    }

    case "Password": {
      const schema = z.string();

      return applyValidation(schema, element);
    }

    case "OTP": {
      const schema = z.string();

      return applyValidation(schema, element);
    }

    case "Textarea": {
      const schema = z.string();

      return applyValidation(schema, element);
    }

    case "Checkbox": {
      let schema: z.ZodTypeAny = z.boolean();

      if (element.required) {
        schema = schema.refine(
          (value) => value === true,
          "This field is required",
        );
      }

      return schema;
    }

    case "RadioGroup": {
      const values = element.options.map((option: Option) => option.value);

      if (values.length === 0) {
        return z.string();
      }

      return z.enum(values as [string, ...string[]]);
    }

    case "ToggleGroup": {
      if (element.type === "multiple") {
        return z.array(z.string());
      }

      return z.string();
    }

    case "Switch":
      return z.boolean();

    case "Slider":
      return z.array(z.number());

    case "Select": {
      const values = element.options.map((option: Option) => option.value);

      if (values.length === 0) {
        return z.string();
      }

      return z.enum(values as [string, ...string[]]);
    }

    case "MultiSelect":
      return z.array(z.string());

    case "DatePicker":
      return z.coerce.date();

    // Static elements do not create form values.
    case "H1":
    case "H2":
    case "H3":
    case "Separator":
    case "FieldDescription":
    case "FieldLegend":
      return null;

    case "FormArray": {
      const shape: Record<string, z.ZodType> = {};

      for (const field of element.fields) {
        const schema = createElementSchema(field);

        if (schema) {
          shape[field.name] = schema;
        }
      }

      return z.array(z.object(shape));
    }

    default: {
      const exhaustiveCheck: any = element;
      return exhaustiveCheck;
    }
  }
}

export function generateZodSchema(form: FormBuilder) {
  const shape: Record<string, z.ZodType> = {};

  for (const element of form.formElements) {
    if (!("name" in element)) {
      continue;
    }

    const schema = createElementSchema(element);

    if (!schema) {
      continue;
    }

    shape[element.name] = schema;
  }

  return z.object(shape);
}
