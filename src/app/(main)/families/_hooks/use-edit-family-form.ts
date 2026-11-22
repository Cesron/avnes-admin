import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditFamily } from "../_context/edit-family-context";
import { editFamilyAction } from "../_lib/edit-family.action";
import {
  type EditFamilyFormData,
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
      history: "",
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
        history: familyToEdit.history ?? "",
      });
    }
  }, [familyToEdit, form]);

  async function onSubmit(data: EditFamilyFormData) {
    const toastId = toast.loading("Actualizando familia...");
    setLoading(true);

    try {
      const result = await editFamilyAction({
        ...data,
        history: form.getFieldState("history").isDirty
          ? data.history
          : undefined,
      });
      if (result?.serverError || !result?.data) {
        toast.error(
          result?.serverError ?? "Revisa los datos e inténtalo de nuevo.",
          {
            id: toastId,
          },
        );
        return;
      }

      toast.success("Familia actualizada exitosamente", { id: toastId });
      closeEditDialog();
    } catch {
      toast.error("No se pudieron guardar los cambios. Inténtalo de nuevo.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return { form, onSubmit, loading };
}
