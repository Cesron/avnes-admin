"use client";

import { EditIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EditButton(props: ComponentProps<typeof Button>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar"
          {...props}
        >
          <EditIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Editar</TooltipContent>
    </Tooltip>
  );
}
