import { GalleryVerticalEndIcon } from "lucide-react";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEndIcon className="size-6" />
            </div>
            <span className="sr-only">
              Asociación Vida Nueva en El Salvador
            </span>
          </div>
          <h1 className="text-xl font-bold">
            Asociación Vida Nueva en El Salvador
          </h1>
          <p className="text-muted-foreground text-sm leading-normal font-normal">
            Inicia sesión para continuar a tu cuenta
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
