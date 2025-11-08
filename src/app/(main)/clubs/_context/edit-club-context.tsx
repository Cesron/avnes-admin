"use client";

import type { Club } from "@/types/club";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditClubContextType = {
  isOpen: boolean;
  clubToEdit: Club | null;
  openEditDialog: (club: Club) => void;
  closeEditDialog: () => void;
};

const EditClubContext = createContext<EditClubContextType | undefined>(
  undefined
);

export function EditClubProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);

  const openEditDialog = (club: Club) => {
    setClubToEdit(club);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos el club después de que se cierre la animación del modal
    setTimeout(() => setClubToEdit(null), 200);
  };

  return (
    <EditClubContext.Provider
      value={{
        isOpen,
        clubToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditClubContext.Provider>
  );
}

export function useEditClub() {
  const context = useContext(EditClubContext);
  if (context === undefined) {
    throw new Error("useEditClub must be used within an EditClubProvider");
  }
  return context;
}
