"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { useFormBuilderStore } from "@/app/store/form-builder.store";
import type { FormElement } from "@/lib/schema/form-builder.schema";
import FormElementRenderer from "./renderer/FormElementRenderer";

interface BuilderElementProps {
  element: FormElement;
}

export function BuilderElement({ element }: BuilderElementProps) {
  const selectedElementId = useFormBuilderStore(
    (state) => state.selectedElementId
  );
  const selectElement = useFormBuilderStore((state) => state.selectElement);
  const removeElement = useFormBuilderStore((state) => state.removeElement);
  const duplicateElement = useFormBuilderStore(
    (state) => state.duplicateElement
  );

  const isSelected = selectedElementId === element.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : undefined,
  };

  const handleSelect = () => selectElement(element.id);
  const handleDelete = () => removeElement(element.id);
  const handleDuplicate = () => duplicateElement(element.id);

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className={cn(
          "group relative rounded-lg border border-transparent",
          "transition-colors duration-150",
          "hover:border-border",
          isSelected && "border-primary ring-2 ring-primary/20",
          isDragging && "shadow-lg"
        )}
        onClick={(event) => {
          event.stopPropagation();
          handleSelect();
        }}
      >
        {/* Field Toolbar */}
        <div
          className={cn(
            "absolute -top-3 right-2 z-10",
            "hidden items-center gap-1 rounded-md border",
            "bg-background p-1 shadow-sm",
            "group-hover:flex",
            isSelected && "flex"
          )}
        >
          {/* Drag Handle — connected to dnd-kit */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none"
            aria-label="Drag to reorder field"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-3.5" />
          </Button>

          {/* Field Type Badge */}
          <span className="px-1.5 text-xs text-muted-foreground select-none">
            {element.fieldType}
          </span>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={(event) => event.stopPropagation()}
                aria-label="Field actions"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="size-3.5" />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Field Content */}
        <div className="p-3">
          <FormElementRenderer element={element} />
        </div>
      </div>
    </div>
  );
}
