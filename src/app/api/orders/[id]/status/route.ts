import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    if (
      !status ||
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        status
      )
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const resolvedParams = await params;
    const dbId = Number(resolvedParams.id);
    if (Number.isNaN(dbId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const now = new Date();
    const data: {
      status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
      shippedAt?: Date;
      deliveredAt?: Date;
      cancelledAt?: Date;
    } = {
      status: status as
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled",
    };
    if (status === "shipped") data.shippedAt = now;
    if (status === "delivered") data.deliveredAt = now;
    if (status === "cancelled") data.cancelledAt = now;

    const updated = await prisma.order.update({
      where: { id: dbId },
      data,
      include: { items: true },
    });

    return NextResponse.json(
      { ok: true, id: updated.id, status: updated.status },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
