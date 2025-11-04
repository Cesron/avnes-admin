import { sql } from "@/lib/sql";
import type { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  const result = await sql.query<User>(`
      SELECT 
        id, 
        name, 
        email, 
        "emailVerified", 
        image, 
        role,  
        "createdAt", 
        "updatedAt"
      FROM "user"
      ORDER BY "createdAt" DESC
    `);

  return result.rows;
}
