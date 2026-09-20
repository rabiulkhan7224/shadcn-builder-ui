import {
  CalendarDays,
  Check,
  CircleDot,
  FileText,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  List,
  Lock,
  Mail,
  Menu,
  Minus,
  MousePointer2,
  MoveHorizontal,
  SlidersHorizontal,
  SquareCheck,
  ToggleLeft,
  Type,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { FormElement } from "@/lib/schema/form-builder.schema";

export type FieldDefinition = {
  fieldType: FormElement["fieldType"];
  label: string;
  description: string;
  icon: LucideIcon;
};

export const fieldDefinitions: FieldDefinition[] = [
  {
    fieldType: "Input",
    label: "Input",
    description: "Single-line text input",
    icon: Type,
  },
  {
    fieldType: "Password",
    label: "Password",
    description: "Password input",
    icon: Lock,
  },
  {
    fieldType: "OTP",
    label: "OTP",
    description: "One-time password input",
    icon: Hash,
  },
  {
    fieldType: "Textarea",
    label: "Textarea",
    description: "Multi-line text input",
    icon: FileText,
  },
  {
    fieldType: "Checkbox",
    label: "Checkbox",
    description: "Boolean checkbox",
    icon: SquareCheck,
  },
  {
    fieldType: "RadioGroup",
    label: "Radio Group",
    description: "Select one option",
    icon: CircleDot,
  },
  {
    fieldType: "ToggleGroup",
    label: "Toggle Group",
    description: "Toggle one or multiple options",
    icon: ToggleLeft,
  },
  {
    fieldType: "Switch",
    label: "Switch",
    description: "Boolean switch",
    icon: ToggleLeft,
  },
  {
    fieldType: "Slider",
    label: "Slider",
    description: "Numeric range input",
    icon: SlidersHorizontal,
  },
  {
    fieldType: "Select",
    label: "Select",
    description: "Select one option",
    icon: Menu,
  },
  {
    fieldType: "MultiSelect",
    label: "Multi Select",
    description: "Select multiple options",
    icon: List,
  },
  {
    fieldType: "DatePicker",
    label: "Date Picker",
    description: "Select a date",
    icon: CalendarDays,
  },

  // Static elements

  {
    fieldType: "H1",
    label: "Heading 1",
    description: "Large heading",
    icon: Heading1,
  },
  {
    fieldType: "H2",
    label: "Heading 2",
    description: "Medium heading",
    icon: Heading2,
  },
  {
    fieldType: "H3",
    label: "Heading 3",
    description: "Small heading",
    icon: Heading3,
  },
  {
    fieldType: "Separator",
    label: "Separator",
    description: "Horizontal divider",
    icon: Minus,
  },
];
