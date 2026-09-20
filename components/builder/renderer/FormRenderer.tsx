// "use client";

// import { FormElements } from "@/lib/schema/form-builder.schema";
// import { FormElementRenderer } from "./FormElementRenderer";

// interface FormRendererProps {
//   elements: FormElements;
// }

// export function FormRenderer({ elements }: FormRendererProps) {
//   return (
//     <div className="space-y-6">
//       {elements.map((element) => (
//         <FormElementRenderer key={element.id} element={element} />
//       ))}
//     </div>
//   );
// }

"use client";

import { DynamicFormField } from "@/components/form-runtime/dynamic-form-field";
import type { FormElements } from "@/lib/schema/form-builder.schema";

interface FormRendererProps {
  elements: FormElements;
}

export function FormRenderer({ elements }: FormRendererProps) {
  return (
    <div className="space-y-6">
      {elements.map((element) => {
        if (
          element.fieldType === "H1" ||
          element.fieldType === "H2" ||
          element.fieldType === "H3" ||
          element.fieldType === "Separator" ||
          element.fieldType === "FieldDescription" ||
          element.fieldType === "FieldLegend"
        ) {
          return null;
        }

        return <DynamicFormField key={element.id} element={element} />;
      })}
    </div>
  );
}
