export type UserRole = "admin" | "coordinator" | "mentor";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole | null;
  createdAt: Date;
  updatedAt: Date;
};
