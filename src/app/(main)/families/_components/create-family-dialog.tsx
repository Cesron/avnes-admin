"use client";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateFamilyForm } from "./create-family-form";

// Keep the trigger and its slotted child in the same client boundary. Radix
// cannot clone a streamed Server Component child consistently during SSR.
export function CreateFamilyDialog({
  suggestedPenpalCode,
}: {
  suggestedPenpalCode: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon />
          Agregar Familia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Familia</DialogTitle>
          <DialogDescription>
            Ingresa los datos de la nueva familia.
          </DialogDescription>
        </DialogHeader>
        <CreateFamilyForm suggestedPenpalCode={suggestedPenpalCode} />
      </DialogContent>
    </Dialog>
  );
}
