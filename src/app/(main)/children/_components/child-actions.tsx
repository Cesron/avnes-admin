"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Child } from "@/types/child";
import { EditIcon } from "lucide-react";
import { useEditChild } from "../_context/edit-child-context";

type ChildActionsProps = {
  child: Child;
};

export function ChildActions({ child }: ChildActionsProps) {
  const { openEditDialog } = useEditChild();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(child)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Niño/Niña</TooltipContent>
      </Tooltip>
    </div>
  );
}
