"use client";

import { useMemo, useState } from "react";

import { useFormBuilderStore } from "@/app/store/form-builder.store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateFormCode,
  type PackageManager,
} from "@/lib/form-builder/code-generator";
import { CodeBlock } from "../ui/code-block";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";

export function CodeGenerationPanel() {
  const form = useFormBuilderStore((state) => state.form);
  const [activeTab, setActiveTab] = useState("react-hook-form");
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => generateFormCode(form), [form]);

  const activeCode = (() => {
    if (activeTab === "zod") return code.zod;
    if (activeTab === "typescript") return code.typescript;
    if (activeTab === "react-hook-form") return code.reactHookForm;
    if (activeTab === "tanstack-form") return code.tanstackForm;

    // Fallback: show code according to the selected runtime in the builder settings
    return form.formLibrary === "tanstack-form"
      ? code.tanstackForm
      : code.reactHookForm;
  })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-t bg-background mx-auto ">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Generation Code </h2>
          <p className="text-xs text-muted-foreground">
            Generate code for your form based on the selected library and
            package manager.
          </p>
        </div>
        {/* select  */}
        <div className="flex items-center gap-2 px-4">
          <label className="text-xs text-muted-foreground">Form:</label>
          <Select
            value={form.formLibrary}
            onValueChange={(val) =>
              useFormBuilderStore.getState().updateForm({
                formLibrary: val as typeof form.formLibrary,
              })
            }
          >
            <SelectTrigger
              size="sm"
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react-hook-form">React Hook Form</SelectItem>
              <SelectItem value="tanstack-form">TanStack Form</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={packageManager}
            onValueChange={(val) => setPackageManager(val as PackageManager)}
          >
            <SelectTrigger
              size="sm"
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pnpm">pnpm</SelectItem>
              <SelectItem value="npm">npm</SelectItem>
              <SelectItem value="yarn">yarn</SelectItem>
              <SelectItem value="bun">bun</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy code"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full flex-col"
        >
          <TabsList className="mb-2 ">
            <TabsTrigger value="react-hook-form">React Hook Form</TabsTrigger>
            <TabsTrigger value="tanstack-form">TanStack Form</TabsTrigger>
            <TabsTrigger value="zod">Zod</TabsTrigger>
          </TabsList>

          <TabsContent
            value={activeTab}
            className="flex-1 overflow-hidden rounded-md border bg-muted/20"
          >
            {/* <pre className="h-full max-h-80 overflow-auto whitespace-pre-wrap p-3 text-xs leading-6 text-foreground">
              {activeCode}
            </pre> */}
            <CodeBlock
              showLineNumbers
              highlightClassName=""
              code={activeCode}
              language="tsx"
              filename={form.formName}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 rounded-md border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Install command
          </p>

          <CodeBlock
            showLineNumbers={false}
            highlightClassName=""
            code={code.installCommands[packageManager]}
            language="bash"
            filename={`Install with ${packageManager}`}
          />
        </div>
      </div>
    </div>
  );
}
