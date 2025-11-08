"use client";

import type { Group } from "@/types/group";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditGroupContextType = {
  isOpen: boolean;
  groupToEdit: Group | null;
  openEditDialog: (group: Group) => void;
  closeEditDialog: () => void;
};

const EditGroupContext = createContext<EditGroupContextType | undefined>(
  undefined
);

export function EditGroupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);

  const openEditDialog = (group: Group) => {
    setGroupToEdit(group);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos el grupo después de que se cierre la animación del modal
    setTimeout(() => setGroupToEdit(null), 200);
  };

  return (
    <EditGroupContext.Provider
      value={{
        isOpen,
        groupToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditGroupContext.Provider>
  );
}

export function useEditGroup() {
  const context = useContext(EditGroupContext);
  if (context === undefined) {
    throw new Error("useEditGroup must be used within an EditGroupProvider");
  }
  return context;
}
