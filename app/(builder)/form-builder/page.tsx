"use client";

import { FieldEditor } from "@/components/builder/FieldEditor";
import { CodeGenerationPanel } from "@/components/builder/code-generation-panel";
import { FieldsPanel } from "@/components/builder/fields-panel";
import { FormPreview } from "@/components/builder/form-preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const FormBuilderLayoutPage = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex max-w-7xl items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Form Builder</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="w-fit">
              {/* View generated code header */}
              View generated code
            </Button>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="mx-auto h-[80vh]! max-h-[80vh]! max-w-7xl rounded-t-2xl p-0 overflow-auto"
            showCloseButton
          >
            <CodeGenerationPanel />
          </SheetContent>
        </Sheet>
      </div>

      <ResizablePanelGroup
        orientation="horizontal"
        className="max-w-7xl rounded-lg border"
      >
        <ResizablePanel defaultSize="20%">
          <FieldsPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize="50%">
          <FormPreview />
        </ResizablePanel>

        <ResizableHandle withHandle className="text-2xl" />

        <ResizablePanel defaultSize="20%">
          <FieldEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default FormBuilderLayoutPage;
