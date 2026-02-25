import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditUser } from "../_context/edit-user-context";
import { editUserAction } from "../_lib/edit-user.action";
import {
  type EditUserFormData,
  editUserSchema,
} from "../_lib/edit-user.schema";

export function useEditUserForm() {
  const [loading, setLoading] = useState(false);
  const { userToEdit, closeEditDialog } = useEditUser();

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema) as never,
    defaultValues: {
      id: "",
      name: "",
      role: undefined,
      mentorId: undefined,
    },
  });

  useEffect(() => {
    if (userToEdit) {
      form.reset({
        id: userToEdit.id,
        name: userToEdit.name,
        role: userToEdit.role ?? undefined,
        mentorId: userToEdit.mentor_id ?? undefined,
      });
    }
  }, [userToEdit, form]);

  async function onSubmit(data: EditUserFormData) {
    const toastId = toast.loading("Actualizando usuario...");
    setLoading(true);

    const { serverError } = await editUserAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Usuario actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
