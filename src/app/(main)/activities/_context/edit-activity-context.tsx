"use client";

import type { ActivityForEdit } from "@/services/activities/get-activity-for-edit";
import { createContext, useContext, useState, type ReactNode } from "react";

type EditActivityContextType = {
  isOpen: boolean;
  activityToEdit: ActivityForEdit | null;
  openEditDialog: (activity: ActivityForEdit) => void;
  closeEditDialog: () => void;
};

const EditActivityContext = createContext<EditActivityContextType | undefined>(
  undefined,
);

export function EditActivityProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<ActivityForEdit | null>(
    null,
  );

  const openEditDialog = (activity: ActivityForEdit) => {
    setActivityToEdit(activity);
    setIsOpen(true);
  };

  const closeEditDialog = () => {
    setIsOpen(false);
    // Clear after animation
    setTimeout(() => setActivityToEdit(null), 200);
  };

  return (
    <EditActivityContext.Provider
      value={{
        isOpen,
        activityToEdit,
        openEditDialog,
        closeEditDialog,
      }}
    >
      {children}
    </EditActivityContext.Provider>
  );
}

export function useEditActivity() {
  const context = useContext(EditActivityContext);
  if (context === undefined) {
    throw new Error(
      "useEditActivity must be used within an EditActivityProvider",
    );
  }
  return context;
}
