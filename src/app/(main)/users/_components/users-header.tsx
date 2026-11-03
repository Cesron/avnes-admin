"use client";

import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateUserForm } from "./create-user-form";

type MentorOption = { id: string; name: string };

interface UsersHeaderProps {
  mentorsOptions: MentorOption[];
}

export function UsersHeader({ mentorsOptions }: UsersHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center border-b">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <h1 className="text-xl font-semibold lg:sr-only">Usuarios</h1>
        <div className="max-lg:hidden lg:contents">
          <Separator
            orientation="vertical"
            className="me-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircleIcon />
            Agregar Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo usuario. Si el rol es Mentora, deberás
              vincularlo a una mentora existente.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            mentorsOptions={mentorsOptions}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}
