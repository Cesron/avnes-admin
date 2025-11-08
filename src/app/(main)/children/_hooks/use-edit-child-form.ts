import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditChild } from "../_context/edit-child-context";
import { editChildAction } from "../_lib/edit-child.action";
import { EditChildFormData, editChildSchema } from "../_lib/edit-child.schema";

export function useEditChildForm() {
  const [loading, setLoading] = useState(false);
  const { childToEdit, closeEditDialog } = useEditChild();

  const form = useForm<EditChildFormData>({
    resolver: zodResolver(editChildSchema),
    defaultValues: {
      id: 0,
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
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
        firstName: childToEdit.first_name,
        lastName: childToEdit.last_name,
        gender: childToEdit.gender,
        birthDate: birthDateStr,
      });
    }
  }, [childToEdit, form]);

  async function onSubmit(data: EditChildFormData) {
    const toastId = toast.loading("Actualizando niño/niña...");
    setLoading(true);

    const { serverError } = await editChildAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Niño/Niña actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
