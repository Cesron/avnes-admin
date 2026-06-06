"use client";

import type { ChildWithFamily } from "@/services/children/get-children";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditChildContextType = {
  isOpen: boolean;
  childToEdit: ChildWithFamily | null;
  openEditDialog: (child: ChildWithFamily) => void;
  closeEditDialog: () => void;
};

const EditChildContext = createContext<EditChildContextType | undefined>(
  undefined,
);

export function EditChildProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<ChildWithFamily | null>(null);

  const openEditDialog = (child: ChildWithFamily) => {
    setChildToEdit(child);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos el niño después de que se cierre la animación del modal
    setTimeout(() => setChildToEdit(null), 200);
  };

  return (
    <EditChildContext.Provider
      value={{
        isOpen,
        childToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditChildContext.Provider>
  );
}

export function useEditChild() {
  const context = useContext(EditChildContext);
  if (context === undefined) {
    throw new Error("useEditChild must be used within an EditChildProvider");
  }
  return context;
}
