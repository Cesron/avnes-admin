"use server";

import { actionClient } from "@/lib/safe-action";
import { createOccurrence } from "@/services/attendance/create-occurrence";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createOccurrenceSchema = z.object({
  activityId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createOccurrenceAction = actionClient
  .inputSchema(createOccurrenceSchema)
  .action(async ({ parsedInput: { activityId, date } }) => {
    const occurrenceId = await createOccurrence({ activityId, date });

    revalidatePath("/attendance");

    return { occurrenceId };
  });
