"use client";

import { FieldsPanel } from "@/components/builder/fields-panel";
import { FormPreview } from "@/components/builder/form-preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const FormBuilderLayoutPage = () => {
  return (
    <div className="flex h-full w-full flex-col ">
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
          {/* <FieldEditor /> */}
          <h1>FieldEditor</h1>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default FormBuilderLayoutPage;
