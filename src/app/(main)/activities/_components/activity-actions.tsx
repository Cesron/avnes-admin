"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ActivityWithDetails } from "@/services/activities/get-activities";
import { EditIcon } from "lucide-react";
import { useEditActivity } from "../_context/edit-activity-context";
import { getActivityForEditAction } from "../_lib/get-activity-for-edit.action";
import { toast } from "sonner";

type ActivityActionsProps = {
  activity: ActivityWithDetails;
};

export function ActivityActions({ activity }: ActivityActionsProps) {
  const { openEditDialog } = useEditActivity();

  const handleEdit = async () => {
    const activityForEdit = await getActivityForEditAction(activity.id);

    if (!activityForEdit) {
      toast.error("No se pudo cargar la actividad");
      return;
    }

    openEditDialog(activityForEdit);
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <EditIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Actividad</TooltipContent>
      </Tooltip>
    </div>
  );
}
