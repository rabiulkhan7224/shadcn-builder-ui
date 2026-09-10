"use client";

import { useFormBuilderStore } from "@/app/store/form-builder.store";
import { BuilderElement } from "./builder-element";

export function FormPreview() {
  const form = useFormBuilderStore((state) => state.form);

  return (
    <div className="flex h-full flex-col">
      {/* Preview Header */}
      <div className="border-b px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold">Preview</h2>

          <p className="text-xs text-muted-foreground">
            Build and preview your form.
          </p>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-auto bg-muted/30 p-6">
        <div className="mx-auto min-h-full w-full max-w-2xl">
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            {/* Form Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {form.formName}
              </h1>

              <p className="text-sm text-muted-foreground">
                Build your form using the fields from the left panel.
              </p>
            </div>

            {/* Form Elements */}
            {form.formElements.length === 0 ? (
              <EmptyPreview />
            ) : (
              <div className="space-y-4">
                {form.formElements.map((element) => (
                  <BuilderElement key={element.id} element={element} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium">Your form is empty</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Select a field from the left panel to start building your form.
        </p>
      </div>
    </div>
  );
}
