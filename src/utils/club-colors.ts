type BadgeVariant =
  | "blue-subtle"
  | "green-subtle"
  | "purple-subtle"
  | "pink-subtle";

const CLUB_BADGE_MAP: Record<string, BadgeVariant> = {
  Jouse: "blue-subtle",
  Samuel: "green-subtle",
  "Moises Parvulos": "purple-subtle",
  "Moises Maternal": "pink-subtle",
};

const CLUB_DOT_COLOR_MAP: Record<string, string> = {
  Jouse: "bg-blue-500",
  Samuel: "bg-green-500",
  "Moises Parvulos": "bg-purple-500",
  "Moises Maternal": "bg-pink-500",
};

const CLUB_TEXT_COLOR_MAP: Record<string, string> = {
  Jouse: "text-blue-500",
  Samuel: "text-green-500",
  "Moises Parvulos": "text-purple-500",
  "Moises Maternal": "text-pink-500",
};

export function getClubBadgeVariant(clubName: string): BadgeVariant {
  return CLUB_BADGE_MAP[clubName] ?? "blue-subtle";
}

export function getClubDotColor(clubName: string): string {
  return CLUB_DOT_COLOR_MAP[clubName] ?? "bg-blue-500";
}

export function getClubTextColor(clubName: string): string {
  return CLUB_TEXT_COLOR_MAP[clubName] ?? "text-blue-500";
}
