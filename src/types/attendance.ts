export type AttendanceStatus = "present" | "absent" | "excused";

export type Attendance = {
  id: string;
  child_id: string;
  activity_occurrence_id: string;
  status: AttendanceStatus;
  notes: string | null;
  marked_at: Date;
};

// For the attendance list page - activities available today
export type TodayActivity = {
  activity_id: string;
  activity_name: string;
  is_recurring: boolean;
  group_id: string;
  group_name: string;
  club_id: string;
  club_name: string;
  start_time: string;
  end_time: string;
  // If non-recurring, this will be the existing occurrence id
  occurrence_id: string | null;
  // For recurring activities, indicates if occurrence already exists for today
  has_occurrence_today: boolean;
};

// For the weekly attendance view - pre-generated occurrences
export type WeekOccurrence = {
  occurrence_id: string;
  activity_id: string;
  activity_name: string;
  is_recurring: boolean;
  start_datetime: string;
  end_datetime: string;
  status: string;
  group_names: string;
  club_names: string;
  attendance_count: number;
};

// For the attendance marking page
export type ChildAttendance = {
  child_id: string;
  child_name: string;
  child_gender: string;
  child_birth_date: Date;
  group_id: string;
  group_name: string;
  attendance_id: string | null;
  attendance_status: AttendanceStatus | null;
};

export type OccurrenceDetail = {
  occurrence_id: string;
  activity_id: string;
  activity_name: string;
  activity_description: string | null;
  start_datetime: Date;
  end_datetime: Date;
  status: string;
  groups: { id: string; name: string; club_name: string }[];
};
