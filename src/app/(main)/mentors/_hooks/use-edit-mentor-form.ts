import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEditMentor } from "../_context/edit-mentor-context";
import { editMentorAction } from "../_lib/edit-mentor.action";
import {
  EditMentorFormData,
  editMentorSchema,
} from "../_lib/edit-mentor.schema";

export function useEditMentorForm() {
  const [loading, setLoading] = useState(false);
  const { mentorToEdit, closeEditDialog } = useEditMentor();

  const form = useForm<EditMentorFormData>({
    resolver: zodResolver(editMentorSchema),
    defaultValues: {
      id: 0,
      name: "",
      phone: "",
      email: "",
    },
  });

  // Actualizar el formulario cuando cambie el mentor a editar
  useEffect(() => {
    if (mentorToEdit) {
      form.reset({
        id: mentorToEdit.id,
        name: mentorToEdit.name,
        phone: mentorToEdit.phone || "",
        email: mentorToEdit.email || "",
      });
    }
  }, [mentorToEdit, form]);

  async function onSubmit(data: EditMentorFormData) {
    const toastId = toast.loading("Actualizando mentor...");
    setLoading(true);

    const { serverError } = await editMentorAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Mentor actualizado exitosamente", { id: toastId });
    setLoading(false);
    closeEditDialog();
  }

  return { form, onSubmit, loading };
}
