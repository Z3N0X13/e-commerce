import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
        CartItem: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const orderCount = user.Order.length;
    const completedOrders = user.Order.filter(order => order.status === 'delivered').length;
    const cartItemsCount = user.CartItem.length;
    
    const joinDate = new Date(user.createdAt);
    const joinYear = joinDate.getFullYear();
    const joinMonth = joinDate.toLocaleDateString('fr-FR', { month: 'long' });

    const profileData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        joinDate: `${joinMonth} ${joinYear}`,
      },
      stats: {
        orders: orderCount,
        completedOrders,
        cartItems: cartItemsCount,
        joinYear: joinYear.toString(),
      },
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nom et email requis" },
        { status: 400 }
      );
    }

    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(
      { 
        message: "Profil mis à jour avec succès",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
