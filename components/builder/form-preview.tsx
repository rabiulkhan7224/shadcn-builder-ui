"use client";

import * as React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";

import { useFormBuilderStore } from "@/app/store/form-builder.store";
import type { FormElement } from "@/lib/schema/form-builder.schema";
import { BuilderElement } from "./builder-element";
import FormElementRenderer from "./renderer/FormElementRenderer";

export function FormPreview() {
  const form = useFormBuilderStore((state) => state.form);
  const moveElement = useFormBuilderStore((state) => state.moveElement);
  const selectElement = useFormBuilderStore((state) => state.selectElement);

  // Track which element is actively being dragged for the overlay
  const [activeElement, setActiveElement] = React.useState<FormElement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require 8px movement before drag activates, preventing accidental drags
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const elementIds = React.useMemo(
    () =>
      (form.formElements as FormElement[])
        .filter((el) => !Array.isArray(el))
        .map((el) => el.id),
    [form.formElements]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const element = (form.formElements as FormElement[]).find(
      (el) => !Array.isArray(el) && el.id === active.id
    );
    if (element) {
      setActiveElement(element);
      // Deselect while dragging to avoid confusion
      selectElement(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveElement(null);

    if (!over || active.id === over.id) return;

    const elements = form.formElements as FormElement[];
    const fromIndex = elements.findIndex((el) => !Array.isArray(el) && el.id === active.id);
    const toIndex = elements.findIndex((el) => !Array.isArray(el) && el.id === over.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      moveElement(fromIndex, toIndex);
      // Re-select the moved element after drop
      selectElement(String(active.id));
    }
  };

  const handleDragCancel = () => {
    setActiveElement(null);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Preview Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold">Preview</h2>
        <p className="text-xs text-muted-foreground">
          Build and preview your form.
        </p>
      </div>

      {/* Preview Canvas */}
      <div
        className="flex-1 overflow-auto bg-muted/30 p-6"
        onClick={() => selectElement(null)}
      >
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext
                  items={elementIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {(form.formElements as FormElement[]).map((element) =>
                      Array.isArray(element) ? null : (
                        <BuilderElement key={element.id} element={element} />
                      )
                    )}
                  </div>
                </SortableContext>

                {/* Floating overlay while dragging */}
                <DragOverlay>
                  {activeElement ? (
                    <DragOverlayElement element={activeElement} />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Drag Overlay — a lightweight ghost of the element being dragged
   ------------------------------------------------------------------ */
function DragOverlayElement({ element }: { element: FormElement }) {
  return (
    <div className="rounded-lg border border-primary bg-background p-3 shadow-xl ring-2 ring-primary/30 opacity-95 cursor-grabbing">
      <FormElementRenderer element={element} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Empty State
   ------------------------------------------------------------------ */
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
