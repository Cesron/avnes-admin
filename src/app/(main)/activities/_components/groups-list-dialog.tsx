"use client";

import { UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActivityGroup } from "@/services/activities/get-activities";

interface GroupsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activityName: string;
  groups: ActivityGroup[];
}

/**
 * Dialog that shows the full list of groups participating in an activity.
 * Used from ActivityCard when there are too many groups to display inline.
 */
export function GroupsListDialog({
  open,
  onOpenChange,
  activityName,
  groups,
}: GroupsListDialogProps) {
  const count = groups.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersIcon className="size-5" />
            Grupos de la actividad
          </DialogTitle>
          <DialogDescription>
            {count} {count === 1 ? "grupo participa" : "grupos participan"} en
            &ldquo;{activityName}&rdquo;
          </DialogDescription>
        </DialogHeader>

        {count === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            No hay grupos asignados a esta actividad.
          </p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <Badge variant="secondary" className="font-normal">
                    {group.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
