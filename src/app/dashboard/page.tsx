import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { DashboardClient } from "./dashboard-client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardClient session={session} />;
}