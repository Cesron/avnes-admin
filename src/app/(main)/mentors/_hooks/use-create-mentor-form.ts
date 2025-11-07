import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createMentorAction } from "../_lib/create-mentor.action";
import {
  CreateMentorFormData,
  createMentorSchema,
} from "../_lib/create-mentor.schema";

export function useCreateMentorForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateMentorFormData>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(data: CreateMentorFormData) {
    const toastId = toast.loading("Creando mentor...");
    setLoading(true);

    const { serverError } = await createMentorAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Mentor creado exitosamente", { id: toastId });
    setLoading(false);
  }

  return { form, onSubmit, loading };
}
