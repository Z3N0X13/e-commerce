import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Pour l'instant, retourner des paramètres par défaut
    // Plus tard, vous pourriez créer une table Settings dans la base de données
    const defaultSettings = {
      // Notifications
      emailNotifications: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true,
      
      // Sécurité
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: "30",
      
      // Apparence
      theme: "light",
      compactMode: false,
      animations: true,
      
      // Préférences
      language: "fr",
      currency: "EUR",
      timezone: "Europe/Paris",
      
      // Confidentialité
      profileVisibility: "public",
      dataSharing: false,
      analytics: true,
    };

    return NextResponse.json(defaultSettings, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
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

    const settings = await req.json();

    // Ici vous pourriez sauvegarder les paramètres dans la base de données
    // Pour l'instant, on simule juste la sauvegarde
    
    // Exemple de sauvegarde dans une table Settings (à créer plus tard)
    // await prisma.userSettings.upsert({
    //   where: { userId: user.id },
    //   update: settings,
    //   create: { userId: user.id, ...settings }
    // });

    return NextResponse.json(
      { message: "Paramètres sauvegardés avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
