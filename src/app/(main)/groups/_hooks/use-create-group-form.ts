import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createGroupAction } from "../_lib/create-group.action";
import {
  createGroupSchema,
  CreateGroupFormInput,
} from "../_lib/create-group.schema";

export function useCreateGroupForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateGroupFormInput>({
    resolver: zodResolver(createGroupSchema) as any,
    defaultValues: {
      name: "",
      clubId: "",
      mentorId: "",
    },
  });

  async function onSubmit(data: CreateGroupFormInput) {
    const toastId = toast.loading("Creando grupo...");
    setLoading(true);

    console.log("Submitting data:", data);

    const { serverError, validationErrors } = await createGroupAction(data);

    console.log("createGroupAction response:", {
      serverError,
      validationErrors,
    });

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Grupo creado exitosamente", { id: toastId });
    setLoading(false);
  }

  return { form, onSubmit, loading };
}
