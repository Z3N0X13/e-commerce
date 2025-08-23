"use client";

import { toast } from "sonner";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/global/TopBar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/global/Footer";
import { Separator } from "@/components/ui/separator";
import { AnimatedButton } from "@/components/global/AnimatedButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileClientProps {
  session: Session;
}

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    joinDate: string;
  };
  stats: {
    orders: number;
    completedOrders: number;
    cartItems: number;
    joinYear: string;
  };
}

export function ProfileClient({ session }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    name: session.user?.name || "",
    email: session.user?.email || "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
          setFormData({
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          toast.error("Erreur lors du chargement du profil");
        }
      } catch (error) {
        toast.error("Erreur de connexion");
        console.error("Server error: " + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setProfileData((prev) =>
          prev
            ? {
                ...prev,
                user: {
                  ...prev.user,
                  name: result.user.name,
                  email: result.user.email,
                },
              }
            : null
        );
        toast.success("Profil mis à jour avec succès !");
        setIsEditing(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Server error: " + (error as Error).message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData?.user.name || session.user?.name || "",
      email: profileData?.user.email || session.user?.email || "",
    });
    setIsEditing(false);
  };

  const stats = [
    {
      label: "Commandes",
      value: profileData?.stats.orders.toString() || "0",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Articles en panier",
      value: profileData?.stats.cartItems.toString() || "0",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      label: "Membre depuis",
      value: profileData?.stats.joinYear || "2025",
      icon: Calendar,
      color: "bg-green-500",
    },
  ];

  const quickActions = [
    {
      title: "Mes Commandes",
      description: "Consultez l'historique de vos commandes",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      color: "bg-blue-500",
    },
    {
      title: "Mes Favoris",
      description: "Retrouvez vos produits favoris",
      icon: Heart,
      href: "/dashboard/favorites",
      color: "bg-red-500",
    },
    {
      title: "Paramètres",
      description: "Gérez vos préférences",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-purple-500",
    },
  ];

  if (isLoading) {
    return (
      <>
        <TopBar />
              <div className="min-h-screen bg-gray-100 dark:bg-black/30 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement du profil...</p>
        </div>
      </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gray-100 dark:bg-black/30 pt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Mon Profil
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations Personnelles
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" />
                        Sauvegarder
                      </Button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nom complet
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Votre nom"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profileData?.user.name || session.user?.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="votre@email.com"
                          type="email"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profileData?.user.email || session.user?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Membre depuis
                    </label>
                    <p className="text-gray-600 dark:text-gray-400">
                      {profileData?.user.joinDate || "Janvier 2024"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Vos Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div
                          className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mx-auto mb-3`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <a
                        key={index}
                        href={action.href}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md hover:scale-105 hover:-translate-y-1 transform"
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-3`}
                        >
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {profileData?.user.name || session.user?.name}
                    </h3>
                    <Badge variant="secondary" className="mb-4">
                      <Shield className="w-3 h-3 mr-1" />
                      Membre Premium
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Client fidèle depuis{" "}
                      {profileData?.stats.joinYear || "2024"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">
                        Compte sécurisé
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Actif
                    </Badge>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard/settings"}>
                    <Shield className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-red-200 dark:border-red-700">
                <CardContent className="pt-6">
                  <AnimatedButton
                    baseColor="bg-red-600"
                    hoverColor="hover:bg-red-700"
                    className="w-full dark:text-white"
                    onClick={() => (window.location.href = "/logout")}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </AnimatedButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
