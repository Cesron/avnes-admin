import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditActivity } from "../_context/edit-activity-context";
import { editActivityAction } from "../_lib/edit-activity.action";
import {
  type EditActivityFormData,
  editActivitySchema,
} from "../_lib/edit-activity.schema";

export function useEditActivityForm() {
  const [loading, setLoading] = useState(false);
  const { activityToEdit, closeEditDialog } = useEditActivity();

  const form = useForm<EditActivityFormData>({
    resolver: zodResolver(editActivitySchema) as never,
    defaultValues: {
      id: "",
      name: "",
      description: "",
      groupIds: [],
      isRecurring: false,
      singleDate: "",
      singleStartTime: "",
      singleEndTime: "",
      frequency: "weekly",
      interval: 1,
      daysOfWeek: [],
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    },
  });

  // Update form when activity to edit changes
  useEffect(() => {
    if (activityToEdit) {
      const daysOfWeek = activityToEdit.days_of_week
        ? activityToEdit.days_of_week.split(",")
        : [];

      // Format dates for input fields
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
      };

      // Format time from "HH:MM:SS" to "HH:MM"
      const formatTime = (time: string | null) => {
        if (!time) return "";
        return time.substring(0, 5);
      };

      // For non-recurring, get the single occurrence data
      let singleDate = "";
      let singleStartTime = "";
      let singleEndTime = "";

      if (!activityToEdit.is_recurring && activityToEdit.next_occurrence) {
        const occurrence = new Date(activityToEdit.next_occurrence);
        singleDate = occurrence.toISOString().split("T")[0];
        singleStartTime = occurrence.toTimeString().substring(0, 5);
        // Note: We don't have end_datetime here, would need to fetch it separately
        // For now, we'll leave it empty and user can update
      }

      form.reset({
        id: activityToEdit.id,
        name: activityToEdit.name,
        description: activityToEdit.description || "",
        groupIds: activityToEdit.group_ids || [],
        isRecurring: activityToEdit.is_recurring,
        singleDate,
        singleStartTime,
        singleEndTime,
        frequency: activityToEdit.frequency || "weekly",
        interval: activityToEdit.interval || 1,
        daysOfWeek,
        startDate: formatDate(activityToEdit.start_date),
        endDate: formatDate(activityToEdit.end_date),
        startTime: formatTime(activityToEdit.start_time),
        endTime: formatTime(activityToEdit.end_time),
      });
    }
  }, [activityToEdit, form]);

  async function onSubmit(data: EditActivityFormData) {
    const toastId = toast.loading("Actualizando actividad...");
    setLoading(true);

    const { serverError } = await editActivityAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Actividad actualizada exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
