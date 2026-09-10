"use client";

import {
  CalendarDays,
  Check,
  CircleDot,
  Hash,
  KeyRound,
  List,
  ListChecks,
  MousePointer2,
  SlidersHorizontal,
  Text,
  ToggleLeft,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFormBuilderStore } from "@/app/store/form-builder.store";

const fieldDefinitions = [
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

export function FieldsPanel() {
  const addElement = useFormBuilderStore((state) => state.addElement);

  const handleAddField = (
    fieldType: (typeof fieldDefinitions)[number]["fieldType"],
  ) => {
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
              label: "Option-2",
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
        <div className="grid gap-1 p-3">
          {fieldDefinitions.map((field) => {
            const Icon = field.icon;

            return (
              <Button
                key={field.fieldType}
                type="button"
                variant="ghost"
                className="h-10 justify-start gap-3 px-3"
                onClick={() => handleAddField(field.fieldType)}
              >
                <Icon className="size-4 text-muted-foreground" />

                <span>{field.label}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
