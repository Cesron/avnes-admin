"use server";

import { actionClient } from "@/lib/safe-action";
import { sql } from "@/lib/sql";
import { CustomError } from "@/utils/custom-error";
import { revalidatePath } from "next/cache";
import { editActivitySchema } from "./edit-activity.schema";

export const editActivityAction = actionClient
  .inputSchema(editActivitySchema)
  .action(
    async ({
      parsedInput: {
        id,
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

      // Verify activity exists
      const activityExists = await sql.query(
        `SELECT id, is_recurring FROM activities WHERE id = $1`,
        [id],
      );

      if (activityExists.rows.length === 0) {
        throw CustomError.notFound("La actividad no existe");
      }

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

      // Update the activity
      await sql.query(
        `UPDATE activities 
         SET name = $1, description = $2, is_recurring = $3, updated_at = NOW() 
         WHERE id = $4`,
        [trimmedName, description || null, isRecurring, id],
      );

      // Delete existing activity_groups and recreate
      await sql.query(`DELETE FROM activity_groups WHERE activity_id = $1`, [
        id,
      ]);

      for (const groupId of groupIds) {
        await sql.query(
          `INSERT INTO activity_groups (activity_id, group_id) VALUES ($1, $2)`,
          [id, groupId],
        );
      }

      // Handle recurrence changes
      const wasRecurring = activityExists.rows[0].is_recurring;

      if (isRecurring) {
        if (wasRecurring) {
          // Update existing recurrence
          await sql.query(
            `UPDATE activity_recurrences 
             SET frequency = $1, interval = $2, days_of_week = $3, 
                 start_date = $4, end_date = $5, start_time = $6, end_time = $7,
                 updated_at = NOW()
             WHERE activity_id = $8`,
            [
              frequency,
              interval || 1,
              daysOfWeek?.join(",") || null,
              startDate,
              endDate || null,
              startTime,
              endTime,
              id,
            ],
          );
        } else {
          // Create new recurrence
          await sql.query(
            `INSERT INTO activity_recurrences (
              activity_id, frequency, interval, days_of_week, 
              start_date, end_date, start_time, end_time
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              id,
              frequency,
              interval || 1,
              daysOfWeek?.join(",") || null,
              startDate,
              endDate || null,
              startTime,
              endTime,
            ],
          );
          // Delete any existing occurrences since it's now recurring
          await sql.query(
            `DELETE FROM activity_occurrences WHERE activity_id = $1`,
            [id],
          );
        }
      } else {
        if (wasRecurring) {
          // Delete recurrence since it's no longer recurring
          await sql.query(
            `DELETE FROM activity_recurrences WHERE activity_id = $1`,
            [id],
          );
        }

        // Update or create single occurrence
        const startDatetime = `${singleDate} ${singleStartTime}`;
        const endDatetime = `${singleDate} ${singleEndTime}`;

        // Delete existing occurrences and create new one
        await sql.query(
          `DELETE FROM activity_occurrences WHERE activity_id = $1`,
          [id],
        );

        await sql.query(
          `INSERT INTO activity_occurrences (
            activity_id, start_datetime, end_datetime, status
          ) VALUES ($1, $2, $3, $4)`,
          [id, startDatetime, endDatetime, "scheduled"],
        );
      }

      revalidatePath("/activities");

      return { activityId: id };
    },
  );
