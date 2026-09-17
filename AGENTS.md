

## Project Overview

Shadcn Builder UI is an open-source visual builder for creating React forms and data tables using:

* React
* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* Zod
* React Hook Form
* TanStack Form
* TanStack Table
* dnd-kit

The primary goal is to allow users to visually build interfaces and generate clean, type-safe React/TypeScript code.

This project is an independent community project. Do not represent it as an official shadcn/ui product.

---

# Development Principles

## General

* Prefer simple, maintainable solutions over clever abstractions.
* Use TypeScript strictly.
* Avoid `any` unless there is a documented and unavoidable reason.
* Keep components small and focused.
* Prefer reusable components over duplicated code.
* Keep business logic outside presentational components.
* Do not introduce dependencies unless they solve a real project requirement.
* Follow existing project conventions before introducing new patterns.
* Do not make unrelated changes while implementing a feature.
* Preserve backward compatibility when modifying persisted builder data.
* Do not remove existing functionality without explicit instruction.

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React

## State

* Zustand
* Zustand persist middleware
* LocalStorage for initial persistence

## Validation

* Zod

## Forms

Support:

* React Hook Form
* TanStack Form

The builder configuration must remain independent of either form library.

## Tables

Use:

* TanStack Table

## Drag and Drop

Use:

* dnd-kit

Do not introduce drag-and-drop logic until the basic builder selection, editing, and element manipulation are stable.

---

# Architecture

The application is divided into four major concerns:

```text
Builder
   ↓
FormBuilder JSON
   ↓
Runtime
   ↓
Code Generator
```

The builder configuration is the source of truth.

```text
Zustand
   ↓
FormBuilder JSON
   ├── form metadata
   ├── settings
   ├── elements
   ├── validation configuration
   ├── multi-step configuration
   └── submit configuration
```

The same configuration should be usable for:

1. Builder preview
2. Runtime form
3. Zod schema generation
4. React Hook Form generation
5. TanStack Form generation
6. TypeScript code generation
7. Saved templates

---

# Builder Architecture

The main builder layout is:

```text
┌─────────────────────────────────────────────────────┐
│ Builder Header                                      │
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│ Fields Panel │     Form Preview     │ Field Editor  │
│              │                      │               │
│              │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

Use shadcn/ui resizable panels:

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>
    <FieldsPanel />
  </ResizablePanel>

  <ResizableHandle withHandle />

  <ResizablePanel>
    <FormPreview />
  </ResizablePanel>

  <ResizableHandle withHandle />

  <ResizablePanel>
    <FieldEditor />
  </ResizablePanel>
</ResizablePanelGroup>
```

---

# Component Responsibilities

## FieldsPanel

Responsible for:

* Showing available field types
* Creating new fields
* Eventually supporting drag-to-canvas

Do not put form state manipulation logic directly into individual field buttons.

Prefer:

```text
fieldDefinitions
      ↓
createField()
      ↓
Zustand.addElement()
```

---

## FormPreview

Responsible for:

* Displaying the current builder canvas
* Rendering builder elements
* Showing empty state
* Showing form metadata

It should not contain field configuration logic.

---

## BuilderElement

Responsible for:

* Selecting an element
* Showing selected state
* Showing field toolbar
* Delete
* Duplicate
* Future drag handle
* Future drag-and-drop behavior

It should NOT be responsible for:

* React Hook Form
* TanStack Form
* Zod validation execution
* API submission
* Business logic

Architecture:

```text
FormPreview
    ↓
BuilderElement
    ↓
FormElementRenderer
    ↓
Field Renderer
```

---

## FieldEditor

Responsible for editing the selected element.

Examples:

```text
General
- Label
- Name
- Description
- Placeholder

Behavior
- Disabled
- Default value

Validation
- Required
- Min length
- Max length
- Pattern
- Email
- URL

Options
- Label
- Value
- Disabled
```

Changes should go through Zustand.

---

# Form Element Architecture

Every form element must have a discriminating `fieldType`.

Example:

```ts
{
  fieldType: "Input",
  id: "uuid",
  name: "email",
  label: "Email",
  type: "email"
}
```

Use a discriminated union rather than loosely typed objects whenever practical.

Example:

```ts
type FormElement =
  | Input
  | PasswordInput
  | OTPInput
  | Textarea
  | Checkbox
  | RadioGroup
  | ToggleGroup
  | Switch
  | Slider
  | Select
  | MultiSelect
  | DatePicker
  | H1
  | H2
  | H3
  | Divider
  | Description
  | Legend
  | FormArray;
```

---

# FormElementRenderer

`FormElementRenderer` is the central dispatcher.

```text
FormElementRenderer
│
├── InputField
├── PasswordField
├── OTPField
├── TextareaField
├── CheckboxField
├── RadioGroupField
├── ToggleGroupField
├── SwitchField
├── SliderField
├── SelectField
├── MultiSelectField
├── DatePickerField
│
├── H1Field
├── H2Field
├── H3Field
├── DividerField
├── DescriptionField
└── LegendField
```

Use a `switch` on `fieldType`.

Do not duplicate the same `fieldType` dispatch logic throughout the application.

---

# Builder vs Runtime

Keep the visual builder separate from the actual form runtime.

## Builder

```text
BuilderElement
    ↓
FormElementRenderer
    ↓
Preview Field
```

The builder fields are primarily visual/configuration previews.

## Runtime

```text
DynamicForm
    ↓
Form Library
    ↓
DynamicFormField
    ↓
Field Component
    ↓
Submit
```

Do not put React Hook Form or TanStack Form inside `BuilderElement`.

---

# Form Runtime

The runtime form should be capable of:

* Rendering fields from `FormBuilder`
* Applying default values
* Applying validation
* Showing validation errors
* Handling submission
* Showing submitting state
* Supporting multi-step forms
* Supporting field arrays
* Supporting controlled components where required

The builder configuration should not depend on a specific runtime form library.

---

# React Hook Form

React Hook Form is one supported runtime/code-generation target.

Use:

```text
React
+
React Hook Form
+
Zod
+
shadcn/ui
```

Do not store React Hook Form objects inside Zustand.

Do not store:

* `useForm()` instances
* `control`
* `register`
* `formState`
* callbacks
* functions

inside the persisted builder state.

Store serializable configuration only.

---

# TanStack Form

TanStack Form is another supported runtime/code-generation target.

The builder configuration must remain framework-independent.

For example:

```ts
formLibrary: "react-hook-form"
```

or:

```ts
formLibrary: "tanstack-form"
```

The code generator decides which implementation to generate.

---

# Zod

Zod is the primary validation schema target.

Store validation configuration as data.

Example:

```ts
validation: {
  required: true,
  minLength: 3,
  maxLength: 100,
  email: true
}
```

Do not store executable Zod schemas inside Zustand.

Generate the Zod schema from the builder configuration.

Example:

```text
Builder Validation Config
        ↓
Zod Schema Generator
        ↓
z.object({...})
```

---

# Validation

Prefer a normalized validation structure:

```ts
const ValidationSchema = z.object({
  required: z.boolean().default(false),
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  email: z.boolean().optional(),
  url: z.boolean().optional(),
});
```

Validation configuration should be serializable.

Do not put validation functions inside the builder state.

---

# Zustand Store

Zustand is the source of truth for the builder state.

Typical actions:

```ts
setForm()
updateForm()
resetForm()

updateSettings()
setActiveTab()

setFormElements()
addElement()
updateElement()
removeElement()
moveElement()
duplicateElement()

selectElement()
```

Persist only serializable builder data.

Recommended:

```ts
persist(
  store,
  {
    name: "shadcn-builder-ui",
    partialize: (state) => ({
      form: state.form,
    }),
  }
)
```

Do not persist transient UI state such as:

```ts
selectedElementId
```

unless there is a specific reason to do so.

---

# Element IDs

Use:

```ts
crypto.randomUUID()
```

for builder element IDs.

Do not use:

```ts
Date.now()
```

for element identity when a UUID is available.

Every duplicated element must receive a new ID.

---

# Duplicate Element

`duplicateElement` belongs inside the Zustand store.

Example:

```ts
duplicateElement: (elementId) =>
  set((state) => {
    const index = state.form.formElements.findIndex(
      (element) => element.id === elementId,
    );

    if (index === -1) {
      return state;
    }

    const original = state.form.formElements[index];

    const duplicate = {
      ...structuredClone(original),
      id: crypto.randomUUID(),
      name: `${original.name}_copy`,
    };

    const formElements = [...state.form.formElements];

    formElements.splice(index + 1, 0, duplicate);

    return {
      form: {
        ...state.form,
        formElements,
      },
      selectedElementId: duplicate.id,
    };
  }),
```

Do not define a second local `duplicateElement()` function inside `BuilderElement`.

---

# State Updates

Prefer immutable state updates.

Good:

```ts
set((state) => ({
  form: {
    ...state.form,
    formElements: updatedElements,
  },
}));
```

Avoid mutating state directly:

```ts
state.form.formElements.push(element);
```

---

# Submit Button

The submit button belongs to the form configuration, not the individual field list.

Prefer:

```ts
submit: {
  label: "Submit",
  loadingLabel: "Submitting...",
  variant: "default",
  size: "default",
  disabled: false,
}
```

Runtime:

```tsx
<Button type="submit">
  Submit
</Button>
```

The builder should allow users to configure the submit button.

---

# Static Elements

Static elements are not form controls.

Examples:

```text
H1
H2
H3
Separator
FieldDescription
FieldLegend
```

They should not be registered as form values.

---

# Options

Option-based fields should use a common option structure.

```ts
const OptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  disabled: z.boolean().default(false),
});
```

Used by:

```text
RadioGroup
ToggleGroup
Select
MultiSelect
```

---

# Form Arrays

`FormArray` is a special recursive structure.

Prefer explicit nested fields:

```ts
{
  fieldType: "FormArray",
  id: "uuid",
  name: "items",
  fields: [...]
}
```

Avoid arbitrary nested arrays inside `FormElementListSchema`.

---

# Multi-Step Forms

Multi-step forms should use explicit steps.

Example:

```ts
{
  isMultiStep: true,
  steps: [
    {
      id: "step-1",
      title: "Personal Information",
      fields: []
    },
    {
      id: "step-2",
      title: "Account",
      fields: []
    }
  ]
}
```

Do not mix step metadata with individual field configuration.

---

# Code Generation

Code generation is a major feature of the project.

Generated code should be:

* Type-safe
* Readable
* Idiomatic
* Minimal
* Copy/paste ready
* Compatible with the selected package manager
* Compatible with the selected form library

Avoid generating unnecessary wrappers or dependencies.

Generated code should not contain builder-specific runtime dependencies unless explicitly required.

---

# Generated Code Pipeline

Use this conceptual pipeline:

```text
FormBuilder JSON
       │
       ├── Zod Generator
       │
       ├── Default Values Generator
       │
       ├── Form Component Generator
       │
       ├── Import Generator
       │
       └── Package Generator
                │
                ▼
          Generated React Code
```

Do not generate code directly from UI components.

Generate code from the normalized builder schema.

---

# Field Definitions

Field metadata should be centralized.

Prefer:

```text
lib/
└── form-builder/
    ├── field-definitions.ts
    ├── field-factory.ts
    ├── form-builder.schema.ts
    └── generate-zod-schema.ts
```

Example concept:

```ts
const fieldDefinitions = [
  {
    type: "Input",
    label: "Input",
    icon: TextIcon,
    create: createInputField,
  },
];
```

The FieldsPanel should consume these definitions instead of containing large amounts of field-specific configuration.

---

# Component Naming

Use consistent names.

Prefer:

```text
InputField
PasswordField
OTPField
TextareaField
CheckboxField
RadioGroupField
ToggleGroupField
SwitchField
SliderField
SelectField
MultiSelectField
DatePickerField
```

Avoid mixing:

```text
InputRenderer
PasswordRenderer
InputField
```

unless there is a clear architectural distinction.

---

# File Naming

Prefer kebab-case filenames:

```text
input-field.tsx
password-field.tsx
form-element-renderer.tsx
builder-element.tsx
field-editor.tsx
form-preview.tsx
```

React component names should use PascalCase.

---

# Imports

Prefer path aliases:

```ts
@/components/...
@/lib/...
@/app/...
```

Avoid unnecessary relative imports across major application boundaries.

Use `import type` for type-only imports:

```ts
import type { FormElement } from "@/lib/schema/form-builder.schema";
```

---

# Client Components

Use `"use client"` only where required.

Client components are expected for:

* Zustand consumers
* Interactive builder components
* Drag-and-drop
* Form runtime
* Browser APIs
* Interactive shadcn components

Do not add `"use client"` to static components unnecessarily.

---

# shadcn/ui

Prefer shadcn/ui components when an appropriate component exists.

Do not recreate existing shadcn primitives unnecessarily.

Use:

```text
Button
Input
Textarea
Select
Checkbox
Switch
Slider
RadioGroup
ToggleGroup
Calendar
Popover
Field
Separator
DropdownMenu
Resizable
...
```

Keep custom components focused on project-specific behavior.

---

# Styling

Use Tailwind CSS.

Prefer existing design tokens:

```text
bg-background
text-foreground
text-muted-foreground
border-border
bg-muted
bg-primary
text-primary-foreground
```

Avoid hardcoding colors when a semantic token exists.

Prefer:

```tsx
className="border-border bg-background"
```

over arbitrary color values.

Use `cn()` for conditional class names.

---

# Accessibility

Every interactive field must consider:

* Label
* `htmlFor`
* Accessible name
* Keyboard navigation
* Disabled state
* Error state
* Focus state

Do not remove native accessibility behavior for visual reasons.

Generated forms should also produce accessible markup.

---

# Drag and Drop

Use dnd-kit for builder drag-and-drop.

Expected architecture:

```text
DndContext
   ↓
SortableContext
   ↓
SortableBuilderElement
   ↓
BuilderElement
```

Do not mix drag logic into every field renderer.

The field renderer should remain unaware of dnd-kit.

---

# Drag Handle

The drag handle should be separate from the field content.

Example:

```text
BuilderElement
├── Toolbar
│   ├── DragHandle
│   ├── FieldType
│   └── Actions
│
└── FieldRenderer
```

Use dnd-kit listeners/attributes on the drag handle where appropriate.

---

# Error Handling

Do not silently swallow errors.

Bad:

```ts
try {
  ...
} catch {
  return null;
}
```

Prefer meaningful handling or allow errors to propagate when appropriate.

For user-facing actions, provide clear UI feedback.

---

# Performance

Avoid unnecessary Zustand subscriptions.

Prefer selecting only the state needed by a component:

```ts
const selectedElementId = useFormBuilderStore(
  (state) => state.selectedElementId,
);
```

Avoid subscribing to the entire store when unnecessary.

Avoid unnecessary re-renders in large forms.

For large builder documents, consider:

* Selectors
* Memoization
* Virtualization where appropriate
* Stable component boundaries

Do not prematurely optimize.

---

# Persistence

The initial persistence strategy is LocalStorage.

Persist the builder document:

```text
FormBuilder
```

Do not persist runtime objects or functions.

Future persistence may support:

```text
LocalStorage
    ↓
IndexedDB
    ↓
Backend
    ↓
Cloud templates
```

Any future migration must consider schema versioning.

---

# Schema Versioning

If the persisted builder schema changes incompatibly, add a version/migration strategy.

Example:

```ts
version: 1
```

Future:

```text
v1 → v2
v2 → v3
```

Do not blindly invalidate users' saved forms after schema changes.

---

# Templates

Saved templates should contain serializable builder configuration.

Example:

```ts
{
  id: string,
  name: string,
  data: FormBuilder,
  createdAt: string,
  updatedAt?: string
}
```

Do not save React components in templates.

---

# Security

Never execute arbitrary generated code inside the builder.

Do not use:

```ts
eval()
new Function()
```

for user-generated code execution.

Generated code should be displayed as text.

If previewing generated code, use a safe rendering strategy.

Never trust user-provided HTML, URLs, or arbitrary code.

---

# API / Backend

The initial builder can work without a backend.

Do not introduce backend requirements for features that can work locally.

When backend functionality is introduced, keep API logic outside UI components.

Prefer:

```text
lib/
services/
api/
```

or the project's established service architecture.

---

# Testing

When tests are present, prioritize testing:

1. Schema validation
2. Zustand actions
3. Element creation
4. Element duplication
5. Element deletion
6. Element reordering
7. Code generation
8. Zod schema generation
9. Runtime form submission

For `duplicateElement`, test:

* Existing element duplicates correctly
* New ID is generated
* Duplicate is inserted immediately after original
* Original remains unchanged
* Duplicate becomes selected
* Nested configuration is cloned

---

# TypeScript Rules

Avoid:

```ts
any
```

Prefer:

```ts
unknown
```

when the type is genuinely unknown.

Use discriminated unions for field types.

Use `Extract<>` when narrowing union members.

Example:

```ts
type InputElement = Extract<
  FormElement,
  { fieldType: "Input" }
>;
```

Keep inferred Zod types as the source of truth where practical.

---

# Adding a New Field

When adding a new field type, follow this checklist:

```text
1. Add Zod schema
2. Add inferred TypeScript type
3. Add fieldType
4. Add default factory
5. Add field definition
6. Add FieldsPanel entry
7. Create field renderer
8. Add FormElementRenderer case
9. Add FieldEditor configuration
10. Add validation mapping if required
11. Add runtime support
12. Add code generation support
13. Add tests
```

Do not add only the visual renderer and consider the feature complete.

---

# Adding a New Setting

When adding a builder setting:

```text
1. Update Zod settings schema
2. Update inferred type
3. Add default value
4. Update Zustand actions if needed
5. Add editor UI
6. Update persistence/migration if necessary
7. Update code generation if applicable
```

---

# Before Making Changes

Before modifying code:

1. Inspect the existing implementation.
2. Identify the source of truth.
3. Reuse existing utilities/components.
4. Check existing types and schemas.
5. Check whether the requested behavior already exists.
6. Make the smallest coherent change.

Do not rewrite entire files when a focused change is sufficient.

---

# After Making Changes

Check:

```text
TypeScript
Lint
Build
Tests
```

At minimum, ensure:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

if these scripts exist in the project.

Do not claim a command passed unless it was actually run.

---

# Git

Use focused commits.

Examples:

```text
feat: add field editor
feat: add duplicate element action
feat: add sortable form elements
fix: preserve selected element after duplication
refactor: extract field definitions
```

Avoid commits such as:

```text
update
changes
fixed stuff
```

Do not modify Git history unless explicitly requested.

---

# Code Quality Rules

Prefer:

```text
Data-driven architecture
Typed schemas
Pure transformations
Small components
Explicit state transitions
Reusable utilities
Serializable state
```

Avoid:

```text
Large monolithic components
Duplicated field definitions
Business logic inside UI
Functions inside persisted Zustand state
Arbitrary nested arrays
`any`
eval/new Function
Unnecessary dependencies
Premature abstractions
```

---

# Important Architectural Rule

The most important rule in this project is:

```text
Builder configuration is data.
```

Do not store implementation details inside the builder document.

Store:

```ts
{
  fieldType: "Input",
  name: "email",
  label: "Email",
  validation: {
    required: true,
    email: true
  }
}
```

Do not store:

```ts
{
  register: register,
  component: Input,
  schema: z.string()
}
```

The configuration should be serializable, portable, persistable, and usable by different generators.

---

# Target Architecture

The long-term architecture should remain close to:

```text
                    ┌─────────────────┐
                    │     Zustand     │
                    │  Builder State  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ FormBuilder JSON│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         ┌─────────┐   ┌──────────┐   ┌─────────────┐
         │ Builder │   │ Runtime  │   │ Code Gen    │
         └─────────┘   └──────────┘   └─────────────┘
              │              │              │
              ▼              ▼              ▼
         Visual UI      RHF / TanStack   TypeScript
                           + Zod          + shadcn/ui

