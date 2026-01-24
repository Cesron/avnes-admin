export type Activity = {
  id: string;
  name: string;
  description: string | null;
  is_recurring: boolean;
  created_at: Date;
  updated_at: Date;
};

export type ActivityRecurrence = {
  id: string;
  activity_id: string;
  frequency: string;
  interval: number;
  days_of_week: string | null;
  start_date: Date;
  end_date: Date | null;
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
};

export type ActivityOccurrence = {
  id: string;
  activity_id: string;
  start_datetime: Date;
  end_datetime: Date;
  status: string;
  created_at: Date;
};
