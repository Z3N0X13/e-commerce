"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Session } from "next-auth";
import { Shield, Globe, Monitor, User, Settings } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/app/context/currency-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreferencesSidebarProps {
  session: Session;
  settings: {
    language: string;
    currency: string;
    timezone: string;
    profileVisibility: string;
    dataSharing: boolean;
    analytics: boolean;
  };
  onSettingChange: (key: string, value: boolean | string) => void;
}

export function PreferencesSidebar({
  session,
  settings,
  onSettingChange,
}: PreferencesSidebarProps) {
  const { currency, setCurrency } = useCurrency();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingChange = async (key: string, value: boolean | string) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/preferences', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: session.user?.id,
      //     [key]: value
      //   })
      // });

      onSettingChange(key, value);

      if (typeof value === "boolean") {
        toast.success(
          `${key === "dataSharing" ? "Partage de données" : "Analytics"} ${
            value ? "activé" : "désactivé"
          }`
        );
      } else {
        const labels = {
          language: "Langue",
          currency: "Devise",
          timezone: "Fuseau horaire",
          profileVisibility: "Visibilité du profil",
        };
        toast.success(`${labels[key as keyof typeof labels]} mise à jour`);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres");
      console.error("Server error: " + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Préférences rapides */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Préférences rapides
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user?.name || session.user?.email}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Langue</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange("language", value)}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Devise</Label>
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value as "EUR" | "USD" | "GBP" | "CHF" | "JPY")}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CHF">CHF (CHF)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Fuseau horaire</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => handleSettingChange("timezone", value)}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York
                </SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Confidentialité
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Profil:{" "}
              {settings.profileVisibility.charAt(0).toUpperCase() +
                settings.profileVisibility.slice(1)}
            </span>
            <Badge variant="outline" className="text-xs">
              {session.user?.email}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Visibilité du profil</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) =>
                handleSettingChange("profileVisibility", value)
              }
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Amis uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Partage de données
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Autoriser le partage anonyme
                </p>
              </div>
            </div>
            <Switch
              checked={settings.dataSharing}
              onCheckedChange={(checked) =>
                handleSettingChange("dataSharing", checked)
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Améliorer l&apos;expérience
                </p>
              </div>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) =>
                handleSettingChange("analytics", checked)
              }
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statut du compte */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Compte sécurisé</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.name || session.user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tous les paramètres sont à jour
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              Actif
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
