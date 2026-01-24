"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GroupOption } from "@/services/groups/get-groups-options";
import { Controller } from "react-hook-form";
import { useCreateActivityForm } from "../_hooks/use-create-activity-form";

interface CreateActivityFormProps {
  groupsOptions: GroupOption[];
}

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
];

const DAYS_OF_WEEK = [
  { value: "monday", label: "Lun" },
  { value: "tuesday", label: "Mar" },
  { value: "wednesday", label: "Mié" },
  { value: "thursday", label: "Jue" },
  { value: "friday", label: "Vie" },
  { value: "saturday", label: "Sáb" },
  { value: "sunday", label: "Dom" },
];

export function CreateActivityForm({ groupsOptions }: CreateActivityFormProps) {
  const { form, onSubmit, loading } = useCreateActivityForm();
  const isRecurring = form.watch("isRecurring");
  const selectedGroups = form.watch("groupIds") || [];
  const selectedDays = form.watch("daysOfWeek") || [];

  const toggleGroup = (groupId: string) => {
    const current = form.getValues("groupIds") || [];
    if (current.includes(groupId)) {
      form.setValue(
        "groupIds",
        current.filter((id) => id !== groupId),
      );
    } else {
      form.setValue("groupIds", [...current, groupId]);
    }
  };

  const toggleDay = (day: string) => {
    const current = form.getValues("daysOfWeek") || [];
    if (current.includes(day)) {
      form.setValue(
        "daysOfWeek",
        current.filter((d) => d !== day),
      );
    } else {
      form.setValue("daysOfWeek", [...current, day]);
    }
  };

  return (
    <form id="form-create-activity" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-activity-name">
                Nombre de la Actividad
              </FieldLabel>
              <Input
                {...field}
                id="form-create-activity-name"
                aria-invalid={fieldState.invalid}
                placeholder="Ej: Clase de música"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-create-activity-description">
                Descripción (opcional)
              </FieldLabel>
              <Textarea
                {...field}
                id="form-create-activity-description"
                aria-invalid={fieldState.invalid}
                placeholder="Descripción de la actividad..."
                rows={3}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Groups Selection with Checkboxes */}
        <Controller
          name="groupIds"
          control={form.control}
          render={({ fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Grupos que participan</FieldLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {groupsOptions.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded border hover:bg-muted"
                  >
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                    />
                    <span className="text-sm">
                      {group.name}{" "}
                      <span className="text-muted-foreground">
                        ({group.club_name})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Is Recurring Toggle */}
        <Controller
          name="isRecurring"
          control={form.control}
          render={({ field }) => (
            <Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  id="form-create-activity-recurring"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel htmlFor="form-create-activity-recurring">
                  ¿Es una actividad recurrente?
                </FieldLabel>
              </label>
              <FieldDescription>
                Activa esta opción si la actividad se repite en el tiempo
              </FieldDescription>
            </Field>
          )}
        />

        {/* Non-recurring fields */}
        {!isRecurring && (
          <>
            <Controller
              name="singleDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-activity-single-date">
                    Fecha
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
                    id="form-create-activity-single-date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="singleStartTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-single-start-time">
                      Hora de inicio
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-create-activity-single-start-time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="singleEndTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-single-end-time">
                      Hora de fin
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-create-activity-single-end-time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </>
        )}

        {/* Recurring fields */}
        {isRecurring && (
          <>
            {/* Frequency */}
            <Controller
              name="frequency"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-activity-frequency">
                    Frecuencia
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-create-activity-frequency"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Interval */}
            <Controller
              name="interval"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-create-activity-interval">
                    Intervalo
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    id="form-create-activity-interval"
                    aria-invalid={fieldState.invalid}
                    placeholder="Cada cuántos períodos"
                  />
                  <FieldDescription>
                    Ej: 1 = cada semana, 2 = cada 2 semanas
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Days of Week with Checkboxes */}
            <Controller
              name="daysOfWeek"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Días de la semana</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day.value}
                        className="flex items-center gap-2 cursor-pointer p-2 rounded border hover:bg-muted min-w-[70px] justify-center"
                      >
                        <Checkbox
                          checked={selectedDays.includes(day.value)}
                          onCheckedChange={() => toggleDay(day.value)}
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-start-date">
                      Fecha de inicio
                    </FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      id="form-create-activity-start-date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-end-date">
                      Fecha de fin (opcional)
                    </FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      id="form-create-activity-end-date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Time range */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="startTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-start-time">
                      Hora de inicio
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-create-activity-start-time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="endTime"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-create-activity-end-time">
                      Hora de fin
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="form-create-activity-end-time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </>
        )}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Actividad"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
