import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { sql } from "./sql";
import type { UserRole } from "@/types/user";
import { hasAccess } from "./permissions";

export async function verifySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Verify that the current user has access to the given pathname.
 * Redirects to /dashboard if the user lacks permission.
 */
export async function authorize(pathname: string) {
  const session = await verifySession();
  const role = (session.user.role as UserRole) || null;

  if (!hasAccess(role, pathname)) {
    redirect("/dashboard");
  }

  return session;
}

export type SessionUserInfo = {
  userId: string;
  role: UserRole | null;
  mentorId: string | null;
  groupIds: string[];
};

/**
 * Returns the current user's role, linked mentor ID, and their group IDs.
 * Useful for role-based filtering (e.g., attendance).
 */
export async function getSessionUserInfo(): Promise<SessionUserInfo> {
  const session = await verifySession();
  const userId = session.user.id;
  const role = (session.user.role as UserRole) || null;

  let mentorId: string | null = null;
  let groupIds: string[] = [];

  if (role === "mentor") {
    // Find linked mentor
    const mentorResult = await sql.query<{ id: string }>(
      `SELECT id FROM mentors WHERE user_id = $1`,
      [userId],
    );

    if (mentorResult.rows.length > 0) {
      mentorId = mentorResult.rows[0].id;

      // Get groups assigned to this mentor
      const groupsResult = await sql.query<{ id: string }>(
        `SELECT id FROM groups WHERE mentor_id = $1`,
        [mentorId],
      );

      groupIds = groupsResult.rows.map((g) => g.id);
    }
  }

  return { userId, role, mentorId, groupIds };
}
