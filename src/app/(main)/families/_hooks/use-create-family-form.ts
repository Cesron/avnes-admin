import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createFamilyAction } from "../_lib/create-family.action";
import {
  CreateFamilyFormData,
  createFamilySchema,
} from "../_lib/create-family.schema";

type UseCreateFamilyFormProps = {
  suggestedPenpalCode: string;
};

export function useCreateFamilyForm({
  suggestedPenpalCode,
}: UseCreateFamilyFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateFamilyFormData>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: {
      penpalCode: suggestedPenpalCode,
      familyBiographyUrl: "",
      familyPhotoUrl: "",
    },
  });

  async function onSubmit(data: CreateFamilyFormData) {
    const toastId = toast.loading("Creando familia...");
    setLoading(true);

    const { serverError } = await createFamilyAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Familia creada exitosamente", { id: toastId });
    setLoading(false);
    form.reset({
      penpalCode: suggestedPenpalCode,
      familyBiographyUrl: "",
      familyPhotoUrl: "",
    });
  }

  return { form, onSubmit, loading };
}
