"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import type { FormBuilder } from "@/lib/schema/form-builder.schema";

import { generateZodSchema } from "@/lib/form-builder/generate-zod-schema";

import { DynamicFormSubmit } from "./dynamic-form-submit";
import { FormRenderer } from "../builder/renderer/FormRenderer";

interface DynamicFormProps {
  form: FormBuilder;
  onSubmit?: (values: unknown) => void | Promise<void>;
}

export function DynamicForm({ form, onSubmit }: DynamicFormProps) {
  const schema = generateZodSchema(form);

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (values: unknown) => {
    await onSubmit?.(values);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <FormRenderer elements={form.formElements} />

        <DynamicFormSubmit
          label={form.submit?.label ?? "Submit"}
          loadingLabel={form.submit?.loadingLabel ?? "Submitting..."}
          isSubmitting={methods.formState.isSubmitting}
          disabled={form.submit?.disabled ?? false}
        />
      </form>
    </FormProvider>
  );
}
