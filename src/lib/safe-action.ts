import { CustomError } from "@/utils/custom-error";
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof CustomError) {
      return e.message;
    }

    return "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.";
  },
  throwValidationErrors: false,
});
