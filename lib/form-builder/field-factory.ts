import type { FormElement } from "@/lib/schema/form-builder.schema";

const createId = () => crypto.randomUUID();

export function createField(fieldType: FormElement["fieldType"]): FormElement {
  const id = createId();

  switch (fieldType) {
    case "Input":
      return {
        fieldType: "Input",
        id,
        name: `input_${id.slice(0, 8)}`,
        label: "Input",
        placeholder: "Enter value",
        type: "text",
        required: false,
        disabled: false,
        validation: {},
      };

    case "Password":
      return {
        fieldType: "Password",
        id,
        name: `password_${id.slice(0, 8)}`,
        label: "Password",
        placeholder: "Enter password",
        required: false,
        disabled: false,
        validation: {},
      };

    case "OTP":
      return {
        fieldType: "OTP",
        id,
        name: `otp_${id.slice(0, 8)}`,
        label: "Verification Code",
        description: "Enter your verification code.",
        required: false,
        disabled: false,
      };

    case "Textarea":
      return {
        fieldType: "Textarea",
        id,
        name: `textarea_${id.slice(0, 8)}`,
        label: "Textarea",
        placeholder: "Enter your message",
        required: false,
        disabled: false,
        validation: {},
      };

    case "Checkbox":
      return {
        fieldType: "Checkbox",
        id,
        name: `checkbox_${id.slice(0, 8)}`,
        label: "Accept terms",
        checked: false,
        required: false,
        disabled: false,
      };

    case "RadioGroup":
      return {
        fieldType: "RadioGroup",
        id,
        name: `radio_${id.slice(0, 8)}`,
        label: "Select an option",
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
        required: false,
        disabled: false,
      };

    case "ToggleGroup":
      return {
        fieldType: "ToggleGroup",
        id,
        name: `toggle_${id.slice(0, 8)}`,
        label: "Select an option",
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
        required: false,
        disabled: false,
      };

    case "Switch":
      return {
        fieldType: "Switch",
        id,
        name: `switch_${id.slice(0, 8)}`,
        label: "Enable feature",
        checked: false,
        required: false,
        disabled: false,
      };

    case "Slider":
      return {
        fieldType: "Slider",
        id,
        name: `slider_${id.slice(0, 8)}`,
        label: "Value",
        min: 0,
        max: 100,
        step: 1,
        value: [50],
        required: false,
        disabled: false,
      };

    case "Select":
      return {
        fieldType: "Select",
        id,
        name: `select_${id.slice(0, 8)}`,
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
        required: false,
        disabled: false,
      };

    case "MultiSelect":
      return {
        fieldType: "MultiSelect",
        id,
        name: `multi_select_${id.slice(0, 8)}`,
        label: "Select options",
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
        required: false,
        disabled: false,
      };

    case "DatePicker":
      return {
        fieldType: "DatePicker",
        id,
        name: `date_${id.slice(0, 8)}`,
        label: "Date",
        placeholder: "Pick a date",
        required: false,
        disabled: false,
      };

    case "H1":
      return {
        fieldType: "H1",
        id,
        content: "Heading 1",
      };

    case "H2":
      return {
        fieldType: "H2",
        id,
        content: "Heading 2",
      };

    case "H3":
      return {
        fieldType: "H3",
        id,
        content: "Heading 3",
      };

    case "Separator":
      return {
        fieldType: "Separator",
        id,
      };

    case "FieldDescription":
      return {
        fieldType: "FieldDescription",
        id,
        content: "Description",
      };

    case "FieldLegend":
      return {
        fieldType: "FieldLegend",
        id,
        content: "Legend",
      };

    case "FormArray":
      return {
        fieldType: "FormArray",
        id,
        name: `items_${id.slice(0, 8)}`,
        label: "Items",
        fields: [],
        entries: [],
      };

    default: {
      const exhaustiveCheck: any = fieldType;
      return exhaustiveCheck;
    }
  }
}
