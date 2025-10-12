import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "admin-secret-key";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, JWT_SECRET) as AdminUser;

    // Allow both admin and root roles
    if (decoded.role !== "admin" && decoded.role !== "root") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  return admin;
}

export async function requireRoot(): Promise<AdminUser> {
  const admin = await getAdminUser();

  if (!admin || admin.role !== "root") {
    throw new Error("Unauthorized - Root access required");
  }

  return admin;
}

export function isRoot(user: AdminUser | null): boolean {
  return user?.role === "root";
}

export function canDelete(user: AdminUser | null): boolean {
  return user?.role === "root";
}
