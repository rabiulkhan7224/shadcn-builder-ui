"use client";

import {
  AlignLeft,
  Bookmark,
  CalendarDays,
  Check,
  CircleDot,
  Heading1,
  Heading2,
  Heading3,
  KeyRound,
  List,
  ListChecks,
  Minus,
  SlidersHorizontal,
  Text,
  ToggleLeft,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFormBuilderStore } from "@/app/store/form-builder.store";

const formFieldDefinitions = [
  {
    fieldType: "Input",
    label: "Input",
    icon: Type,
  },
  {
    fieldType: "Password",
    label: "Password",
    icon: KeyRound,
  },
  {
    fieldType: "Textarea",
    label: "Textarea",
    icon: Text,
  },
  {
    fieldType: "Select",
    label: "Select",
    icon: List,
  },
  {
    fieldType: "MultiSelect",
    label: "Multi Select",
    icon: ListChecks,
  },
  {
    fieldType: "Checkbox",
    label: "Checkbox",
    icon: Check,
  },
  {
    fieldType: "RadioGroup",
    label: "Radio Group",
    icon: CircleDot,
  },
  {
    fieldType: "ToggleGroup",
    label: "Toggle Group",
    icon: ToggleLeft,
  },
  {
    fieldType: "Switch",
    label: "Switch",
    icon: ToggleLeft,
  },
  {
    fieldType: "Slider",
    label: "Slider",
    icon: SlidersHorizontal,
  },
  {
    fieldType: "DatePicker",
    label: "Date Picker",
    icon: CalendarDays,
  },
] as const;

const staticFieldDefinitions = [
  {
    fieldType: "H1",
    label: "Heading 1",
    icon: Heading1,
  },
  {
    fieldType: "H2",
    label: "Heading 2",
    icon: Heading2,
  },
  {
    fieldType: "H3",
    label: "Heading 3",
    icon: Heading3,
  },
  {
    fieldType: "Separator",
    label: "Separator",
    icon: Minus,
  },
  {
    fieldType: "FieldDescription",
    label: "Description",
    icon: AlignLeft,
  },
  {
    fieldType: "FieldLegend",
    label: "Legend",
    icon: Bookmark,
  },
] as const;

type AllFieldType =
  | (typeof formFieldDefinitions)[number]["fieldType"]
  | (typeof staticFieldDefinitions)[number]["fieldType"];

export function FieldsPanel() {
  const addElement = useFormBuilderStore((state) => state.addElement);

  const handleAddField = (fieldType: AllFieldType) => {
    const id = crypto.randomUUID();

    switch (fieldType) {
      case "Input":
        addElement({
          id,
          name: "field",
          fieldType: "Input",
          type: "text",
          label: "Input",
          placeholder: "Enter value",
          disabled: false,
          required: false,
        });
        break;

      case "Password":
        addElement({
          id,
          name: "password",
          fieldType: "Password",
          type: "password",
          label: "Password",
          placeholder: "Enter password",
          disabled: false,
          required: false,
        });
        break;

      case "Textarea":
        addElement({
          id,
          name: "message",
          fieldType: "Textarea",
          label: "Message",
          placeholder: "Enter message",
          disabled: false,
          required: false,
        });
        break;

      case "Select":
        addElement({
          id,
          name: "select",
          fieldType: "Select",
          label: "Select",
          placeholder: "Select an option",
          options: [
            {
              value: "option-1",
              label: "Option 1",
              disabled: false,
            },
            {
              value: "option-2",
              label: "Option 2",
              disabled: false,
            },
          ],
          disabled: false,
          required: false,
        });
        break;

      case "MultiSelect":
        addElement({
          id,
          name: "multiSelect",
          fieldType: "MultiSelect",
          label: "Multi Select",
          placeholder: "Select options",
          options: [
            {
              value: "option-1",
              label: "Option 1",
              disabled: false,
            },
            {
              value: "option-2",
              label: "Option 2",
              disabled: false,
            },
            {
              value: "option-3",
              label: "Option 3",
              disabled: false,
            },
          ],
          disabled: false,
          required: false,
        });
        break;

      case "Checkbox":
        addElement({
          id,
          name: "checkbox",
          fieldType: "Checkbox",
          label: "Checkbox",
          checked: false,
          disabled: false,
          required: false,
        });
        break;

      case "RadioGroup":
        addElement({
          id,
          name: "radio",
          fieldType: "RadioGroup",
          label: "Radio Group",
          options: [
            {
              value: "option-1",
              label: "Option 1",
              disabled: false,
            },
            {
              value: "option-2",
              label: "Option 2",
              disabled: false,
            },
          ],
          disabled: false,
          required: false,
        });
        break;

      case "ToggleGroup":
        addElement({
          id,
          name: "toggle",
          fieldType: "ToggleGroup",
          label: "Toggle Group",
          type: "single",
          options: [
            {
              value: "option-1",
              label: "Option 1",
              disabled: false,
            },
            {
              value: "option-2",
              label: "Option 2",
              disabled: false,
            },
          ],
          disabled: false,
          required: false,
        });
        break;

      case "Switch":
        addElement({
          id,
          name: "switch",
          fieldType: "Switch",
          label: "Switch",
          checked: false,
          disabled: false,
          required: false,
        });
        break;

      case "Slider":
        addElement({
          id,
          name: "slider",
          fieldType: "Slider",
          label: "Slider",
          min: 0,
          max: 100,
          step: 1,
          value: [50],
          disabled: false,
          required: false,
        });
        break;

      case "DatePicker":
        addElement({
          id,
          name: "date",
          fieldType: "DatePicker",
          label: "Date",
          placeholder: "Pick a date",
          disabled: false,
          required: false,
        });
        break;

      case "H1":
        addElement({
          id,
          name: "h1",
          fieldType: "H1",
          content: "Heading 1",
          static: true,
        });
        break;

      case "H2":
        addElement({
          id,
          name: "h2",
          fieldType: "H2",
          content: "Heading 2",
          static: true,
        });
        break;

      case "H3":
        addElement({
          id,
          name: "h3",
          fieldType: "H3",
          content: "Heading 3",
          static: true,
        });
        break;

      case "Separator":
        addElement({
          id,
          name: "separator",
          fieldType: "Separator",
          static: true,
        });
        break;

      case "FieldDescription":
        addElement({
          id,
          name: "description",
          fieldType: "FieldDescription",
          content: "This is a helpful description for this section of the form.",
          static: true,
        });
        break;

      case "FieldLegend":
        addElement({
          id,
          name: "legend",
          fieldType: "FieldLegend",
          content: "Section Legend",
          static: true,
        });
        break;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-1 p-4">
        <h2 className="text-sm font-semibold">Fields</h2>
        <p className="text-xs text-muted-foreground">
          Select a field to add it to your form.
        </p>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          <div>
            <span className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Form Elements
            </span>
            <div className="mt-1 grid gap-1">
              {formFieldDefinitions.map((field) => {
                const Icon = field.icon;
                return (
                  <Button
                    key={field.fieldType}
                    type="button"
                    variant="ghost"
                    className="h-9 justify-start gap-3 px-3 text-xs"
                    onClick={() => handleAddField(field.fieldType)}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{field.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <span className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Typography & Layout
            </span>
            <div className="mt-1 grid gap-1">
              {staticFieldDefinitions.map((field) => {
                const Icon = field.icon;
                return (
                  <Button
                    key={field.fieldType}
                    type="button"
                    variant="ghost"
                    className="h-9 justify-start gap-3 px-3 text-xs"
                    onClick={() => handleAddField(field.fieldType)}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{field.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
