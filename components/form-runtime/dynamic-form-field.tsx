"use client";

import type { FormElement } from "@/lib/schema/form-builder.schema";
import PasswordField from "../builder/renderer/fields/password-renderer";
import { InputRenderer } from "../builder/renderer/fields/input-renderer";
import OTPField from "../builder/renderer/fields/otp-field";
import TextareaField from "../builder/renderer/fields/textarea-renderer";
import CheckboxField from "../builder/renderer/fields/checkbox-renderer";
import RadioGroupField from "../builder/renderer/fields/radio-group-renderer";
import ToggleGroupField from "../builder/renderer/fields/toggle-group-renderer";
import SwitchField from "../builder/renderer/fields/switch-renderer";
import { SliderField } from "../builder/renderer/fields/slider-renderer";
import SelectField from "../builder/renderer/fields/select-field";
import { MultiSelectField } from "../builder/renderer/fields/multi-select-field";
import { DatePickerField } from "../builder/renderer/fields/date-picker-renderer";

interface DynamicFormFieldProps {
  element: FormElement;
}

export function DynamicFormField({ element }: DynamicFormFieldProps) {
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

    case "Slider":
      return <SliderField element={element} />;

    case "Select":
      return <SelectField element={element} />;

    case "MultiSelect":
      return <MultiSelectField element={element} />;

    case "DatePicker":
      return <DatePickerField element={element} />;

    default:
      return null;
  }
}
