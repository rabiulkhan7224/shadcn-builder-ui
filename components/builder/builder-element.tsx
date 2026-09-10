"use client";

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
import { FormElement } from "@/lib/schema/form-builder.schema";
import FormElementRenderer from "./renderer/FormElementRenderer";

interface BuilderElementProps {
  element: FormElement;
}

export function BuilderElement({ element }: BuilderElementProps) {
  const selectedElementId = useFormBuilderStore(
    (state) => state.selectedElementId,
  );

  const selectElement = useFormBuilderStore((state) => state.selectElement);

  const removeElement = useFormBuilderStore((state) => state.removeElement);

  const duplicateElement = useFormBuilderStore(
    (state) => state.duplicateElement,
  );

  const isSelected = selectedElementId === element.id;

  const handleSelect = () => {
    selectElement(element.id);
  };

  const handleDelete = () => {
    removeElement(element.id);
  };

  const handleDuplicate = () => {
    duplicateElement(element.id);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "group relative rounded-lg border border-transparent",
          "transition-colors",
          "hover:border-border",
          isSelected && "border-primary",
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
            isSelected && "flex",
          )}
        >
          {/* Drag Handle */}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="cursor-grab text-muted-foreground"
            aria-label="Drag field"
          >
            <GripVertical />
          </Button>

          {/* Field Type */}
          <span className="px-1.5 text-xs text-muted-foreground">
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy />
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Field */}
        <div className="p-3">
          <FormElementRenderer element={element} />
        </div>
      </div>
    </div>
  );
}
