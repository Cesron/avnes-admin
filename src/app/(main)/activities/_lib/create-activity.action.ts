"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { generateOccurrences } from "@/utils/generate-occurrences";
import { revalidatePath } from "next/cache";
import { createActivitySchema } from "./create-activity.schema";

export const createActivityAction = actionClient
  .inputSchema(createActivitySchema)
  .action(
    async ({
      parsedInput: {
        name,
        description,
        groupIds,
        isRecurring,
        singleDate,
        singleStartTime,
        singleEndTime,
        frequency,
        interval,
        daysOfWeek,
        startDate,
        endDate,
        startTime,
        endTime,
      },
    }) => {
      const trimmedName = name.trim();

      // Verify all groups exist
      for (const groupId of groupIds) {
        const groupExists = await sql.query(
          `SELECT id FROM groups WHERE id = $1`,
          [groupId],
        );

        if (groupExists.rows.length === 0) {
          throw CustomError.badRequest(
            `El grupo seleccionado no existe: ${groupId}`,
          );
        }
      }

      // Create the activity
      const activityResult = await sql.query(
        `INSERT INTO activities (name, description, is_recurring) 
         VALUES ($1, $2, $3) 
         RETURNING id`,
        [trimmedName, description || null, isRecurring],
      );

      const activityId = activityResult.rows[0].id;

      // Create activity_groups relationships
      for (const groupId of groupIds) {
        await sql.query(
          `INSERT INTO activity_groups (activity_id, group_id) VALUES ($1, $2)`,
          [activityId, groupId],
        );
      }

      if (isRecurring) {
        // Create the recurrence record
        await sql.query(
          `INSERT INTO activity_recurrences (
            activity_id, 
            frequency, 
            interval, 
            days_of_week, 
            start_date, 
            end_date,
            start_time,
            end_time
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            frequency,
            interval || 1,
            daysOfWeek?.join(",") || null,
            startDate,
            endDate,
            startTime,
            endTime,
          ],
        );

        // Pre-generate all occurrences from start_date to end_date
        const occurrences = generateOccurrences({
          frequency: frequency!,
          interval: interval || 1,
          daysOfWeek: daysOfWeek || null,
          startDate: startDate!,
          endDate: endDate!,
          startTime: startTime!,
          endTime: endTime!,
        });

        if (occurrences.length > 0) {
          // Bulk insert all occurrences
          const values = occurrences
            .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3}, 'scheduled')`)
            .join(", ");

          const params: string[] = [activityId];
          for (const occ of occurrences) {
            params.push(occ.startDatetime, occ.endDatetime);
          }

          await sql.query(
            `INSERT INTO activity_occurrences (activity_id, start_datetime, end_datetime, status)
             VALUES ${values}`,
            params,
          );
        }
      } else {
        // Create a single occurrence for non-recurring activity
        const startDatetime = `${singleDate} ${singleStartTime}`;
        const endDatetime = `${singleDate} ${singleEndTime}`;

        await sql.query(
          `INSERT INTO activity_occurrences (
            activity_id, 
            start_datetime, 
            end_datetime, 
            status
          ) VALUES ($1, $2, $3, $4)`,
          [activityId, startDatetime, endDatetime, "scheduled"],
        );
      }

      revalidatePath("/activities");

      return { activityId };
    },
  );
