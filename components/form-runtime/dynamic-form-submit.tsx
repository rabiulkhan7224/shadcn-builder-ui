"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DynamicFormSubmitProps {
  label?: string;
  loadingLabel?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export function DynamicFormSubmit({
  label = "Submit",
  loadingLabel = "Submitting...",
  disabled = false,
  isSubmitting = false,
}: DynamicFormSubmitProps) {
  return (
    <Button type="submit" disabled={disabled || isSubmitting}>
      {isSubmitting && <Loader2 className="animate-spin" />}

      {isSubmitting ? loadingLabel : label}
    </Button>
  );
}
