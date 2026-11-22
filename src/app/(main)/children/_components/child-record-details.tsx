import { CalendarDaysIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { ChildRecord } from "@/services/children/child-record";
import { calculateAge } from "@/utils/calculate-age";
import { formatDate } from "@/utils/format-date";
import { getGenderLabel } from "@/utils/get-gender-label";

export function ChildRecordDetails({
  child,
  showPrivateDetails = true,
  actions,
}: {
  child: ChildRecord;
  showPrivateDetails?: boolean;
  actions?: ReactNode;
}) {
  const birthDate = new Date(`${child.birth_date}T12:00:00`);
  const age = calculateAge(birthDate);

  return (
    <div className="min-w-0 space-y-4">
      <dl className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Sexo</dt>
          <dd>{getGenderLabel(child.gender)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Nacimiento</dt>
          <dd className="tabular-nums">
            <time dateTime={child.birth_date}>{formatDate(birthDate)}</time>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Edad</dt>
          <dd className="tabular-nums">
            {age} {age === 1 ? "año" : "años"}
          </dd>
        </div>
        <div className="col-span-2 lg:col-span-3">
          <dt className="text-muted-foreground">Grupos y clubes</dt>
          <dd>
            {child.groups.length ? (
              <ul>
                {child.groups.map((group) => (
                  <li key={group.id} className="wrap-anywhere">
                    {group.name} · {group.club_name}
                  </li>
                ))}
              </ul>
            ) : (
              "Sin grupo"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Registro</dt>
          <dd className="tabular-nums">
            <time dateTime={child.created_on}>
              {formatDate(`${child.created_on}T12:00:00`)}
            </time>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Última actualización</dt>
          <dd className="tabular-nums">
            <time dateTime={child.updated_on}>
              {formatDate(`${child.updated_on}T12:00:00`)}
            </time>
          </dd>
        </div>
      </dl>

      {showPrivateDetails && (
        <div className="space-y-1 border-t pt-4 text-sm">
          <p className="font-medium">Notas y comentarios</p>
          {child.notes ? (
            <p className="leading-relaxed whitespace-pre-wrap wrap-anywhere">
              {child.notes}
            </p>
          ) : (
            <p className="text-muted-foreground">Sin notas registradas</p>
          )}
        </div>
      )}

      {(actions || child.pamphlet_url || showPrivateDetails) && (
        <div className="flex flex-wrap gap-2">
          {actions}
          {child.pamphlet_url && (
            <Button asChild variant="outline" className="min-h-11">
              <a
                href={child.pamphlet_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileTextIcon aria-hidden="true" />
                Panfleto
                <span className="sr-only">
                  {" "}
                  de {child.name} (en otra pestaña)
                </span>
              </a>
            </Button>
          )}
          {showPrivateDetails && (
            <Button asChild variant="outline" className="min-h-11">
              <Link
                href={`/children/${child.id}/attendance`}
                aria-label={`Historial de asistencia de ${child.name}`}
              >
                <CalendarDaysIcon aria-hidden="true" />
                Historial de asistencia
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
