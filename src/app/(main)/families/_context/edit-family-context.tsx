"use client";

import type { Family } from "@/types/family";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditFamilyContextType = {
  isOpen: boolean;
  familyToEdit: Family | null;
  openEditDialog: (family: Family) => void;
  closeEditDialog: () => void;
};

const EditFamilyContext = createContext<EditFamilyContextType | undefined>(
  undefined,
);

export function EditFamilyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [familyToEdit, setFamilyToEdit] = useState<Family | null>(null);

  const openEditDialog = (family: Family) => {
    setFamilyToEdit(family);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos la familia después de que se cierre la animación del modal
    setTimeout(() => setFamilyToEdit(null), 200);
  };

  return (
    <EditFamilyContext.Provider
      value={{
        isOpen,
        familyToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditFamilyContext.Provider>
  );
}

export function useEditFamily() {
  const context = useContext(EditFamilyContext);
  if (context === undefined) {
    throw new Error("useEditFamily must be used within an EditFamilyProvider");
  }
  return context;
}
