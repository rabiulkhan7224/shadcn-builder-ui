import { z } from "zod";

export const FormBuilderSettingsSchema = z.object({
  defaultRequiredValidation: z.boolean().default(true),
  numericInput: z.boolean().default(false),
  focusOnError: z.boolean().default(true),
  validationMethod: z
    .enum(["onChange", "onBlur", "onDynamic"])
    .default("onDynamic"),
  asyncValidationDebounce: z.number().min(0).max(10000).default(500),
  activeTab: z
    .enum(["builder", "template", "settings", "generate"])
    .default("builder"),
  preferredSchema: z.enum(["zod"]).default("zod"),
  preferredFramework: z.enum(["react"]).default("react"),
  preferredPackageManager: z
    .enum(["pnpm", "npm", "yarn", "bun"])
    .default("pnpm"),
  isCodeSidebarOpen: z.boolean().default(false),
});
export type FormBuilderSettings = z.infer<typeof FormBuilderSettingsSchema>;

// Shared Form Props
const CommonFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  disabled: z.boolean().default(false),
  required: z.boolean().default(false),
  className: z.string().optional(),
  defaultValue: z.unknown().optional(),
});

// Option

export const OptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().default(false),
});
export type Option = z.infer<typeof OptionSchema>;
// Form Elements

const InputTypeSchema = z.enum([
  "text",
  "email",
  "number",
  "tel",
  "url",
  "search",
  "date",
  "time",
  "datetime-local",
]);
export const InputSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Input"),
  type: InputTypeSchema.default("text"),
});
export type InputField = z.infer<typeof InputSchema>;
export const PasswordInputSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Password"),
  type: z.literal("password").default("password"),
});

export type PasswordInput = z.infer<typeof PasswordInputSchema>;

export const OTPInputSchema = CommonFieldSchema.extend({
  fieldType: z.literal("OTP"),
  // ReactNode is not suitable for persistent storage.
  // Keep it flexible if required.
  children: z.unknown().optional(),
});

export type OTPInput = z.infer<typeof OTPInputSchema>;

export const TextareaSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Textarea"),
  rows: z.number().int().min(1).max(50).default(4),
});
export type Textarea = z.infer<typeof TextareaSchema>;

export const CheckboxSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Checkbox"),
  checked: z.boolean().default(false),
});
export type Checkbox = z.infer<typeof CheckboxSchema>;

export const RadioGroupSchema = CommonFieldSchema.extend({
  fieldType: z.literal("RadioGroup"),
  options: z.array(OptionSchema).default([]),
  orientation: z.enum(["horizontal", "vertical"]).default("vertical"),
});
export type RadioGroup = z.infer<typeof RadioGroupSchema>;

export const ToggleGroupSchema = CommonFieldSchema.extend({
  fieldType: z.literal("ToggleGroup"),
  options: z.array(OptionSchema),
  type: z.enum(["single", "multiple"]).default("single"),
});
export type ToggleGroup = z.infer<typeof ToggleGroupSchema>;

export const SwitchSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Switch"),
  checked: z.boolean().default(false),
});
export type Switch = z.infer<typeof SwitchSchema>;

export const SliderSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Slider"),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().positive().default(1),
  value: z.array(z.number()).default([0]),
});
export type Slider = z.infer<typeof SliderSchema>;
export const SelectSchema = CommonFieldSchema.extend({
  fieldType: z.literal("Select"),
  options: z.array(OptionSchema).default([]),
});
export type Select = z.infer<typeof SelectSchema>;
export const MultiSelectSchema = CommonFieldSchema.extend({
  fieldType: z.literal("MultiSelect"),
  options: z.array(OptionSchema).default([]),
  maxSelected: z.number().int().positive().optional(),
});
export type MultiSelect = z.infer<typeof MultiSelectSchema>;
export const DatePickerSchema = CommonFieldSchema.extend({
  fieldType: z.literal("DatePicker"),
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  format: z.string().default("yyyy-MM-dd"),
});
export type DatePicker = z.infer<typeof DatePickerSchema>;

// Static Elements

const StaticBaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  static: z.literal(true),
});
export const H1Schema = StaticBaseSchema.extend({
  fieldType: z.literal("H1"),
  content: z.string(),
});

export const H2Schema = StaticBaseSchema.extend({
  fieldType: z.literal("H2"),
  content: z.string(),
});

export const H3Schema = StaticBaseSchema.extend({
  fieldType: z.literal("H3"),
  content: z.string(),
});
export const DividerSchema = StaticBaseSchema.extend({
  fieldType: z.literal("Separator"),
});

export const DescriptionSchema = StaticBaseSchema.extend({
  fieldType: z.literal("FieldDescription"),
  content: z.string(),
});

export const LegendSchema = StaticBaseSchema.extend({
  fieldType: z.literal("FieldLegend"),
  content: z.string(),
});
// Recursive Form Elements

// Form Array
export const FormArrayEntrySchema = z.object({
  id: z.string(),
  fields: z.lazy(() => FormElementListSchema),
});

export type FormArrayEntry = z.infer<typeof FormArrayEntrySchema>;

export const FormArraySchema = z.object({
  fieldType: z.literal("FormArray"),
  id: z.string(),
  name: z.string(),
  label: z.string().optional(),
  fields: z.lazy(() => FormElementListSchema),
  entries: z.array(FormArrayEntrySchema).default([]),
});

export type FormArray = z.infer<typeof FormArraySchema>;

// Form Element Schema
export const FormElementSchema: z.ZodTypeAny = z.lazy(() =>
  z.discriminatedUnion("fieldType", [
    InputSchema,
    PasswordInputSchema,
    OTPInputSchema,
    TextareaSchema,
    CheckboxSchema,
    RadioGroupSchema,
    ToggleGroupSchema,
    SwitchSchema,
    SliderSchema,
    SelectSchema,
    MultiSelectSchema,
    DatePickerSchema,
    H1Schema,
    H2Schema,
    H3Schema,
    DividerSchema,
    DescriptionSchema,
    LegendSchema,
    FormArraySchema,
  ]),
);
export type FormElement = z.infer<typeof FormElementSchema>;

// Recursive List Schemas
export const FormElementOrListSchema = z.lazy(() =>
  z.union([FormElementSchema, z.array(FormElementSchema)]),
);

export const FormElementListSchema = z.array(FormElementSchema);

// Form Step
export const FormStepSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.lazy(() => FormElementListSchema),
});

export type FormStep = z.infer<typeof FormStepSchema>;

// Form Elements
// export type FormElement =
//   | InputField
//   | PasswordInput
//   | OTPInput
//   | Textarea
//   | Checkbox
//   | RadioGroup
//   | ToggleGroup
//   | Switch
//   | Slider
//   | Select
//   | MultiSelect
//   | DatePicker
//   | H1
//   | H2
//   | H3
//   | Divider
//   | Description
//   | Legend
//   | FormArray;
export const FormElementsSchema = z.array(FormElementOrListSchema);
export type FormElements = z.infer<typeof FormElementsSchema>;
// Unified Form Builder Schema
export const FormBuilderSchema = z.object({
  id: z.string(),
  formName: z.string().default("draft"),
  schemaName: z.string().default("draftFormSchema"),
  isMultiStep: z.boolean().default(false),
  steps: z.array(FormStepSchema).default([]),
  formElements: FormElementsSchema.default([]),
  settings: FormBuilderSettingsSchema.default({}),
  lastAddedStepIndex: z.number().int().optional(),
  generatedCommandUrl: z.string().optional(),
});

export type FormBuilder = z.infer<typeof FormBuilderSchema>;
// Saved Form Template

export const SavedFormTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  data: FormBuilderSchema,
  createdAt: z.string(),
  generatedCommandUrl: z.string().optional(),
});
export type SavedFormTemplate = z.infer<typeof SavedFormTemplateSchema>;

// Utility Types
export type ValidationMethod = FormBuilderSettings["validationMethod"];
export type PreferredSchema = FormBuilderSettings["preferredSchema"];
export type PreferredFramework = FormBuilderSettings["preferredFramework"];
export type PreferredPackageManager =
  FormBuilderSettings["preferredPackageManager"];
export type ActiveTab = FormBuilderSettings["activeTab"];
