import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "../_lib/login.action";
import { LoginFormData, loginSchema } from "../_lib/login.schema";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "cesronvasquez@gmail.com",
      password: "holamundo",
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormData) {
    const toastId = toast.loading("Iniciando sesión...");
    setLoading(true);

    const { serverError } = await loginAction(data);

    if (serverError) {
      toast.error(serverError, { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Inicio de sesión exitoso", { id: toastId });
    setLoading(false);

    router.push("/dashboard");
  }

  return { form, onSubmit, showPassword, setShowPassword, loading };
}
