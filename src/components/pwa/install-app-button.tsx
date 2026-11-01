"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { usePwa } from "./pwa-provider";

export function InstallAppButton({ sidebar = false }: { sidebar?: boolean }) {
  const { available, isIOS, install } = usePwa();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (!available) return null;

  async function handleInstall() {
    setPending(true);
    try {
      const result = await install();
      if (result === "manual") setOpen(true);
    } finally {
      setPending(false);
    }
  }

  const label = (
    <>
      <DownloadIcon aria-hidden="true" />
      <span>{pending ? "Abriendo instalación…" : "Instalar aplicación"}</span>
    </>
  );

  return (
    <>
      {sidebar ? (
        <SidebarMenuButton
          tooltip="Instalar aplicación"
          onClick={handleInstall}
          disabled={pending}
        >
          {label}
        </SidebarMenuButton>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleInstall}
          disabled={pending}
        >
          {label}
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar AVNES</DialogTitle>
            <DialogDescription>
              Abre el panel desde el icono de tu dispositivo. Necesitas conexión
              a internet para usarlo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {isIOS ? (
              <section className="space-y-2">
                <h3 className="font-medium">En iPhone o iPad</h3>
                <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
                  <li>Abre este sitio en Safari y toca Compartir.</li>
                  <li>Selecciona «Agregar a pantalla de inicio».</li>
                  <li>
                    Si aparece «Abrir como app», actívalo. Toca «Agregar» y abre
                    AVNES desde el nuevo icono.
                  </li>
                </ol>
              </section>
            ) : (
              <>
                <section className="space-y-2">
                  <h3 className="font-medium">En Android</h3>
                  <p className="text-muted-foreground">
                    Abre este sitio en Chrome. En el menú ⋮, selecciona
                    «Instalar aplicación» o «Agregar a pantalla principal» y
                    confirma la instalación.
                  </p>
                </section>
                <section className="space-y-2">
                  <h3 className="font-medium">En computadora</h3>
                  <p className="text-muted-foreground">
                    En Chrome o Edge, busca el icono de instalación en la barra
                    de direcciones o la opción «Instalar» en el menú del
                    navegador.
                  </p>
                </section>
              </>
            )}
            <p className="text-muted-foreground">
              Si la opción no aparece, verifica que estés en la dirección HTTPS
              del panel. También es posible que la aplicación ya esté instalada
              o que tu navegador no permita instalarla.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
