# Features & Roadmap — Shadcn Builder UI

This document provides a comprehensive inventory of **what is already implemented and working** ("What is Done") and **what features can be built next** based on the architectural blueprint in `AGENTS.md` ("What Can Be Done").

---

## Part 1: What is Done (Current Capabilities)

### 1. Visual Builder Layout & Shell
* **Three-Panel Resizable Layout**: Built using `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` (`react-resizable-panels`).
  - Left panel: **Fields Panel** (palette of draggable/clickable components).
  - Center panel: **Form Preview** (interactive canvas).
  - Right panel: **Field Editor** container (ready for inspector controls).
* **Responsive Styling**: Tailwind CSS with dark/light mode token compatibility.

### 2. Form Element Palette (`FieldsPanel`)
* **Categorized Sections**:
  - **Form Elements**: Input, Password, Textarea, Select, MultiSelect, Checkbox, RadioGroup, ToggleGroup, Switch, Slider, DatePicker.
  - **Typography & Layout**: Heading 1, Heading 2, Heading 3, Separator, Description, Legend.
* **Instant Creation**: Clicking any field creates a new element with a unique UUID (`crypto.randomUUID()`) and sensible defaults, appending it to the canvas.

### 3. Builder Canvas & Elements (`FormPreview` & `BuilderElement`)
* **Live Element Rendering**: Central dispatcher (`FormElementRenderer`) maps each element's `fieldType` to its specialized renderer.
* **Selection State**: Clicking an element highlights it with a primary border and reveals its contextual toolbar.
* **Contextual Element Toolbar**:
  - Drag handle grip icon (prepared for dnd-kit).
  - Field type badge indicator.
  - More actions dropdown menu:
    - **Duplicate**: Clones the element deeply, assigns a new UUID, appends `_copy` to name, inserts it right below, and selects it.
    - **Delete**: Removes the element from the form.
* **Empty State**: Visual guidance when no fields are present.

### 4. Supported Form Elements & Renderers (18 Elements)

| Element Category | `fieldType` | Implementation Component | Key Capabilities |
|---|---|---|---|
| **Text Inputs** | `Input` | `InputRenderer` | Text, email, number, tel, url, date, datetime; placeholders, labels, descriptions. |
| | `Password` | `PasswordField` | Masked password input with toggleable visibility. |
| | `OTP` | `OTPField` | Slot-based 6-digit one-time password component (`input-otp`). |
| | `Textarea` | `TextareaField` | Multi-line text field with configurable row count. |
| **Selection Controls**| `Select` | `SelectField` | Single-choice dropdown using shadcn `Select`. |
| | `MultiSelect` | `MultiSelectField` | Multi-option picker with tag badges, search filter, remove buttons, limit counters. |
| | `Checkbox` | `CheckboxField` | Accessible checkbox with horizontal label and description alignment. |
| | `RadioGroup` | `RadioGroupField` | Mutually exclusive radio option list with vertical/horizontal orientation. |
| | `ToggleGroup` | `ToggleGroupField` | Button group toggle supporting single and multiple selections. |
| **Sliders & Switches**| `Switch` | `SwitchField` | Boolean toggle switch with smooth animated thumb. |
| | `Slider` | `SliderField` | Range slider with live value indicator badge, bounds display, and step control. |
| **Date & Time** | `DatePicker` | `DatePickerField` | Calendar popover date picker using `react-day-picker` and `date-fns` formatting. |
| **Typography & Layout**| `H1` | `H1Field` | Large page heading with responsive typography tokens. |
| | `H2` | `H2Field` | Section heading with accent bottom border divider. |
| | `H3` | `H3Field` | Subsection heading. |
| | `Separator` | `DividerField` | Full-width horizontal divider line (`Separator`). |
| | `FieldDescription` | `DescriptionField` | Muted instructional text block (`FieldDescription`). |
| | `FieldLegend` | `LegendField` | Form section header / legend title (`FieldLegend`). |

### 5. State Management & Persistence (Zustand)
* **Central Store (`form-builder.store.ts`)**:
  - `addElement(element, index?)`
  - `updateElement(elementId, updates)`
  - `removeElement(elementId)`
  - `duplicateElement(elementId)` (with deep clone & UUID generation)
  - `moveElement(fromIndex, toIndex)`
  - `selectElement(elementId)`
  - `updateSettings(updates)`
  - `updateForm(updates)`
  - `resetForm()`
* **Persistence**: Persists only the serializable `form` document in `LocalStorage` via Zustand `persist` middleware. UI states such as `selectedElementId` are kept transient.

### 6. Data Modeling & Zod Schemas (`form-builder.schema.ts`)
* **Strict Discriminated Unions**: `FormElementSchema` discriminates on `fieldType`.
* **Common Field Base**: Standardized metadata (`id`, `name`, `label`, `description`, `placeholder`, `disabled`, `required`, `className`, `defaultValue`).
* **Static Field Base**: Separates non-input decorative elements (`H1`, `H2`, `H3`, `Separator`, etc.) from data fields.
* **Recursive Models**: Prepared definitions for `FormArray` (repeater fields) and `FormStep` (multi-step forms).

---

## Part 2: What Can Be Done (Roadmap & Next Steps)

The following features represent the planned milestones to transform Shadcn Builder UI into a complete end-to-end interface builder and code generation suite:

### 1. Field Inspector Panel (`FieldEditor`)
Currently, the right panel displays a placeholder (`<h1>FieldEditor</h1>`). Implementing the `FieldEditor` component will allow users to edit the selected field in real-time:
* **General Tab**:
  - Label, Field Name (auto-slugged or manual), Placeholder, Helper Description.
* **Validation Tab**:
  - Required checkbox with custom error message.
  - Text validation: Min length, Max length, Regex pattern, Email, URL.
  - Number validation: Min value, Max value, Integer constraint.
* **Options Manager Tab** (for `Select`, `MultiSelect`, `RadioGroup`, `ToggleGroup`):
  - Add option, remove option, edit label and value, mark option as disabled.
  - Drag-to-reorder options.
* **Styling & Layout Tab**:
  - Custom CSS class names, width, hidden toggle.

### 2. Drag-and-Drop Canvas (`dnd-kit`)
Replace static button-click additions and manual ordering with fluid drag-and-drop:
* **Palette to Canvas**: Drag any field from the `FieldsPanel` directly into the canvas at a specific drop index.
* **Sortable Elements**: Reorder elements directly on the canvas using `@dnd-kit/sortable`.
* **Visual Drop Indicators**: Animated drop insertion lines showing where the element will land.
* **Dedicated Drag Handle**: Accessible drag handle on `BuilderElement` toolbar.

### 3. Code Generation Engine
The hallmark feature of the application — generating production-ready React code from the `FormBuilder` JSON:
* **React Hook Form Generator**:
  - Generates `useForm({ resolver: zodResolver(...) })`.
  - Generates accessible shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` code.
* **TanStack Form Generator**:
  - Generates `useForm({ validatorAdapter: zodValidator() })` for `@tanstack/react-form`.
* **Zod Schema Generator (`generateZodSchema`)**:
  - Translates validation rules into readable Zod schema strings:
    ```ts
    const formSchema = z.object({
      email: z.string().email("Invalid email address").min(1, "Email is required"),
      age: z.number().min(18, "Must be at least 18"),
    });
    ```
* **Code Preview Modal / Drawer**:
  - Syntax highlighted TypeScript code block with copy-to-clipboard.
  - Package manager tab selector (`pnpm`, `npm`, `yarn`, `bun`) showing required install commands.
  - File download / export (`.tsx` format).

### 4. Interactive Form Runtime (`DynamicForm`)
A clean decoupling between the builder canvas and the actual form runner:
* **Runtime Runner Component**: Accepts a `FormBuilder` JSON and executes a live form with full validation and submission handling.
* **Live Form Preview Mode**: A toggle in the builder header ("Edit" vs "Live Test") allowing users to test form validation and submission behavior without leaving the browser.
* **Submit Configuration**:
  - Configurable submit button (label, loading state text, variant, position).
  - Configurable reset button.
  - Mock API submission with toast notifications.

### 5. Multi-Step Form Builder
* **Step Management**: Add, rename, delete, and reorder steps in a multi-step form.
* **Step Navigation**: Stepper indicators and progress bar.
* **Step Validation Gates**: Enforce valid inputs on step $N$ before progressing to step $N+1$.
* **Per-Step Code Generation**: Generates multi-step form state machines and step wizards.

### 6. Form Arrays & Nested Repeaters
* **Visual FormArray Builder**: Configure repeatable field groups (e.g., "Add another family member", "Itemized expenses").
* **Dynamic Append / Remove**: Render dynamic "+ Add Item" and "Remove" actions in preview and runtime.
* **Code Generation for `useFieldArray`**: Generates clean React Hook Form `useFieldArray` hooks and loops.

### 7. Template System (Import / Export / Presets)
* **Pre-Built Starter Templates**:
  - User Registration / Sign Up
  - Contact Us
  - Profile & Account Settings
  - Customer Feedback Survey
  - Multi-Step Checkout / Onboarding
* **JSON Import / Export**:
  - Save form configurations to JSON files.
  - Load existing JSON configurations back into the builder.

### 8. TanStack Table Visual Builder
The long-term vision outlined in `AGENTS.md` includes visual data table building:
* **Column Designer**: Define column accessor keys, header labels, cell formatters (date, badge, currency, avatar, actions).
* **Table Features Config**: Toggle sorting, pagination, search filter, column visibility, row selection.
* **TanStack Table Code Generator**: Generates full `@tanstack/react-table` component code with shadcn `<Table>` primitives.
