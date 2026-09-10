import {
  FormBuilder,
  FormBuilderSettings,
  FormElement,
  FormElements,
} from "@/lib/schema/form-builder.schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormBuilderState {
  form: FormBuilder;

  selectedElementId: string | null;

  // Form
  setForm: (form: FormBuilder) => void;

  updateForm: (updates: Partial<FormBuilder>) => void;

  resetForm: () => void;

  // Settings
  updateSettings: (updates: Partial<FormBuilderSettings>) => void;

  setActiveTab: (tab: FormBuilderSettings["activeTab"]) => void;

  // Elements
  setFormElements: (formElements: FormElements) => void;

  addElement: (element: FormElement, index?: number) => void;

  updateElement: (elementId: string, updates: Partial<FormElement>) => void;

  removeElement: (elementId: string) => void;

  moveElement: (fromIndex: number, toIndex: number) => void;
  duplicateElement: (elementId: string) => void;
  // Selection
  selectElement: (elementId: string | null) => void;
}

const createDefaultForm = (): FormBuilder => ({
  id: crypto.randomUUID(),
  formName: "draft",
  schemaName: "draftFormSchema",
  isMultiStep: false,
  formElements: [],
  steps: [],
  settings: {
    defaultRequiredValidation: true,
    numericInput: false,
    focusOnError: true,
    validationMethod: "onDynamic",
    asyncValidationDebounce: 500,
    activeTab: "builder",
    preferredSchema: "zod",
    preferredFramework: "react",
    preferredPackageManager: "pnpm",
    isCodeSidebarOpen: false,
  },
});

// export const useFormBuilderStore = create<FormBuilderState>((set) => ({
//   form: createDefaultForm(),

//   selectedElementId: null,

//   // Form

//   setForm: (form) =>
//     set({
//       form,
//     }),

//   updateForm: (updates) =>
//     set((state) => ({
//       form: {
//         ...state.form,
//         ...updates,
//       },
//     })),

//   resetForm: () =>
//     set({
//       form: createDefaultForm(),
//       selectedElementId: null,
//     }),

//   // Settings

//   updateSettings: (updates) =>
//     set((state) => ({
//       form: {
//         ...state.form,

//         settings: {
//           ...state.form.settings,
//           ...updates,
//         },
//       },
//     })),

//   setActiveTab: (tab) =>
//     set((state) => ({
//       form: {
//         ...state.form,

//         settings: {
//           ...state.form.settings,

//           activeTab: tab,
//         },
//       },
//     })),

//   // Elements

//   setFormElements: (formElements) =>
//     set((state) => ({
//       form: {
//         ...state.form,
//         formElements,
//       },
//     })),

//   addElement: (element, index) =>
//     set((state) => {
//       const elements = [...state.form.formElements];

//       if (index === undefined || index < 0 || index > elements.length) {
//         elements.push(element);
//       } else {
//         elements.splice(index, 0, element);
//       }

//       return {
//         form: {
//           ...state.form,
//           formElements: elements,
//         },

//         selectedElementId: element.id,
//       };
//     }),

//   updateElement: (elementId, updates) =>
//     set((state) => ({
//       form: {
//         ...state.form,

//         formElements: state.form.formElements.map((element) =>
//           element.id === elementId
//             ? {
//                 ...element,
//                 ...updates,
//               }
//             : element,
//         ),
//       },
//     })),

//   removeElement: (elementId) =>
//     set((state) => ({
//       form: {
//         ...state.form,

//         formElements: state.form.formElements.filter(
//           (element) => element.id !== elementId,
//         ),
//       },

//       selectedElementId:
//         state.selectedElementId === elementId ? null : state.selectedElementId,
//     })),

//   moveElement: (fromIndex, toIndex) =>
//     set((state) => {
//       const elements = [...state.form.formElements];

//       if (
//         fromIndex < 0 ||
//         fromIndex >= elements.length ||
//         toIndex < 0 ||
//         toIndex >= elements.length
//       ) {
//         return state;
//       }

//       const [element] = elements.splice(fromIndex, 1);

//       elements.splice(toIndex, 0, element);

//       return {
//         form: {
//           ...state.form,
//           formElements: elements,
//         },
//       };
//     }),

//   // Selection

//   selectElement: (elementId) =>
//     set({
//       selectedElementId: elementId,
//     }),
// }));

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set) => ({
      form: createDefaultForm(),
      selectedElementId: null,

      setForm: (form) => set({ form }),

      updateForm: (updates) =>
        set((state) => ({
          form: {
            ...state.form,
            ...updates,
          },
        })),

      updateSettings: (updates) =>
        set((state) => ({
          form: {
            ...state.form,
            settings: {
              ...state.form.settings,
              ...updates,
            },
          },
        })),

      setFormElements: (formElements) =>
        set((state) => ({
          form: {
            ...state.form,
            formElements,
          },
        })),

      addElement: (element, index) =>
        set((state) => {
          const elements = [...state.form.formElements];

          if (index === undefined) {
            elements.push(element);
          } else {
            elements.splice(index, 0, element);
          }

          return {
            form: {
              ...state.form,
              formElements: elements,
            },
            selectedElementId: element.id,
          };
        }),

      updateElement: (elementId, updates) =>
        set((state) => ({
          form: {
            ...state.form,
            formElements: state.form.formElements.map((element) =>
              element.id === elementId ? { ...element, ...updates } : element,
            ),
          },
        })),

      removeElement: (elementId) =>
        set((state) => ({
          form: {
            ...state.form,
            formElements: state.form.formElements.filter(
              (element) => element.id !== elementId,
            ),
          },
          selectedElementId:
            state.selectedElementId === elementId
              ? null
              : state.selectedElementId,
        })),

      moveElement: (fromIndex, toIndex) =>
        set((state) => {
          const elements = [...state.form.formElements];

          if (
            fromIndex < 0 ||
            fromIndex >= elements.length ||
            toIndex < 0 ||
            toIndex >= elements.length
          ) {
            return state;
          }

          const [element] = elements.splice(fromIndex, 1);

          elements.splice(toIndex, 0, element);

          return {
            form: {
              ...state.form,
              formElements: elements,
            },
          };
        }),

      selectElement: (elementId) =>
        set({
          selectedElementId: elementId,
        }),

      setActiveTab: (tab) =>
        set((state) => ({
          form: {
            ...state.form,
            settings: {
              ...state.form.settings,
              activeTab: tab,
            },
          },
        })),

      duplicateElement: (elementId) =>
        set((state) => {
          const index = state.form.formElements.findIndex(
            (element) => element.id === elementId,
          );

          if (index === -1) {
            return state;
          }

          const original = state.form.formElements[index];

          const duplicate = {
            ...structuredClone(original),
            id: crypto.randomUUID(),
            name: `${original.name}_copy`,
          };

          const formElements = [...state.form.formElements];

          formElements.splice(index + 1, 0, duplicate);

          return {
            form: {
              ...state.form,
              formElements,
            },
            selectedElementId: duplicate.id,
          };
        }),

      resetForm: () =>
        set({
          form: createDefaultForm(),
          selectedElementId: null,
        }),
    }),
    {
      name: "shadcn-builder-ui",
    },
  ),
);
