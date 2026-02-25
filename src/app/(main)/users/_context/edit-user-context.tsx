"use client";

import type { UserWithMentor } from "@/services/users/get-users";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditUserContextType = {
  isOpen: boolean;
  userToEdit: UserWithMentor | null;
  openEditDialog: (user: UserWithMentor) => void;
  closeEditDialog: () => void;
};

const EditUserContext = createContext<EditUserContextType | undefined>(
  undefined,
);

export function EditUserProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserWithMentor | null>(null);

  const openEditDialog = (user: UserWithMentor) => {
    setUserToEdit(user);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    setTimeout(() => setUserToEdit(null), 200);
  };

  return (
    <EditUserContext.Provider
      value={{ isOpen, userToEdit, openEditDialog, closeEditDialog }}
    >
      {children}
    </EditUserContext.Provider>
  );
}

export function useEditUser() {
  const context = useContext(EditUserContext);
  if (context === undefined) {
    throw new Error("useEditUser must be used within an EditUserProvider");
  }
  return context;
}
