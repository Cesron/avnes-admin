import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createActivityAction } from "../_lib/create-activity.action";
import {
  type CreateActivityFormData,
  createActivitySchema,
} from "../_lib/create-activity.schema";

export function useCreateActivityForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema) as never,
    defaultValues: {
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

  async function onSubmit(data: CreateActivityFormData) {
    const toastId = toast.loading("Creando actividad...");
    setLoading(true);

    const { serverError } = await createActivityAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Actividad creada exitosamente", { id: toastId });
    setLoading(false);
    form.reset();
  }

  return { form, onSubmit, loading };
}
