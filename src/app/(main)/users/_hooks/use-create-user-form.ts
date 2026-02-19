import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUserAction } from "../_lib/create-user.action";
import {
  type CreateUserFormData,
  createUserSchema,
} from "../_lib/create-user.schema";

export function useCreateUserForm(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema) as never,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
      mentorId: undefined,
    },
  });

  async function onSubmit(data: CreateUserFormData) {
    const toastId = toast.loading("Creando usuario...");
    setLoading(true);

    const { serverError } = await createUserAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Usuario creado exitosamente", { id: toastId });
    setLoading(false);
    form.reset();
    onSuccess?.();
  }

  return { form, onSubmit, loading };
}
