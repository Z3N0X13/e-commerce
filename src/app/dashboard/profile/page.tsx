import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { ProfileClient } from "./profile-client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <ProfileClient session={session} />;
}
