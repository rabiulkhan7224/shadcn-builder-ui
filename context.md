# Project Context & Architecture — Shadcn Builder UI

## 1. Project Overview

**Shadcn Builder UI** is an open-source visual interface builder for React. Its primary objective is to allow developers and designers to visually compose complex forms (and eventually data tables), configure validation rules and layout options, and instantly generate clean, type-safe, copy-paste-ready React and TypeScript code powered by [shadcn/ui](https://ui.shadcn.com).

> **Note**: This is an independent community project and is not an official shadcn/ui product.

---

## 2. Core Philosophy & Golden Rule

### **"Builder Configuration is Data"**

The builder configuration is the single source of truth for the entire application. It must remain:
* **Framework-independent**: The saved document does not depend on React Hook Form or TanStack Form.
* **Serializable**: Only plain JSON objects and primitives are saved. No React components, instances of `useForm()`, functions, callbacks, or executable Zod schemas are stored in state or persistence.
* **Portable**: The same configuration data feeds visual preview, live runtime validation, code generation, and exportable templates.

```text
┌────────────────────────────────────────────────────────┐
│                   Zustand Store                        │
│               (Persisted in LocalStorage)              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FormBuilder JSON                     │
│  - Metadata & Settings                                 │
│  - Form Elements (Discriminated by `fieldType`)        │
│  - Multi-step configuration                            │
│  - Submit button configuration                         │
│  - Validation rules as plain data                      │
└──────┬────────────────────┼─────────────────────┬──────┘
       │                    │                     │
       ▼                    ▼                     ▼
┌──────────────┐    ┌───────────────┐     ┌──────────────┐
│Visual Builder│    │  Form Runtime │     │Code Generator│
│  (Preview)   │    │(RHF / TanStack│     │ (TypeScript  │
│              │    │    + Zod)     │     │ + shadcn/ui) │
└──────────────┘    └───────────────┘     └──────────────┘
```

---

## 3. Technology Stack

| Layer | Technologies | Role |
|---|---|---|
| **Framework** | Next.js 16 (App Router), React 19 | Application framework and server/client environment |
| **Language** | TypeScript (strict mode) | Strict type safety, discriminated union contracts |
| **Styling** | Tailwind CSS v4, `cn` utility | Token-based styling (`bg-background`, `text-foreground`, etc.) |
| **UI Components** | shadcn/ui primitives, Radix UI, Base UI | High quality accessible UI building blocks |
| **Icons** | Lucide React | Consistent icon set for fields, actions, and toolbar |
| **State Management** | Zustand (`zustand/middleware` persist) | Centralized, reactive state store with LocalStorage persistence |
| **Validation** | Zod | Schema definitions and runtime validator generation |
| **Forms (Target)** | React Hook Form & TanStack Form | Code generation targets and runtime execution targets |
| **Tables (Target)** | TanStack Table | Planned visual table builder target |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` | Planned builder canvas drag, drop, and reordering |

---

## 4. Architectural Boundaries

The application is strictly separated into four concerns:

1. **Builder Canvas & Palette (`components/builder/`)**:
   - Visual canvas where elements can be added, selected, reordered, duplicated, and deleted.
   - Elements rendered here are visual/configuration previews without form submission or active React Hook Form bindings.

2. **FormBuilder Data Model (`lib/schema/form-builder.schema.ts`)**:
   - Central schema defining what a form is: elements, steps, settings, options, validation constraints.
   - Normalized data structures using discriminated unions keyed on `fieldType`.

3. **Form Runtime (Separate from Builder)**:
   - Dynamic form runner (`DynamicForm`) that takes a `FormBuilder` JSON definition and turns it into a live, interactive form with validation, submission state, and multi-step management.

4. **Code Generation Pipeline**:
   - Pure transformation pipeline: `FormBuilder JSON -> AST / String -> React Component Code`.
   - Generates idiomatic, accessible TypeScript code importing shadcn/ui primitives and setting up React Hook Form or TanStack Form with a generated Zod schema.

---

## 5. Main Builder Layout

The builder interface is arranged in a 3-panel horizontal layout using shadcn/ui resizable panels (`components/ui/resizable.tsx`):

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Builder Header (Actions, Active Tab, Import/Export, Code Toggle)       │
├───────────────────┬───────────────────────────────┬────────────────────┤
│                   │                               │                    │
│   Fields Panel    │         Form Preview          │    Field Editor    │
│  (Palette list)   │     (Live Canvas Area)        │ (Properties Panel) │
│                   │                               │                    │
│ - Form Elements   │ - Form Header                 │ - General settings │
│ - Typography &    │ - Canvas Elements             │ - Validation rules │
│   Layout          │ - Toolbar (Duplicate/Delete)  │ - Option editor    │
│                   │ - Empty state fallback        │                    │
│                   │                               │                    │
└───────────────────┴───────────────────────────────┴────────────────────┘
```

---

## 6. Component Hierarchy & Flow

```text
app/(builder)/form-builder/page.tsx
 ├── ResizablePanel (Left)
 │    └── FieldsPanel
 │         ├── Form Elements Buttons
 │         └── Typography & Layout Buttons
 │              └── onClick -> addElement(factoryField) -> Zustand Store
 │
 ├── ResizablePanel (Center)
 │    └── FormPreview
 │         └── BuilderElement (list mapped from store.form.formElements)
 │              ├── Element Toolbar (Drag handle, Type badge, Duplicate, Delete)
 │              └── FormElementRenderer (Central Dispatcher)
 │                   ├── InputRenderer
 │                   ├── PasswordField
 │                   ├── OTPField
 │                   ├── TextareaField
 │                   ├── SelectField
 │                   ├── MultiSelectField
 │                   ├── CheckboxField
 │                   ├── RadioGroupField
 │                   ├── ToggleGroupField
 │                   ├── SwitchField
 │                   ├── SliderField
 │                   ├── DatePickerField
 │                   ├── H1Field / H2Field / H3Field
 │                   ├── DividerField
 │                   ├── DescriptionField
 │                   └── LegendField
 │
 └── ResizablePanel (Right)
      └── FieldEditor (Properties of selected element)
```

---

## 7. State Management Guidelines (Zustand)

- **Source of Truth**: All builder modifications go through `useFormBuilderStore`.
- **Selected Element**: Stored as `selectedElementId: string | null`. Not persisted to localStorage to prevent stale selection states across reloads.
- **Unique Element IDs**: All elements generate a UUID via `crypto.randomUUID()`. Never `Date.now()`.
- **Immutable Duplication**: Duplication clones the original element, assigns a fresh UUID, appends `_copy` to the name, inserts it immediately after the original, and automatically selects the new duplicate.
- **Selective Subscriptions**: Components select only the slice of state they require to avoid superfluous re-renders:
  ```tsx
  const selectedElementId = useFormBuilderStore((state) => state.selectedElementId);
  ```

---

## 8. Development Rules & Best Practices

1. **No Implementation Details in Builder State**: Never store React elements, form handlers, or Zod schema objects in Zustand.
2. **Follow Existing Conventions**: Consistent kebab-case filenames, PascalCase component names, and centralized schemas.
3. **Strict Discriminated Unions**: Every element must be identified by `fieldType`.
4. **Accessibility First**: All rendered controls retain accessible markup (`htmlFor`, labels, aria descriptions, keyboard navigation).
5. **No Blind Dependency Bloat**: Use what is installed; only add libraries that solve explicit project requirements.
