"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { OTPInput } from "@/lib/schema/form-builder.schema";
interface OTPFieldProps {
  element: OTPInput;
}
export default function OTPField({ element }: OTPFieldProps) {
  return (
    <Field className={element.className}>
      {" "}
      {element.label && (
        <FieldLabel htmlFor={element.id}> {element.label} </FieldLabel>
      )}{" "}
      <InputOTP id={element.id} maxLength={6} disabled={element.disabled}>
        {" "}
        <InputOTPGroup>
          {" "}
          <InputOTPSlot index={0} /> <InputOTPSlot index={1} />{" "}
          <InputOTPSlot index={2} /> <InputOTPSlot index={3} />{" "}
          <InputOTPSlot index={4} /> <InputOTPSlot index={5} />{" "}
        </InputOTPGroup>{" "}
      </InputOTP>{" "}
      {element.description && (
        <FieldDescription> {element.description} </FieldDescription>
      )}{" "}
    </Field>
  );
}
