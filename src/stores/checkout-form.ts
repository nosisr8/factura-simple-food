import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export type CustomerDocumentType = "CI" | "RUC";

type CheckoutFormState = {
  name: string;
  documentType: CustomerDocumentType;
  document: string;

  setName: (name: string) => void;
  setDocumentType: (documentType: CustomerDocumentType) => void;
  setDocument: (document: string) => void;
  reset: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCheckoutFormStore = create<CheckoutFormState>()(
  persist(
    (set) => ({
      name: "",
      documentType: "CI",
      document: "",

      setName: (name) => set({ name }),
      setDocumentType: (documentType) => set({ documentType }),
      setDocument: (document) => set({ document }),
      reset: () => set({ name: "", documentType: "CI", document: "" }),
    }),
    {
      name: "checkout-form",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      version: 1,
    },
  ),
);

