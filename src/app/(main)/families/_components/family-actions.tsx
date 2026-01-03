"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Family } from "@/types/family";
import { EditIcon } from "lucide-react";
import { useEditFamily } from "../_context/edit-family-context";

type FamilyActionsProps = {
  family: Family;
};

export function FamilyActions({ family }: FamilyActionsProps) {
  const { openEditDialog } = useEditFamily();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(family)}
          >
            <EditIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Familia</TooltipContent>
      </Tooltip>
    </div>
  );
}
