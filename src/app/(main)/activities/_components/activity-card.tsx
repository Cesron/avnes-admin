"use client";

import {
  CalendarIcon,
  EditIcon,
  MoreVerticalIcon,
  RepeatIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ActivityWithDetails } from "@/services/activities/get-activities";
import { formatDate } from "@/utils/format-date";
import { useEditActivity } from "../_context/edit-activity-context";
import { getActivityForEditAction } from "../_lib/get-activity-for-edit.action";
import { GroupsListDialog } from "./groups-list-dialog";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diario",
  weekly: "Semanal",
  monthly: "Mensual",
};

interface ActivityCardProps {
  activity: ActivityWithDetails;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { openEditDialog } = useEditActivity();
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false);

  const groupCount = activity.groups.length;
  const frequencyLabel = activity.frequency
    ? (FREQUENCY_LABELS[activity.frequency] ?? activity.frequency)
    : null;

  const handleEdit = async () => {
    const activityForEdit = await getActivityForEditAction(activity.id);
    if (!activityForEdit) {
      toast.error("No se pudo cargar la actividad");
      return;
    }
    openEditDialog(activityForEdit);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle className="text-base truncate">{activity.name}</CardTitle>
          {activity.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {activity.description}
            </p>
          )}
        </div>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú de acciones"
              >
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <EditIcon />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Recurrence + Frequency badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {activity.is_recurring ? (
            <>
              <Badge variant="blue-subtle">
                <RepeatIcon className="size-3" />
                Recurrente
              </Badge>
              {frequencyLabel && (
                <Badge variant="secondary">{frequencyLabel}</Badge>
              )}
            </>
          ) : (
            <Badge variant="purple-subtle">Única</Badge>
          )}
        </div>

        {/* Next occurrence */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4 shrink-0" />
          <span>
            {activity.next_occurrence ? (
              <>
                Próxima:{" "}
                <span className="text-foreground font-medium">
                  {formatDate(activity.next_occurrence)}
                </span>
              </>
            ) : (
              <span className="italic">Sin programar</span>
            )}
          </span>
        </div>

        {/* Groups count button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => setGroupsDialogOpen(true)}
          disabled={groupCount === 0}
        >
          <span className="flex items-center gap-2">
            <UsersIcon className="size-4" />
            <span>
              {groupCount === 0
                ? "Sin grupos"
                : `${groupCount} ${groupCount === 1 ? "grupo" : "grupos"}`}
            </span>
          </span>
          {groupCount > 0 && (
            <span className="text-xs text-muted-foreground">Ver lista</span>
          )}
        </Button>
      </CardContent>

      <GroupsListDialog
        open={groupsDialogOpen}
        onOpenChange={setGroupsDialogOpen}
        activityName={activity.name}
        groups={activity.groups}
      />
    </Card>
  );
}
