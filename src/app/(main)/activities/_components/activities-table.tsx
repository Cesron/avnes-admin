import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActivities } from "@/services/activities/get-activities";
import { formatDate } from "@/utils/format-date";
import { ActivityActions } from "./activity-actions";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Diario",
  weekly: "Semanal",
  monthly: "Mensual",
};

export async function ActivitiesTable() {
  const activities = await getActivities();

  return (
    <div className="overflow-hidden rounded-lg border my-4">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Grupos</TableHead>
            <TableHead>Recurrente</TableHead>
            <TableHead>Frecuencia</TableHead>
            <TableHead>Próxima fecha</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                <div className="font-medium">{activity.name}</div>
                {activity.description && (
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {activity.group_names || (
                    <span className="text-muted-foreground">Sin grupos</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    activity.is_recurring ? "blue-subtle" : "purple-subtle"
                  }
                >
                  {activity.is_recurring ? "Sí" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                {activity.is_recurring && activity.frequency ? (
                  <span>
                    {FREQUENCY_LABELS[activity.frequency] || activity.frequency}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                {activity.next_occurrence ? (
                  formatDate(activity.next_occurrence)
                ) : (
                  <span className="text-muted-foreground">Sin programar</span>
                )}
              </TableCell>
              <TableCell>
                <ActivityActions activity={activity} />
              </TableCell>
            </TableRow>
          ))}

          {activities.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No hay actividades registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
