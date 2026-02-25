import type { UserRole } from "@/types/user";

/**
 * Routes each role is allowed to access.
 * Admin has access to everything, so it's not listed here.
 */
const roleRoutes: Record<Exclude<UserRole, "admin">, string[]> = {
  coordinator: [
    "/dashboard",
    "/families",
    "/children",
    "/groups",
    "/activities",
    "/attendance",
    "/mentors",
  ],
  mentor: ["/dashboard", "/children", "/attendance"],
};

/**
 * Check if a given role has access to a specific pathname.
 * Admin always has access. For other roles, the pathname must
 * start with one of the allowed routes.
 */
export function hasAccess(role: UserRole | null, pathname: string): boolean {
  // No role assigned — deny access
  if (!role) return false;

  // Admin has unrestricted access
  if (role === "admin") return true;

  const allowed = roleRoutes[role];
  if (!allowed) return false;

  return allowed.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

/**
 * Get the list of allowed routes for a role (used for sidebar filtering).
 * Admin returns null (meaning all routes are allowed).
 */
export function getAllowedRoutes(role: UserRole | null): string[] | null {
  if (!role) return [];
  if (role === "admin") return null; // null = all allowed
  return roleRoutes[role] ?? [];
}
