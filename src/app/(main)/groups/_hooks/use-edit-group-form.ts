import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditGroup } from "../_context/edit-group-context";
import { editGroupAction } from "../_lib/edit-group.action";
import { EditGroupFormData, editGroupSchema } from "../_lib/edit-group.schema";

export function useEditGroupForm() {
  const [loading, setLoading] = useState(false);
  const { groupToEdit, closeEditDialog } = useEditGroup();

  const form = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      id: 0,
      name: "",
      clubId: "",
      mentorId: "",
    },
  });

  // Actualizar el formulario cuando cambie el grupo a editar
  useEffect(() => {
    if (groupToEdit) {
      form.reset({
        id: groupToEdit.id,
        name: groupToEdit.name,
        clubId: groupToEdit.club_id.toString(),
        mentorId: groupToEdit.mentor_id.toString(),
      });
    }
  }, [groupToEdit, form]);

  async function onSubmit(data: EditGroupFormData) {
    const toastId = toast.loading("Actualizando grupo...");
    setLoading(true);

    const { serverError } = await editGroupAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Grupo actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
