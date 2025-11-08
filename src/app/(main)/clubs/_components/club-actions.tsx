"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Club } from "@/types/club";
import { EditIcon } from "lucide-react";
import { useEditClub } from "../_context/edit-club-context";

type ClubActionsProps = {
  club: Club;
};

export function ClubActions({ club }: ClubActionsProps) {
  const { openEditDialog } = useEditClub();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(club)}
          >
            <EditIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Club</TooltipContent>
      </Tooltip>
    </div>
  );
}
