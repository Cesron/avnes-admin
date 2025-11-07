import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createClubAction } from "../_lib/create-club.action";
import {
  CreateClubFormData,
  createClubSchema,
} from "../_lib/create-club.schema";

export function useCreateClubForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateClubFormData>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: CreateClubFormData) {
    const toastId = toast.loading("Creando club...");
    setLoading(true);

    const { serverError } = await createClubAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Club creado exitosamente", { id: toastId });
    setLoading(false);
  }

  return { form, onSubmit, loading };
}
