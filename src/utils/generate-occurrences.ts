type GenerateOccurrencesParams = {
  frequency: string;
  interval: number;
  daysOfWeek: string[] | null;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
};

type OccurrenceDatePair = {
  startDatetime: string;
  endDatetime: string;
};

const DAY_NAME_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generates all occurrence date pairs based on recurrence rules.
 * Used when creating or editing recurring activities to pre-generate
 * all occurrences upfront.
 */
export function generateOccurrences(
  params: GenerateOccurrencesParams,
): OccurrenceDatePair[] {
  const {
    frequency,
    interval,
    daysOfWeek,
    startDate,
    endDate,
    startTime,
    endTime,
  } = params;

  const occurrences: OccurrenceDatePair[] = [];

  // Parse dates using local components to avoid timezone issues
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  if (frequency === "daily") {
    const current = new Date(start);
    while (current <= end) {
      const dateStr = formatDate(current);
      occurrences.push({
        startDatetime: `${dateStr} ${startTime}`,
        endDatetime: `${dateStr} ${endTime}`,
      });
      current.setDate(current.getDate() + interval);
    }
  } else if (frequency === "weekly") {
    const targetDays = new Set(
      (daysOfWeek || [])
        .map((d) => DAY_NAME_TO_INDEX[d])
        .filter((d) => d !== undefined),
    );

    // Find Monday of the start date's week
    const weekStart = new Date(start);
    const dayOfWeek = weekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + mondayOffset);

    let weekNumber = 0;

    while (weekStart <= end) {
      if (weekNumber % interval === 0) {
        // This is an active week
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + dayOffset);

          if (date < start || date > end) continue;
          if (targetDays.has(date.getDay())) {
            const dateStr = formatDate(date);
            occurrences.push({
              startDatetime: `${dateStr} ${startTime}`,
              endDatetime: `${dateStr} ${endTime}`,
            });
          }
        }
      }

      weekStart.setDate(weekStart.getDate() + 7);
      weekNumber++;
    }
  } else if (frequency === "monthly") {
    const targetDay = start.getDate();
    const current = new Date(start);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      if (targetDay <= daysInMonth) {
        const date = new Date(year, month, targetDay);
        if (date >= start && date <= end) {
          const dateStr = formatDate(date);
          occurrences.push({
            startDatetime: `${dateStr} ${startTime}`,
            endDatetime: `${dateStr} ${endTime}`,
          });
        }
      }

      current.setMonth(current.getMonth() + interval);
    }
  }

  return occurrences;
}
