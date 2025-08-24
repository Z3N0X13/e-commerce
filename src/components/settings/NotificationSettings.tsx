"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Session } from "next-auth";
import { Bell, Mail, Truck, CreditCard, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationSettingsProps {
  session: Session;
  settings: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  onSettingChange: (key: string, value: boolean) => void;
}

export function NotificationSettings({
  session,
  settings,
  onSettingChange,
}: NotificationSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const notificationSettings = [
    {
      title: "Notifications par email",
      description: `Recevoir les notifications importantes par email (${session.user?.email})`,
      key: "emailNotifications",
      icon: Mail,
    },
    {
      title: "Mises à jour de commande",
      description: "Être informé du statut de vos commandes",
      key: "orderUpdates",
      icon: Truck,
    },
    {
      title: "Promotions et offres",
      description: "Recevoir les offres spéciales et promotions",
      key: "promotions",
      icon: CreditCard,
    },
    {
      title: "Newsletter",
      description: "Recevoir notre newsletter mensuelle",
      key: "newsletter",
      icon: Mail,
    },
  ];

  const handleSettingChange = async (key: string, value: boolean) => {
    setIsUpdating(true);
    try {
      // Simuler une API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/notifications', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: session.user?.id,
      //     [key]: value
      //   })
      // });

      onSettingChange(key, value);
      toast.success(
        `${
          key === "emailNotifications"
            ? "Notifications email"
            : key === "orderUpdates"
            ? "Mises à jour de commande"
            : key === "promotions"
            ? "Promotions"
            : "Newsletter"
        } ${value ? "activées" : "désactivées"}`
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres");
      console.error("Server error: " + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {session.user?.name || session.user?.email}
          </span>
          <Badge variant="outline" className="text-xs">
            {session.user?.email}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationSettings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {setting.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {setting.description}
                </p>
              </div>
            </div>
            <Switch
              checked={settings[setting.key as keyof typeof settings]}
              onCheckedChange={(checked) =>
                handleSettingChange(setting.key, checked)
              }
              disabled={isUpdating}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
