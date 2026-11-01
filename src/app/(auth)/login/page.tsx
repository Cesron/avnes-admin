import Image from "next/image";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt="Asociación Vida Nueva en El Salvador"
            width={88}
            height={88}
            priority
            className="mb-2 rounded-full"
          />
          <h1 className="text-xl font-bold">
            Asociación Vida Nueva en El Salvador
          </h1>
          <p className="text-muted-foreground text-sm leading-normal font-normal">
            Inicia sesión para continuar a tu cuenta
          </p>
        </div>

        <LoginForm />
        <div className="mt-6">
          <InstallAppButton />
        </div>
      </div>
    </div>
  );
}
