import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

type OrderItemInput = {
  productId: number;
  title: string;
  imageUrl: string;
  quantity: number;
  price: number;
};

type CreateOrderBody = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  nameOnCard?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
  rememberMe?: boolean;
  useShippingAsBilling?: boolean;
  shippingPrice: number;
  subtotal: number;
  total: number;
  items: OrderItemInput[];
};

type DeleteOrderBody = {
  orderId: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderBody;

    const requiredFields: Array<keyof CreateOrderBody> = [
      "email",
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "country",
      "paymentMethod",
      "shippingPrice",
      "subtotal",
      "total",
      "items",
    ];

    for (const field of requiredFields) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (body as any)[field] === undefined ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (body as any)[field] === null ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (body as any)[field] === ""
      ) {
        return NextResponse.json(
          { error: `Missing field: ${String(field)}` },
          { status: 400 }
        );
      }
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (user) userId = user.id;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        apartment: body.apartment ?? null,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        paymentMethod: body.paymentMethod,
        nameOnCard: body.nameOnCard ?? null,
        cardNumber: body.cardNumber ?? null,
        expiry: body.expiry ?? null,
        cvc: body.cvc ?? null,
        rememberMe: Boolean(body.rememberMe),
        useShippingAsBilling: Boolean(body.useShippingAsBilling),
        status: 'processing',
        shippingPrice: body.shippingPrice,
        subtotal: body.subtotal,
        total: body.total,
        items: {
          create: body.items.map((it) => ({
            productId: it.productId,
            title: it.title,
            imageUrl: it.imageUrl,
            quantity: it.quantity,
            price: it.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const rows = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    const orders = rows.map((o) => ({
      id: `ORD-${String(o.id).padStart(6, "0")}`,
      dbId: o.id,
      date: o.createdAt.toISOString(),
      total: o.total,
      status: o.status ?? 'processing',
      shippedAt: o.shippedAt ? o.shippedAt.toISOString() : null,
      deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
      cancelledAt: o.cancelledAt ? o.cancelledAt.toISOString() : null,
      items: o.items.map((it) => ({
        title: it.title,
        imageUrl: it.imageUrl,
        quantity: it.quantity,
        price: it.price,
      })),
    }));

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 },
      );
    };

    const body: DeleteOrderBody = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid orderId" },
        { status: 400 },
      );
    };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    };

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { error: "Order not found or not authorized" },
        { status: 404 },
      );
    };

    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json(
      { ok: true, message: "Order deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + (error as Error).message },
      { status: 500 },
    );
  };
};