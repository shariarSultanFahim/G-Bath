import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Verify the user actually exists in the active database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.status === "SUSPENDED") {
    return null;
  }

  return session.user;
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
