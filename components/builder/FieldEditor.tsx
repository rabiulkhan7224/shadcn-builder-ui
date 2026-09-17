"use client";

import * as React from "react";
import {
  AlignLeft,
  CalendarDays,
  Check,
  CircleDot,
  Copy,
  Hash,
  Heading1,
  Heading2,
  Heading3,
  KeyRound,
  List,
  ListChecks,
  Minus,
  Plus,
  Settings2,
  SlidersHorizontal,
  Text,
  ToggleLeft,
  Trash2,
  Type,
  X,
} from "lucide-react";

import { useFormBuilderStore } from "@/app/store/form-builder.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { FormElement, Option } from "@/lib/schema/form-builder.schema";

const fieldTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Input: Type,
  Password: KeyRound,
  OTP: Hash,
  Textarea: Text,
  Select: List,
  MultiSelect: ListChecks,
  Checkbox: Check,
  RadioGroup: CircleDot,
  ToggleGroup: ToggleLeft,
  Switch: ToggleLeft,
  Slider: SlidersHorizontal,
  DatePicker: CalendarDays,
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  Separator: Minus,
  FieldDescription: AlignLeft,
  FieldLegend: Heading3,
};

export function FieldEditor() {
  const selectedElementId = useFormBuilderStore(
    (state) => state.selectedElementId
  );
  const formElements = useFormBuilderStore((state) => state.form.formElements);
  const updateElement = useFormBuilderStore((state) => state.updateElement);
  const removeElement = useFormBuilderStore((state) => state.removeElement);
  const duplicateElement = useFormBuilderStore(
    (state) => state.duplicateElement
  );
  const selectElement = useFormBuilderStore((state) => state.selectElement);

  // Helper to find selected element in flat or nested list
  const selectedElement = React.useMemo(() => {
    if (!selectedElementId) return null;
    return (
      (formElements.find(
        (el) => !Array.isArray(el) && el.id === selectedElementId
      ) as FormElement | undefined) ?? null
    );
  }, [formElements, selectedElementId]);

  if (!selectedElement) {
    return <EmptyFieldEditor />;
  }

  const Icon = fieldTypeIcons[selectedElement.fieldType] || Settings2;
  const isStatic =
    "static" in selectedElement && selectedElement.static === true;
  const hasOptions = [
    "Select",
    "MultiSelect",
    "RadioGroup",
    "ToggleGroup",
  ].includes(selectedElement.fieldType);

  const handleUpdate = (updates: Partial<FormElement>) => {
    updateElement(selectedElement.id, updates);
  };

  const handleDuplicate = () => {
    duplicateElement(selectedElement.id);
  };

  const handleDelete = () => {
    removeElement(selectedElement.id);
  };

  const handleClose = () => {
    selectElement(null);
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">
                {selectedElement.fieldType}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {isStatic ? "Static" : "Field"}
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[140px]">
              {selectedElement.name || selectedElement.id}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDuplicate}
            title="Duplicate field"
          >
            <Copy className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
            title="Delete field"
          >
            <Trash2 className="size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleClose}
            title="Close inspector"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Editor Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isStatic ? (
            <StaticElementEditor
              element={selectedElement}
              onUpdate={handleUpdate}
            />
          ) : (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value={hasOptions ? "options" : "behavior"}>
                  {hasOptions ? "Options" : "Behavior"}
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-4">
                <GeneralTab
                  element={selectedElement}
                  onUpdate={handleUpdate}
                />
              </TabsContent>

              {/* Validation Tab */}
              <TabsContent value="validation" className="space-y-4">
                <ValidationTab
                  element={selectedElement}
                  onUpdate={handleUpdate}
                />
              </TabsContent>

              {/* Options or Behavior Tab */}
              <TabsContent
                value={hasOptions ? "options" : "behavior"}
                className="space-y-4"
              >
                {hasOptions ? (
                  <OptionsTab
                    element={selectedElement}
                    onUpdate={handleUpdate}
                  />
                ) : (
                  <BehaviorTab
                    element={selectedElement}
                    onUpdate={handleUpdate}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/* =========================================================================
   Empty State
   ========================================================================= */
function EmptyFieldEditor() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Field Inspector</h2>
        <p className="text-xs text-muted-foreground">
          Configure element properties.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
          <Settings2 className="size-6 opacity-60" />
        </div>
        <p className="text-sm font-medium">No field selected</p>
        <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
          Select any field on the preview canvas to configure its properties,
          validation, and options.
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   General Tab
   ========================================================================= */
interface TabProps {
  element: any;
  onUpdate: (updates: Partial<FormElement>) => void;
}

function GeneralTab({ element, onUpdate }: TabProps) {
  return (
    <div className="space-y-3.5">
      {/* Label */}
      <div className="space-y-1.5">
        <Label htmlFor="field-label" className="text-xs font-medium">
          Label
        </Label>
        <Input
          id="field-label"
          value={element.label ?? ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Field label"
          className="h-8 text-xs"
        />
      </div>

      {/* Field Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="field-name" className="text-xs font-medium">
            Field Name / Key
          </Label>
          <span className="text-[10px] text-muted-foreground">data key</span>
        </div>
        <Input
          id="field-name"
          value={element.name ?? ""}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g. email, firstName"
          className="h-8 text-xs font-mono"
        />
      </div>

      {/* Input Sub-type (if Input) */}
      {element.fieldType === "Input" && (
        <div className="space-y-1.5">
          <Label htmlFor="input-type" className="text-xs font-medium">
            Input Type
          </Label>
          <Select
            value={element.type ?? "text"}
            onValueChange={(val: any) => onUpdate({ type: val })}
          >
            <SelectTrigger id="input-type" className="h-8 text-xs">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="tel">Telephone</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="datetime-local">Datetime Local</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Placeholder (if applicable) */}
      {"placeholder" in element && (
        <div className="space-y-1.5">
          <Label htmlFor="field-placeholder" className="text-xs font-medium">
            Placeholder
          </Label>
          <Input
            id="field-placeholder"
            value={element.placeholder ?? ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Description / Helper text */}
      <div className="space-y-1.5">
        <Label htmlFor="field-description" className="text-xs font-medium">
          Helper Description
        </Label>
        <Textarea
          id="field-description"
          value={element.description ?? ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Helpful guidance displayed below field"
          rows={2}
          className="text-xs resize-none"
        />
      </div>

      <Separator />

      {/* Disabled Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="field-disabled" className="text-xs font-medium">
            Disabled
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Prevent user interactions
          </p>
        </div>
        <Switch
          id="field-disabled"
          checked={Boolean(element.disabled)}
          onCheckedChange={(checked) => onUpdate({ disabled: checked })}
        />
      </div>
    </div>
  );
}

/* =========================================================================
   Validation Tab
   ========================================================================= */
function ValidationTab({ element, onUpdate }: TabProps) {
  return (
    <div className="space-y-4">
      {/* Required switch */}
      <div className="flex items-center justify-between rounded-md border p-2.5">
        <div>
          <Label htmlFor="field-required" className="text-xs font-medium">
            Required Field
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Field must have a valid value to submit
          </p>
        </div>
        <Switch
          id="field-required"
          checked={Boolean(element.required)}
          onCheckedChange={(checked) => onUpdate({ required: checked })}
        />
      </div>

      {/* Text specific validations */}
      {["Input", "Password", "Textarea"].includes(element.fieldType) && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Min Characters</Label>
            <Input
              type="number"
              min={0}
              placeholder="e.g. 3"
              className="h-8 text-xs"
              value={element.minLength ?? ""}
              onChange={(e) =>
                onUpdate({
                  minLength: e.target.value ? Number(e.target.value) : undefined,
                } as any)
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Max Characters</Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 100"
              className="h-8 text-xs"
              value={element.maxLength ?? ""}
              onChange={(e) =>
                onUpdate({
                  maxLength: e.target.value ? Number(e.target.value) : undefined,
                } as any)
              }
            />
          </div>
        </div>
      )}

      {/* Slider Validations */}
      {element.fieldType === "Slider" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Min Value</Label>
              <Input
                type="number"
                value={element.min ?? 0}
                onChange={(e) =>
                  onUpdate({ min: Number(e.target.value) } as any)
                }
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Max Value</Label>
              <Input
                type="number"
                value={element.max ?? 100}
                onChange={(e) =>
                  onUpdate({ max: Number(e.target.value) } as any)
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Step Size</Label>
            <Input
              type="number"
              min={0.1}
              step={0.5}
              value={element.step ?? 1}
              onChange={(e) =>
                onUpdate({ step: Number(e.target.value) } as any)
              }
              className="h-8 text-xs"
            />
          </div>
        </div>
      )}

      {/* MultiSelect Limit */}
      {element.fieldType === "MultiSelect" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Max Selectable Items</Label>
          <Input
            type="number"
            min={1}
            placeholder="Unlimited"
            value={element.maxSelected ?? ""}
            onChange={(e) =>
              onUpdate({
                maxSelected: e.target.value ? Number(e.target.value) : undefined,
              } as any)
            }
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* DatePicker Format */}
      {element.fieldType === "DatePicker" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Date Format Pattern</Label>
            <Input
              value={element.format ?? "PPP"}
              onChange={(e) => onUpdate({ format: e.target.value } as any)}
              placeholder="e.g. PPP, yyyy-MM-dd, dd/MM/yyyy"
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Uses date-fns tokens (PPP, yyyy-MM-dd, dd/MM/yyyy)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Options Tab
   ========================================================================= */
function OptionsTab({ element, onUpdate }: TabProps) {
  const options: Option[] = element.options ?? [];

  const handleAddOption = () => {
    const nextIndex = options.length + 1;
    const newOptions: Option[] = [
      ...options,
      {
        label: `Option ${nextIndex}`,
        value: `option-${nextIndex}`,
        disabled: false,
      },
    ];
    onUpdate({ options: newOptions } as any);
  };

  const handleUpdateOption = (
    index: number,
    updates: Partial<Option>
  ) => {
    const newOptions = options.map((opt, i) =>
      i === index ? { ...opt, ...updates } : opt
    );
    onUpdate({ options: newOptions } as any);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions } as any);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Choices ({options.length})</Label>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleAddOption}
          className="gap-1 text-xs h-7"
        >
          <Plus className="size-3" />
          Add Option
        </Button>
      </div>

      <div className="space-y-2">
        {options.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
            No options configured. Click "Add Option" above to create one.
          </div>
        ) : (
          options.map((option, index) => (
            <div
              key={index}
              className="rounded-md border bg-muted/20 p-2 space-y-2"
            >
              <div className="flex items-center gap-1.5">
                <Input
                  value={option.label}
                  onChange={(e) =>
                    handleUpdateOption(index, { label: e.target.value })
                  }
                  placeholder="Label"
                  className="h-7 text-xs flex-1 bg-background"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemoveOption(index)}
                  className="size-7 text-muted-foreground hover:text-destructive"
                  title="Remove option"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Input
                  value={option.value}
                  onChange={(e) =>
                    handleUpdateOption(index, { value: e.target.value })
                  }
                  placeholder="Value key"
                  className="h-6 text-[11px] font-mono flex-1 bg-background"
                />

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                  <span className="text-[10px]">Disabled:</span>
                  <Switch
                    checked={Boolean(option.disabled)}
                    onCheckedChange={(checked) =>
                      handleUpdateOption(index, { disabled: checked })
                    }
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   Behavior Tab
   ========================================================================= */
function BehaviorTab({ element, onUpdate }: TabProps) {
  return (
    <div className="space-y-3.5">
      {/* Textarea Rows */}
      {element.fieldType === "Textarea" && (
        <div className="space-y-1.5">
          <Label htmlFor="textarea-rows" className="text-xs font-medium">
            Visible Rows
          </Label>
          <Input
            id="textarea-rows"
            type="number"
            min={1}
            max={30}
            value={element.rows ?? 4}
            onChange={(e) =>
              onUpdate({ rows: Number(e.target.value) } as any)
            }
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* RadioGroup Orientation */}
      {element.fieldType === "RadioGroup" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Layout Orientation</Label>
          <Select
            value={element.orientation ?? "vertical"}
            onValueChange={(val: any) => onUpdate({ orientation: val } as any)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical (Stacked)</SelectItem>
              <SelectItem value="horizontal">Horizontal (Inline)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ToggleGroup Type */}
      {element.fieldType === "ToggleGroup" && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Selection Mode</Label>
          <Select
            value={element.type ?? "single"}
            onValueChange={(val: any) => onUpdate({ type: val } as any)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single (Radio style)</SelectItem>
              <SelectItem value="multiple">Multiple (Checkbox style)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom ClassName */}
      <div className="space-y-1.5">
        <Label htmlFor="custom-class" className="text-xs font-medium">
          Custom ClassName
        </Label>
        <Input
          id="custom-class"
          value={element.className ?? ""}
          onChange={(e) => onUpdate({ className: e.target.value })}
          placeholder="e.g. max-w-sm mt-4"
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}

/* =========================================================================
   Static Element Editor (H1, H2, H3, Separator, FieldDescription, FieldLegend)
   ========================================================================= */
function StaticElementEditor({ element, onUpdate }: TabProps) {
  const hasContent = [
    "H1",
    "H2",
    "H3",
    "FieldDescription",
    "FieldLegend",
  ].includes(element.fieldType);

  return (
    <div className="space-y-4">
      {hasContent && (
        <div className="space-y-1.5">
          <Label htmlFor="static-content" className="text-xs font-medium">
            Displayed Text Content
          </Label>
          <Textarea
            id="static-content"
            value={element.content ?? ""}
            onChange={(e) => onUpdate({ content: e.target.value } as any)}
            placeholder="Heading or descriptive text"
            rows={4}
            className="text-xs resize-none"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="static-name" className="text-xs font-medium">
          Identifier Name
        </Label>
        <Input
          id="static-name"
          value={element.name ?? ""}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g. section_header"
          className="h-8 text-xs font-mono"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="static-class" className="text-xs font-medium">
          Custom ClassName
        </Label>
        <Input
          id="static-class"
          value={element.className ?? ""}
          onChange={(e) => onUpdate({ className: e.target.value })}
          placeholder="e.g. mb-4 text-center"
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}

export default FieldEditor;
