import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlusCircleIcon } from "lucide-react";
import { CreateFamilyForm } from "./create-family-form";
import { getNextPenpalCode } from "@/services/families/get-next-penpal-code";

export async function FamiliesHeader() {
  const suggestedPenpalCode = await getNextPenpalCode();

  return (
    <header className="flex flex-wrap gap-3 min-h-20 py-4 shrink-0 items-center transition-all ease-linear border-b">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <div className="max-lg:hidden lg:contents">
          <Separator
            orientation="vertical"
            className="me-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Familias</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircleIcon />
            Agregar Familia
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Familia</DialogTitle>
            <DialogDescription>
              Ingresa los datos de la nueva familia.
            </DialogDescription>
          </DialogHeader>

          <CreateFamilyForm suggestedPenpalCode={suggestedPenpalCode} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
