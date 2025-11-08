"use client";

import type { Child } from "@/types/child";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditChildContextType = {
  isOpen: boolean;
  childToEdit: Child | null;
  openEditDialog: (child: Child) => void;
  closeEditDialog: () => void;
};

const EditChildContext = createContext<EditChildContextType | undefined>(
  undefined
);

export function EditChildProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);

  const openEditDialog = (child: Child) => {
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
