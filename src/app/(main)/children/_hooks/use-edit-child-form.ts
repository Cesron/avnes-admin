import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditChild } from "../_context/edit-child-context";
import { editChildAction } from "../_lib/edit-child.action";
import {
  type EditChildFormData,
  editChildSchema,
} from "../_lib/edit-child.schema";

export function useEditChildForm() {
  const [loading, setLoading] = useState(false);
  const { childToEdit, closeEditDialog } = useEditChild();

  const form = useForm<EditChildFormData>({
    resolver: zodResolver(editChildSchema),
    defaultValues: {
      id: "",
      familyId: "",
      groupId: undefined,
      previousGroupId: null,
      name: "",
      gender: "",
      birthDate: "",
      pamphletUrl: "",
      childPhotoUrl: "",
      notes: "",
    },
  });

  // Actualizar el formulario cuando cambie el niño a editar
  useEffect(() => {
    if (childToEdit) {
      // Convertir la fecha a formato YYYY-MM-DD para el input type="date"
      const birthDateStr =
        childToEdit.birth_date instanceof Date
          ? childToEdit.birth_date.toISOString().split("T")[0]
          : new Date(childToEdit.birth_date).toISOString().split("T")[0];

      form.reset({
        id: childToEdit.id,
        familyId: childToEdit.family_id || "",
        groupId: childToEdit.group_id ?? undefined,
        previousGroupId: childToEdit.group_id,
        name: childToEdit.name,
        gender: childToEdit.gender,
        birthDate: birthDateStr,
        pamphletUrl: childToEdit.pamphlet_url || "",
        childPhotoUrl: childToEdit.child_photo_url || "",
        notes: childToEdit.notes ?? "",
      });
    }
  }, [childToEdit, form]);

  async function onSubmit(data: EditChildFormData) {
    const toastId = toast.loading("Actualizando niño/niña...");
    setLoading(true);

    try {
      const result = await editChildAction({
        ...data,
        notes: form.getFieldState("notes").isDirty ? data.notes : undefined,
      });

      if (result?.serverError) {
        toast.error(result.serverError, { id: toastId });
        return;
      }

      if (!result?.data) {
        toast.error("Revisa los datos e inténtalo de nuevo.", { id: toastId });
        return;
      }

      toast.success("Niño/Niña actualizado exitosamente", { id: toastId });
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
