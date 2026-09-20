import type {
  FormBuilder,
  FormElement,
  Option,
} from "@/lib/schema/form-builder.schema";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export type FormCodeOutput = {
  zod: string;
  reactHookForm: string;
  tanstackForm: string;
  typescript: string;
  installCommands: Record<PackageManager, string>;
};

const staticFieldTypes = new Set([
  "H1",
  "H2",
  "H3",
  "Separator",
  "FieldDescription",
  "FieldLegend",
]);

const sanitizeIdentifier = (value: string) => {
  const sanitized = value
    .trim()
    .replace(/[^a-zA-Z0-9_$]+/g, "_")
    .replace(/^\d+/, "_");

  return sanitized || "field";
};

const toStringLiteral = (
  value: string | number | boolean | null | undefined,
) => {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(String(value));
};

const getFieldName = (element: FormElement) => {
  if (typeof element.name === "string" && element.name.trim().length > 0) {
    return sanitizeIdentifier(element.name);
  }

  return sanitizeIdentifier(`${element.fieldType}_${element.id.slice(0, 6)}`);
};

const getDefaultValueExpression = (element: FormElement) => {
  if ("defaultValue" in element && element.defaultValue !== undefined) {
    if (typeof element.defaultValue === "string") {
      return JSON.stringify(element.defaultValue);
    }

    if (typeof element.defaultValue === "number") {
      return String(element.defaultValue);
    }

    if (typeof element.defaultValue === "boolean") {
      return element.defaultValue ? "true" : "false";
    }

    return JSON.stringify(element.defaultValue);
  }

  switch (element.fieldType) {
    case "Checkbox":
    case "Switch":
      return "false";
    case "Slider":
      return "[0]";
    case "MultiSelect":
    case "ToggleGroup":
      return "[]";
    case "Input":
      return element.type === "number" ? "0" : "";
    case "DatePicker":
      return "";
    default:
      return "";
  }
};

const getElementOptions = (element: FormElement) => {
  if ("options" in element && Array.isArray(element.options)) {
    return element.options as Option[];
  }

  return [];
};

const appendValidation = (expression: string, element: FormElement) => {
  const fieldName = element.label || element.name || element.fieldType;
  let result = expression;

  if (element.required) {
    if (
      result.includes("z.boolean") ||
      result.includes("z.array") ||
      result.includes("z.number")
    ) {
      result = `${result}.refine((value) => value !== undefined && value !== null && value !== "", "${fieldName} is required")`;
      if (result.includes("z.array")) {
        result = `${result}.refine((value) => Array.isArray(value) && value.length > 0, "${fieldName} is required")`;
      }
    } else {
      result = `${result}.min(1, "${fieldName} is required")`;
    }
  }

  if ("minLength" in element && typeof element.minLength === "number") {
    result = `${result}.min(${element.minLength})`;
  }

  if ("maxLength" in element && typeof element.maxLength === "number") {
    result = `${result}.max(${element.maxLength})`;
  }

  if ("min" in element && typeof element.min === "number") {
    result = `${result}.min(${element.min})`;
  }

  if ("max" in element && typeof element.max === "number") {
    result = `${result}.max(${element.max})`;
  }

  if (
    "pattern" in element &&
    typeof element.pattern === "string" &&
    element.pattern.length > 0
  ) {
    const pattern = JSON.stringify(element.pattern);
    result = `${result}.regex(new RegExp(${pattern}))`;
  }

  if ("email" in element && element.email === true) {
    result = `${result}.email("Invalid email address")`;
  }

  if ("url" in element && element.url === true) {
    result = `${result}.url("Invalid URL")`;
  }

  return result;
};

const buildZodExpression = (element: FormElement) => {
  let expression = "z.string()";

  switch (element.fieldType) {
    case "Input": {
      expression =
        element.type === "number"
          ? "z.coerce.number()"
          : element.type === "date"
            ? "z.coerce.date()"
            : "z.string()";
      break;
    }
    case "Password":
    case "OTP":
    case "Textarea":
      expression = "z.string()";
      break;
    case "Checkbox":
    case "Switch":
      expression = "z.boolean()";
      break;
    case "RadioGroup":
    case "Select": {
      const options = getElementOptions(element);
      if (options.length > 0) {
        const values = options
          .map((option) => toStringLiteral(option.value))
          .join(", ");
        expression = `z.enum([${values}])`;
      }
      break;
    }
    case "ToggleGroup": {
      const options = getElementOptions(element);
      expression =
        element.type === "multiple" ||
        (options.length > 0 &&
          "multiple" in element &&
          element.type === "multiple")
          ? "z.array(z.string())"
          : "z.string()";
      break;
    }
    case "Slider":
      expression = "z.array(z.number())";
      break;
    case "MultiSelect":
      expression = "z.array(z.string())";
      break;
    case "DatePicker":
      expression = "z.coerce.date()";
      break;
    case "FormArray":
      expression = `z.array(z.object({${(element.fields ?? [])
        .map((field: FormElement) => {
          if (staticFieldTypes.has(field.fieldType)) {
            return null;
          }

          return `${getFieldName(field)}: ${buildZodExpression(field)}`;
        })
        .filter(Boolean)
        .join(", ")}}))`;
      break;
    default:
      expression = "z.string()";
      break;
  }

  return appendValidation(expression, element);
};

const getFormFields = (form: FormBuilder) =>
  form.formElements
    .flatMap((element) => (Array.isArray(element) ? element : [element]))
    .filter((element) => !staticFieldTypes.has(element.fieldType));

const getUsedUIComponents = (form: FormBuilder) => {
  const fields = getFormFields(form);
  const set = new Set<string>();

  for (const el of fields) {
    switch (el.fieldType) {
      case "Input":
      case "Password":
      case "OTP":
      case "DatePicker":
        set.add("Input");
        break;
      case "Textarea":
        set.add("Textarea");
        break;
      case "Checkbox":
        set.add("Checkbox");
        break;
      case "Switch":
        set.add("Switch");
        break;
      case "Select":
      case "MultiSelect":
        set.add("Select");
        set.add("SelectContent");
        set.add("SelectItem");
        set.add("SelectTrigger");
        set.add("SelectValue");
        break;
      case "RadioGroup":
        set.add("RadioGroup");
        set.add("RadioGroupItem");
        break;
      case "Slider":
        // Slider renderer uses slider UI but generator currently stubs it; include nothing
        break;
      default:
        break;
    }
  }

  // Always include form primitives and Button for submit
  set.add("Form");
  set.add("FormControl");
  set.add("FormField");
  set.add("FormItem");
  set.add("FormLabel");
  set.add("FormMessage");
  set.add("Button");

  return set;
};

const generateZodSchemaSource = (form: FormBuilder) => {
  const entries = getFormFields(form)
    .map(
      (element) => `${getFieldName(element)}: ${buildZodExpression(element)}`,
    )
    .join(",\n  ");

  return `import { z } from "zod";\n\nexport const formSchema = z.object({\n  ${entries || ""}\n});\n\nexport type FormValues = z.infer<typeof formSchema>;`;
};

const generateDefaultValuesObject = (form: FormBuilder) => {
  const entries = getFormFields(form)
    .map(
      (element) =>
        `    ${JSON.stringify(getFieldName(element))}: ${getDefaultValueExpression(element)}`,
    )
    .join(",\n");

  return `{
${entries || ""}
  }`;
};

const generateFormDefaults = (form: FormBuilder) => {
  const entries = getFormFields(form)
    .map(
      (element) =>
        `  ${JSON.stringify(getFieldName(element))}: ${getDefaultValueExpression(element)}`,
    )
    .join(",\n");

  return `const defaultValues = {
${entries || ""}
};`;
};

const renderFieldMarkup = (element: FormElement) => {
  const name =
    element.name ||
    `${element.fieldType.toLowerCase()}_${element.id.slice(0, 6)}`;
  const label = element.label || name;

  switch (element.fieldType) {
    case "Input":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <Input type="${element.type || "text"}" placeholder=${JSON.stringify(element.placeholder || "Enter value")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "Password":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <Input type="password" placeholder=${JSON.stringify(element.placeholder || "Enter password")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "Textarea":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <Textarea placeholder=${JSON.stringify(element.placeholder || "Enter value")} rows={${element.rows ?? 4}} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "Checkbox":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 rounded-md border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>${label}</FormLabel>
              </div>
            </FormItem>
          )}
        />`;
    case "Switch":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>${label}</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />`;
    case "Select": {
      const options = getElementOptions(element)
        .map(
          (option) =>
            `                  <SelectItem value=${JSON.stringify(option.value)}>${option.label}</SelectItem>`,
        )
        .join("\n");
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder=${JSON.stringify(element.placeholder || "Select an option")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  ${options}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />`;
    }
    case "MultiSelect":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <div className="rounded-md border p-2 text-sm text-muted-foreground">
                  Multi-select state: {JSON.stringify(field.value ?? [])}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "RadioGroup":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                  ${getElementOptions(element)
                    .map(
                      (option) =>
                        `<div key="${option.value}" className="flex items-center space-x-2"><RadioGroupItem value=${JSON.stringify(option.value)} id=${JSON.stringify(`${name}-${option.value}`)} /><label htmlFor=${JSON.stringify(`${name}-${option.value}`)}>${option.label}</label></div>`,
                    )
                    .join("\n")} 
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "DatePicker":
      return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <Input type="date" value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""} onChange={(event) => field.onChange(event.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
    default:
      return `
        <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          Unsupported field: ${element.fieldType}
        </div>`;
  }
};

const generateReactHookFormSource = (form: FormBuilder) => {
  const fields = getFormFields(form)
    .map((element) => renderFieldMarkup(element))
    .join("\n");

  const used = getUsedUIComponents(form);

  const imports: string[] = [];
  // core imports
  imports.push('import { z } from "zod";');
  imports.push('import { useForm } from "react-hook-form";');
  imports.push('import { zodResolver } from "@hookform/resolvers/zod";');

  // UI imports based on usage
  if (used.has("Button")) {
    imports.push('import { Button } from "@/components/ui/button";');
  }

  if (used.has("Checkbox")) {
    imports.push('import { Checkbox } from "@/components/ui/checkbox";');
  }

  // Form primitives
  if (
    used.has("Form") ||
    used.has("FormControl") ||
    used.has("FormField") ||
    used.has("FormItem") ||
    used.has("FormLabel") ||
    used.has("FormMessage")
  ) {
    imports.push(
      'import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";',
    );
  }

  if (used.has("Input")) {
    imports.push('import { Input } from "@/components/ui/input";');
  }

  if (used.has("RadioGroup")) {
    imports.push(
      'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";',
    );
  }

  if (used.has("Select")) {
    imports.push(
      'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";',
    );
  }

  if (used.has("Switch")) {
    imports.push('import { Switch } from "@/components/ui/switch";');
  }

  if (used.has("Textarea")) {
    imports.push('import { Textarea } from "@/components/ui/textarea";');
  }

  const importBlock = imports.join("\n");

  return `${importBlock}

${generateZodSchemaSource(form)}

${generateFormDefaults(form)}

export function GeneratedForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-4">
        ${fields}
        <Button type="submit">${form.submit?.label ?? "Submit"}</Button>
      </form>
    </Form>
  );
}`;
};

const generateTanStackFormSource = (form: FormBuilder) => {
  const fieldEntries = getFormFields(form)
    .map((element) => {
      const name = getFieldName(element);
      return `      <label className="block text-sm font-medium" htmlFor="${name}">${element.label || name}</label>\n      <input\n        id="${name}"\n        name="${name}"\n        defaultValue={${getDefaultValueExpression(element)}}\n        className="mt-1 w-full rounded-md border px-3 py-2"\n        onChange={(event) => form.setFieldValue(${JSON.stringify(name)}, event.target.value)}\n      />`;
    })
    .join("\n");

  return `import { useForm } from "@tanstack/react-form";\nimport { z } from "zod";\n\n${generateZodSchemaSource(form)}\n\nexport function GeneratedForm() {\n  const form = useForm({\n    defaultValues: ${generateDefaultValuesObject(form)},\n    validators: {\n      onChange: formSchema,\n    },\n    onSubmit: ({ value }) => {\n      console.log(value);\n    },\n  });\n\n  return (\n    <form\n      onSubmit={(event) => {\n        event.preventDefault();\n        void form.handleSubmit();\n      }}\n      className="space-y-4"\n    >\n${fieldEntries}\n      <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">${form.submit?.label ?? "Submit"}</button>\n    </form>\n  );\n}`;
};

const generateTypeScriptSource = (form: FormBuilder) => {
  const schemaSource = generateZodSchemaSource(form);
  const defaults = generateFormDefaults(form);

  return `${schemaSource}\n\n${defaults}\n\nexport type FormDraft = {\n  schema: typeof formSchema;\n  defaultValues: typeof defaultValues;\n};`;
};

export const generateFormCode = (form: FormBuilder): FormCodeOutput => {
  const installCommands: Record<PackageManager, string> = {
    pnpm: "pnpm add react-hook-form @hookform/resolvers zod @tanstack/react-form",
    npm: "npm install react-hook-form @hookform/resolvers zod @tanstack/react-form",
    yarn: "yarn add react-hook-form @hookform/resolvers zod @tanstack/react-form",
    bun: "bun add react-hook-form @hookform/resolvers zod @tanstack/react-form",
  };

  return {
    zod: generateZodSchemaSource(form),
    reactHookForm: generateReactHookFormSource(form),
    tanstackForm: generateTanStackFormSource(form),
    typescript: generateTypeScriptSource(form),
    installCommands,
  };
};

export const generateZodSchemaCode = (form: FormBuilder) =>
  generateFormCode(form).zod;
export const generateReactHookFormCode = (form: FormBuilder) =>
  generateFormCode(form).reactHookForm;
export const generateTanStackFormCode = (form: FormBuilder) =>
  generateFormCode(form).tanstackForm;
export const generateTypeScriptCode = (form: FormBuilder) =>
  generateFormCode(form).typescript;
