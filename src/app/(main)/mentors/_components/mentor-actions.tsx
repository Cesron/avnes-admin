"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Mentor } from "@/types/mentor";
import { EditIcon } from "lucide-react";
import { useEditMentor } from "../_context/edit-mentor-context";

type MentorActionsProps = {
  mentor: Mentor;
};

export function MentorActions({ mentor }: MentorActionsProps) {
  const { openEditDialog } = useEditMentor();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(mentor)}
          >
            <EditIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Mentor</TooltipContent>
      </Tooltip>
    </div>
  );
}
