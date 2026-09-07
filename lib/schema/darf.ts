// import { z } from "zod";

// // ============================================================================
// // Form Builder Settings Schema
// // ============================================================================

// export const FormBuilderSettingsSchema = z.object({
//   defaultRequiredValidation: z.boolean().default(true),
//   numericInput: z.boolean().default(false),
//   focusOnError: z.boolean().default(true),

//   validationMethod: z
//     .enum(["onChange", "onBlur", "onDynamic"])
//     .default("onDynamic"),

//   asyncValidation: z.number().min(0).max(10000).default(500),

//   activeTab: z
//     .enum(["builder", "template", "settings", "generate"])
//     .default("builder"),

//   preferredSchema: z.enum(["zod"]).default("zod"),

//   preferredFramework: z
//     .enum(["react", "vue", "angular", "solid"])
//     .default("react"),

//   preferredPackageManager: z
//     .enum(["pnpm", "npm", "yarn", "bun"])
//     .default("pnpm"),

//   isCodeSidebarOpen: z.boolean().default(false),
// });

// export type FormBuilderSettings = z.infer<typeof FormBuilderSettingsSchema>;

// // ============================================================================
// // Common HTML Props
// // ============================================================================

// const CommonHtmlProps = z.object({
//   placeholder: z.string().optional(),

//   disabled: z.boolean().optional(),

//   className: z.string().optional(),

//   defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
// });

// // ============================================================================
// // Shared Form Props
// // ============================================================================

// const SharedFormPropsSchema = CommonHtmlProps.extend({
//   id: z.string(),

//   name: z.string(),

//   label: z.string().optional(),

//   description: z.string().optional(),

//   required: z.boolean().optional(),

//   static: z.boolean().optional(),
// });

// // ============================================================================
// // Option
// // ============================================================================

// export const OptionSchema = z.object({
//   value: z.string(),

//   label: z.string(),
// });

// export type Option = z.infer<typeof OptionSchema>;

// // ============================================================================
// // Form Elements
// // ============================================================================

// export const InputSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Input"),

//   type: z.string().optional(),
// });

// export const PasswordInputSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Password"),

//   type: z.literal("password"),
// });

// export const OTPInputSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("OTP"),

//   // ReactNode is not suitable for persistent storage.
//   // Keep it flexible if required.
//   children: z.unknown().optional(),
// });

// export const TextareaSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Textarea"),
// });

// export const CheckboxSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Checkbox"),

//   checked: z.boolean().optional(),
// });

// export const RadioGroupSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("RadioGroup"),

//   options: z.array(OptionSchema),
// });

// export const ToggleGroupSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("ToggleGroup"),

//   options: z.array(OptionSchema),

//   type: z.enum(["single", "multiple"]),
// });

// export const SwitchSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Switch"),

//   checked: z.boolean().optional(),
// });

// export const SliderSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Slider"),

//   min: z.number().optional(),

//   max: z.number().optional(),

//   step: z.number().optional(),

//   value: z.array(z.number()).optional(),
// });

// export const SelectSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("Select"),

//   options: z.array(OptionSchema),

//   placeholder: z.string(),
// });

// export const MultiSelectSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("MultiSelect"),

//   options: z.array(OptionSchema),

//   placeholder: z.string(),
// });

// export const DatePickerSchema = SharedFormPropsSchema.extend({
//   fieldType: z.literal("DatePicker"),
// });

// // ============================================================================
// // Static Elements
// // ============================================================================

// const StaticBaseSchema = z.object({
//   id: z.string(),

//   name: z.string(),

//   static: z.literal(true),

//   content: z.string().optional(),
// });

// export const H1Schema = StaticBaseSchema.extend({
//   fieldType: z.literal("H1"),

//   content: z.string(),
// });

// export const H2Schema = StaticBaseSchema.extend({
//   fieldType: z.literal("H2"),

//   content: z.string(),
// });

// export const H3Schema = StaticBaseSchema.extend({
//   fieldType: z.literal("H3"),

//   content: z.string(),
// });

// export const DividerSchema = StaticBaseSchema.extend({
//   fieldType: z.literal("Separator"),
// });

// export const DescriptionSchema = StaticBaseSchema.extend({
//   fieldType: z.literal("FieldDescription"),

//   content: z.string(),
// });

// export const LegendSchema = StaticBaseSchema.extend({
//   fieldType: z.literal("FieldLegend"),

//   content: z.string(),
// });

// // ============================================================================
// // Recursive Form Elements
// // ============================================================================

// export type FormElement = z.infer<typeof FormElementSchema>;

// export type FormElementOrList = FormElement | FormElement[];

// export type FormElementList = FormElementOrList[];

// // ============================================================================
// // Form Array
// // ============================================================================

// export const FormArrayEntrySchema = z.object({
//   id: z.string(),

//   fields: z.lazy(() => FormElementListSchema),
// });

// export type FormArrayEntry = z.infer<typeof FormArrayEntrySchema>;

// export const FormArraySchema = z.object({
//   fieldType: z.literal("FormArray"),

//   id: z.string(),

//   name: z.string(),

//   label: z.string().optional(),

//   arrayField: z.lazy(() => FormElementListSchema),

//   entries: z.array(FormArrayEntrySchema),
// });

// export type FormArray = z.infer<typeof FormArraySchema>;

// // ============================================================================
// // Form Element Schema
// // ============================================================================

// export const FormElementSchema: z.ZodTypeAny = z.lazy(() =>
//   z.union([
//     InputSchema,

//     PasswordInputSchema,

//     OTPInputSchema,

//     TextareaSchema,

//     CheckboxSchema,

//     RadioGroupSchema,

//     ToggleGroupSchema,

//     SwitchSchema,

//     SliderSchema,

//     SelectSchema,

//     MultiSelectSchema,

//     DatePickerSchema,

//     H1Schema,

//     H2Schema,

//     H3Schema,

//     DividerSchema,

//     DescriptionSchema,

//     LegendSchema,

//     FormArraySchema,
//   ]),
// );

// // ============================================================================
// // Recursive List Schemas
// // ============================================================================

// export const FormElementOrListSchema = z.lazy(() =>
//   z.union([FormElementSchema, z.array(FormElementSchema)]),
// );

// export const FormElementListSchema = z.array(FormElementOrListSchema);

// // ============================================================================
// // Form Step
// // ============================================================================

// export const FormStepSchema = z.object({
//   id: z.string(),

//   stepFields: z.lazy(() => FormElementListSchema),
// });

// export type FormStep = z.infer<typeof FormStepSchema>;

// // ============================================================================
// // Form Elements
// // ============================================================================

// export const FormElementsSchema = z.array(FormElementOrListSchema);

// export type FormElements = z.infer<typeof FormElementsSchema>;

// // ============================================================================
// // Unified Form Builder Schema
// // ============================================================================

// export const FormBuilderSchema = z.object({
//   id: z.number(),

//   formName: z.string().default("draft"),

//   schemaName: z.string().default("draftFormSchema"),

//   isMS: z.boolean().default(false),

//   formElements: FormElementsSchema.default([]),

//   settings: FormBuilderSettingsSchema.default({}),

//   lastAddedStepIndex: z.number().optional(),

//   generatedCommandUrl: z.string().optional(),
// });

// export type FormBuilder = z.infer<typeof FormBuilderSchema>;

// // ============================================================================
// // Saved Form Template
// // ============================================================================

// export const SavedFormTemplateSchema = z.object({
//   id: z.string(),

//   name: z.string(),

//   data: FormBuilderSchema,

//   createdAt: z.string(),

//   generatedCommandUrl: z.string().optional(),
// });

// export type SavedFormTemplate = z.infer<typeof SavedFormTemplateSchema>;

// // ============================================================================
// // Utility Types
// // ============================================================================

// export type ValidationMethod = FormBuilderSettings["validationMethod"];

// export type PreferredSchema = FormBuilderSettings["preferredSchema"];

// export type PreferredFramework = FormBuilderSettings["preferredFramework"];

// export type PreferredPackageManager =
//   FormBuilderSettings["preferredPackageManager"];

// export type ActiveTab = FormBuilderSettings["activeTab"];
