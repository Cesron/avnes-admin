import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createChildAction } from "../_lib/create-child.action";
import {
  CreateChildFormData,
  createChildSchema,
} from "../_lib/create-child.schema";

export function useCreateChildForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateChildFormData>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
    },
  });

  async function onSubmit(data: CreateChildFormData) {
    const toastId = toast.loading("Creando niño/niña...");
    setLoading(true);

    const { serverError } = await createChildAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Niño/niña creado exitosamente", { id: toastId });
    setLoading(false);
    form.reset();
  }

  return { form, onSubmit, loading };
}
