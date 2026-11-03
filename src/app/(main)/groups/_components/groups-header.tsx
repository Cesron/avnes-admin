import { PlusCircleIcon } from "lucide-react";
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
import { getClubsOptions } from "@/services/clubs/get-clubs-options";
import { getMentorsOptions } from "@/services/mentors/get-mentors-options";
import { CreateGroupForm } from "./create-group-form";

export async function GroupsHeader() {
  const [clubs, mentors] = await Promise.all([
    getClubsOptions(),
    getMentorsOptions(),
  ]);

  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center border-b">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <h1 className="text-xl font-semibold lg:sr-only">Grupos</h1>
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
                <BreadcrumbPage>Grupos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircleIcon />
            Agregar Grupo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Grupo</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo grupo. Debes seleccionar un club y una
              mentora.
            </DialogDescription>
          </DialogHeader>

          <CreateGroupForm clubs={clubs} mentors={mentors} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
