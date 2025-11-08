import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditClub } from "../_context/edit-club-context";
import { editClubAction } from "../_lib/edit-club.action";
import { EditClubFormData, editClubSchema } from "../_lib/edit-club.schema";

export function useEditClubForm() {
  const [loading, setLoading] = useState(false);
  const { clubToEdit, closeEditDialog } = useEditClub();

  const form = useForm<EditClubFormData>({
    resolver: zodResolver(editClubSchema),
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  // Actualizar el formulario cuando cambie el club a editar
  useEffect(() => {
    if (clubToEdit) {
      form.reset({
        id: clubToEdit.id,
        name: clubToEdit.name,
      });
    }
  }, [clubToEdit, form]);

  async function onSubmit(data: EditClubFormData) {
    const toastId = toast.loading("Actualizando club...");
    setLoading(true);

    const { serverError } = await editClubAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Club actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
