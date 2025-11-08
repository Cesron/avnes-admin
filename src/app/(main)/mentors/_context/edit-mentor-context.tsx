"use client";

import type { Mentor } from "@/types/mentor";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditMentorContextType = {
  isOpen: boolean;
  mentorToEdit: Mentor | null;
  openEditDialog: (mentor: Mentor) => void;
  closeEditDialog: () => void;
};

const EditMentorContext = createContext<EditMentorContextType | undefined>(
  undefined
);

export function EditMentorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mentorToEdit, setMentorToEdit] = useState<Mentor | null>(null);

  const openEditDialog = (mentor: Mentor) => {
    setMentorToEdit(mentor);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Limpiamos el mentor después de que se cierre la animación del modal
    setTimeout(() => setMentorToEdit(null), 200);
  };

  return (
    <EditMentorContext.Provider
      value={{
        isOpen,
        mentorToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditMentorContext.Provider>
  );
}

export function useEditMentor() {
  const context = useContext(EditMentorContext);
  if (context === undefined) {
    throw new Error("useEditMentor must be used within an EditMentorProvider");
  }
  return context;
}
