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
import { Edit } from "lucide-react";

export function FormPreview() {
  const form = useFormBuilderStore((state) => state.form);
  const moveElement = useFormBuilderStore((state) => state.moveElement);
  const selectElement = useFormBuilderStore((state) => state.selectElement);
  const updateForm = useFormBuilderStore((state) => state.updateForm);

  // Track which element is actively being dragged for the overlay
  const [activeElement, setActiveElement] = React.useState<FormElement | null>(null);

  // Inline form name editing state
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(form.formName);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  // Sync nameInput when form.formName changes externally
  React.useEffect(() => {
    if (!isEditingName) {
      setNameInput(form.formName);
    }
  }, [form.formName, isEditingName]);

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNameInput(form.formName);
    setIsEditingName(true);
    setTimeout(() => nameInputRef.current?.select(), 0);
  };

  const commitName = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== form.formName) {
      updateForm({ formName: trimmed });
    } else {
      setNameInput(form.formName);
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitName();
    } else if (e.key === "Escape") {
      setNameInput(form.formName);
      setIsEditingName(false);
    }
  };

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
      <div className="border-b px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Preview</h2>
            <p className="text-xs text-muted-foreground">
              Build and preview your form.
            </p>
          </div>

          <div className="min-w-0 text-right">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={commitName}
                onKeyDown={handleNameKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="w-40 border-b-2 border-primary bg-transparent text-right text-lg font-semibold outline-none sm:w-56 sm:text-xl"
              />
            ) : (
              <h1
                className="group/title flex max-w-56 cursor-text items-center justify-end truncate text-lg font-semibold tracking-tight sm:max-w-md sm:text-xl"
                onClick={handleNameClick}
                title="Click to rename"
              >
                <span className="truncate">{nameInput}</span>
                <span className="shrink-0 text-muted-foreground/60">
                  .tsx
                </span>
                <Edit className="w-4 h-4" />
              </h1>
            )}
          </div>
        </div>


      </div>

      {/* Preview Canvas */}
      <div
        className="flex-1 overflow-auto bg-muted/30 p-6"
        onClick={() => selectElement(null)}
      >
        <div className="mx-auto min-h-full w-full max-w-2xl">
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            {/* Form Header */}


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
