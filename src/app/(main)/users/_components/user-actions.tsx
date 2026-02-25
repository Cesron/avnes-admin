"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserWithMentor } from "@/services/users/get-users";
import { EditIcon } from "lucide-react";
import { useEditUser } from "../_context/edit-user-context";

type UserActionsProps = {
  user: UserWithMentor;
};

export function UserActions({ user }: UserActionsProps) {
  const { openEditDialog } = useEditUser();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(user)}
          >
            <EditIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Usuario</TooltipContent>
      </Tooltip>
    </div>
  );
}
