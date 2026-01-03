import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditFamily } from "../_context/edit-family-context";
import { editFamilyAction } from "../_lib/edit-family.action";
import {
  EditFamilyFormData,
  editFamilySchema,
} from "../_lib/edit-family.schema";

export function useEditFamilyForm() {
  const [loading, setLoading] = useState(false);
  const { familyToEdit, closeEditDialog } = useEditFamily();

  const form = useForm<EditFamilyFormData>({
    resolver: zodResolver(editFamilySchema),
    defaultValues: {
      id: "",
      penpalCode: "",
      familyBiographyUrl: "",
      familyPhotoUrl: "",
    },
  });

  // Actualizar el formulario cuando cambie la familia a editar
  useEffect(() => {
    if (familyToEdit) {
      form.reset({
        id: familyToEdit.id,
        penpalCode: familyToEdit.penpal_code,
        familyBiographyUrl: familyToEdit.family_biography_url || "",
        familyPhotoUrl: familyToEdit.family_photo_url || "",
      });
    }
  }, [familyToEdit, form]);

  async function onSubmit(data: EditFamilyFormData) {
    const toastId = toast.loading("Actualizando familia...");
    setLoading(true);

    const { serverError } = await editFamilyAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Familia actualizada exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
