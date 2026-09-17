# Project Progress & Roadmap — Shadcn Builder UI

This document tracks the implementation progress of **Shadcn Builder UI**, logging completed achievements and maintaining an actionable TODO checklist of immediate next steps and long-term milestones.

---

## 📊 Overall Status Summary

- **Architecture & Foundations**: Complete (discriminated schemas, Zustand store with persistence, 3-panel layout).
- **Form Elements & Renderers**: 18 of 18 core field renderers completed and verified in browser.
- **Current Milestone**: **Field Editor (Inspector Panel)** for real-time field configuration.

---

## ✅ Completed Milestones (`[x]`)

### 1. Architectural Foundations
- [x] Strict data-driven design: "Builder configuration is data" (serializable JSON, decoupled from runtime).
- [x] Discriminated union schema for all form elements in [form-builder.schema.ts](file:///c:/projects/shadcn-builder-ui/lib/schema/form-builder.schema.ts).
- [x] Central Zustand store with `persist` middleware in [form-builder.store.ts](file:///c:/projects/shadcn-builder-ui/app/store/form-builder.store.ts).
- [x] Element identification using UUIDs (`crypto.randomUUID()`).
- [x] Immutable state transitions and store-level duplication action (`duplicateElement`).

### 2. Builder Layout & Palette
- [x] Resizable 3-panel builder layout (`FieldsPanel` | `FormPreview` | `FieldEditor`).
- [x] Categorized Fields Panel: **Form Elements** & **Typography / Layout** in [fields-panel.tsx](file:///c:/projects/shadcn-builder-ui/components/builder/fields-panel.tsx).
- [x] Click-to-add action handlers for all field types with sensible default properties.

### 3. Canvas & Dispatcher
- [x] Central element renderer dispatcher in [FormElementRenderer.tsx](file:///c:/projects/shadcn-builder-ui/components/builder/renderer/FormElementRenderer.tsx).
- [x] Canvas wrapper with selection highlighting, drag handle placeholder, and floating toolbar in [builder-element.tsx](file:///c:/projects/shadcn-builder-ui/components/builder/builder-element.tsx).
- [x] Empty preview canvas state with onboarding prompt in [form-preview.tsx](file:///c:/projects/shadcn-builder-ui/components/builder/form-preview.tsx).

### 4. Field Renderers (18/18 Implemented)
- [x] `Input` (`InputRenderer`) — text, email, number, url, tel, datetime.
- [x] `Password` (`PasswordField`) — masked password with toggleable eye icon.
- [x] `OTP` (`OTPField`) — slot-based 6-digit one-time password.
- [x] `Textarea` (`TextareaField`) — multi-line text input with custom rows.
- [x] `Select` (`SelectField`) — dropdown single-select.
- [x] `MultiSelect` (`MultiSelectField`) — searchable tag-based multi-select with remove badges.
- [x] `Checkbox` (`CheckboxField`) — accessible checkbox with description.
- [x] `RadioGroup` (`RadioGroupField`) — radio button group (horizontal/vertical).
- [x] `ToggleGroup` (`ToggleGroupField`) — button toggle group (single/multiple).
- [x] `Switch` (`SwitchField`) — animated boolean switch.
- [x] `Slider` (`SliderField`) — range slider with live badge and min/max display.
- [x] `DatePicker` (`DatePickerField`) — calendar popover with `date-fns` formatting.
- [x] `H1` (`H1Field`) — large page heading.
- [x] `H2` (`H2Field`) — section heading with divider line.
- [x] `H3` (`H3Field`) — sub-section heading.
- [x] `Separator` (`DividerField`) — horizontal divider.
- [x] `FieldDescription` (`DescriptionField`) — helper text block.
- [x] `FieldLegend` (`LegendField`) — section legend / title.

### 5. UI Primitives & Design System
- [x] Radix UI backed `Slider` primitive in [components/ui/slider.tsx](file:///c:/projects/shadcn-builder-ui/components/ui/slider.tsx).
- [x] Calendar, Popover, Badge, Field, Button, DropdownMenu, Resizable, InputOTP, Select, Checkbox, Switch, RadioGroup, ToggleGroup.

### 6. Documentation
- [x] [context.md](file:///c:/projects/shadcn-builder-ui/context.md) — Architecture, philosophy, layer boundaries, and conventions.
- [x] [features.md](file:///c:/projects/shadcn-builder-ui/features.md) — Detailed feature inventory and roadmap.

---

## 📋 Actionable Next Steps (`[ ]` Checklist)

### Immediate Next (Active Task)
- [ ] **Field Editor (`FieldEditor.tsx`)**:
  - [ ] Create `components/ui/tabs.tsx` for clean property tab navigation.
  - [ ] Empty state when no field is selected ("Select a field from canvas to edit").
  - [ ] Element Header (Field type badge, element UUID, quick delete/duplicate/close).
  - [ ] **General Tab**:
    - [ ] Label input
    - [ ] Field Name / Key input
    - [ ] Placeholder input
    - [ ] Description / Helper text input
  - [ ] **Validation Tab**:
    - [ ] Required toggle
    - [ ] Min length & Max length (for text/password/textarea)
    - [ ] Min value & Max value (for number/slider)
    - [ ] Step value (for slider)
    - [ ] Max selected count (for multi-select)
    - [ ] Date format string (for date-picker)
  - [ ] **Options Tab** (for Select, MultiSelect, RadioGroup, ToggleGroup):
    - [ ] List current options with label & value inputs
    - [ ] "+ Add Option" action
    - [ ] Remove option action
    - [ ] Option disabled toggle
  - [ ] **Static Content Tab** (for H1, H2, H3, FieldDescription, FieldLegend):
    - [ ] Text content editor
  - [ ] **Behavior & Style Tab**:
    - [ ] Disabled toggle
    - [ ] Custom `className` input
    - [ ] Rows count (for Textarea)
    - [ ] Orientation toggle (vertical / horizontal for RadioGroup)
    - [ ] Selection mode (single / multiple for ToggleGroup)

---

### Upcoming Milestones

#### Phase 2: Drag & Drop Integration (`dnd-kit`)
- [ ] Install / verify `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- [ ] Wrap `FormPreview` with `DndContext` and `SortableContext`.
- [ ] Wrap `BuilderElement` with `SortableBuilderElement`.
- [ ] Connect drag handles to sortable listeners and attributes.
- [ ] Implement palette-to-canvas dragging from `FieldsPanel`.
- [ ] Add visual insertion indicator lines for drop targets.

#### Phase 3: Code Generation Engine
- [ ] Implement `generateZodSchema(formElements)` returning stringified Zod schema.
- [ ] Implement React Hook Form generator (`react-hook-form` + `shadcn/ui` output).
- [ ] Implement TanStack Form generator (`@tanstack/react-form` output).
- [ ] Package manager installation instructions generator (`pnpm`, `npm`, `yarn`, `bun`).
- [ ] Code preview drawer / modal with copy-to-clipboard and syntax highlighting.

#### Phase 4: Runtime Form Engine (`DynamicForm`)
- [ ] Create standalone `DynamicForm` component taking `FormBuilder` JSON.
- [ ] Live form preview toggle in builder header (Canvas vs Live Test mode).
- [ ] Submission handling and validation feedback execution.
- [ ] Submit button customization (label, variant, loading text).

#### Phase 5: Advanced Form Builders
- [ ] Multi-step form step manager (add/remove/reorder steps, step validation gates).
- [ ] FormArray / Repeater field builder (nested field arrays with dynamic add/remove rows).

#### Phase 6: Templates & Sharing
- [ ] Pre-built templates (Contact Us, Registration, Feedback Survey, Checkout).
- [ ] Export form JSON to file / Import form JSON from file.

#### Phase 7: TanStack Table Visual Builder
- [ ] Visual table column designer (accessor keys, header labels, cell renderers).
- [ ] Table features configuration (sorting, pagination, filtering).
- [ ] TanStack Table code generator.
