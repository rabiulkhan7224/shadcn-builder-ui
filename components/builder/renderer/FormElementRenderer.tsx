"use client";

import type { FormElement } from "@/lib/schema/form-builder.schema";

import OTPField from "./fields/otp-field";

import { InputRenderer } from "./fields/input-renderer";
import PasswordField from "./fields/password-renderer";
import TextareaField from "./fields/textarea-renderer";
import CheckboxField from "./fields/checkbox-renderer";
import RadioGroupField from "./fields/radio-group-renderer";
import ToggleGroupField from "./fields/toggle-group-renderer";
import SwitchField from "./fields/switch-renderer";
import SelectField from "./fields/select-field";

interface FormElementRendererProps {
  element: FormElement;
}

export default function FormElementRenderer({
  element,
}: FormElementRendererProps) {
  switch (element.fieldType) {
    case "Input":
      return <InputRenderer element={element} />;

    case "Password":
      return <PasswordField element={element} />;

    case "OTP":
      return <OTPField element={element} />;

    case "Textarea":
      return <TextareaField element={element} />;

    case "Checkbox":
      return <CheckboxField element={element} />;

    case "RadioGroup":
      return <RadioGroupField element={element} />;

    case "ToggleGroup":
      return <ToggleGroupField element={element} />;

    case "Switch":
      return <SwitchField element={element} />;

    // case "Slider":
    //   return <SliderField element={element} />;

    case "Select":
      return <SelectField element={element} />;

    // case "MultiSelect":
    //   return <MultiSelectField element={element} />;

    // case "DatePicker":
    //   return <DatePickerField element={element} />;

    // case "H1":
    //   return <H1Field element={element} />;

    // case "H2":
    //   return <H2Field element={element} />;

    // case "H3":
    //   return <H3Field element={element} />;

    // case "Separator":
    //   return <DividerField element={element} />;

    // case "FieldDescription":
    //   return <DescriptionField element={element} />;

    // case "FieldLegend":
    //   return <LegendField element={element} />;

    case "FormArray":
      return <div>{/* FormArray renderer will be added separately */}</div>;

    default:
      return null;
  }
}
