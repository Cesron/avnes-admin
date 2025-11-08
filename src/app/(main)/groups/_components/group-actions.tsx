"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Group } from "@/types/group";
import { EditIcon } from "lucide-react";
import { useEditGroup } from "../_context/edit-group-context";

type GroupActionsProps = {
  group: Group;
};

export function GroupActions({ group }: GroupActionsProps) {
  const { openEditDialog } = useEditGroup();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(group)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Grupo</TooltipContent>
      </Tooltip>
    </div>
  );
}
