import { sql } from "@/lib/sql";
import type { User } from "@/types/user";

export type UserWithMentor = User & {
  mentor_name: string | null;
};

export async function getUsers(): Promise<UserWithMentor[]> {
  const result = await sql.query<UserWithMentor>(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u."emailVerified", 
        u.image, 
        u.role,  
        u."createdAt", 
        u."updatedAt",
        m.name AS mentor_name
      FROM "user" u
      LEFT JOIN mentors m ON m.user_id = u.id
      ORDER BY u.name ASC
    `);

  return result.rows;
}
