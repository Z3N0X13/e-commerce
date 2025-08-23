import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SettingsClient } from "./settings-client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <SettingsClient session={session} />;
}