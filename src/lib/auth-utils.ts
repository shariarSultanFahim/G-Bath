import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowedRole: Role) {
  const user = await requireUser();
  const userRole = (user as unknown as { role: Role }).role;
  if (userRole !== allowedRole) {
    if (userRole === Role.ADMIN) redirect("/admin");
    else redirect("/");
  }
  return user;
}
