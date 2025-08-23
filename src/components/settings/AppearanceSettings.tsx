"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Session } from "next-auth";
import { Palette, Monitor, Moon, Sun, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useThemeContext } from "@/components/ThemeProvider";

interface AppearanceSettingsProps {
  session: Session;
  settings: {
    theme: string;
    compactMode: boolean;
    animations: boolean;
  };
  onSettingChange: (key: string, value: boolean | string) => void;
}

export function AppearanceSettings({
  session,
  settings,
  onSettingChange,
}: AppearanceSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { theme, setThemeMode } = useThemeContext();

  const appearanceSettings = [
    {
      title: "Mode compact",
      description: "Réduire l'espacement entre les éléments",
      key: "compactMode",
      icon: Monitor,
    },
    {
      title: "Animations",
      description: "Activer les animations et transitions",
      key: "animations",
      icon: Palette,
    },
  ];

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const handleSettingChange = async (key: string, value: boolean) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/appearance', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: session.user?.id,
      //     [key]: value
      //   })
      // });

      onSettingChange(key, value);
      toast.success(
        `${key === "compactMode" ? "Mode compact" : "Animations"} ${
          value ? "activé" : "désactivé"
        }`
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres");
      console.error("Server error: " + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/theme', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: session.user?.id,
      //     theme: newTheme
      //   })
      // });

      setThemeMode(newTheme);
      onSettingChange("theme", newTheme);
      toast.success(
        `Thème ${newTheme === "light" ? "clair" : "sombre"} appliqué`
      );
    } catch (error) {
      toast.error("Erreur lors du changement de thème");
      console.error("Server error: " + (error as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Apparence
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Préférences pour {session.user?.name || session.user?.email}
          </span>
          <Badge variant="outline" className="text-xs">
            {theme === "dark" ? "Mode sombre" : "Mode clair"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Thème</Label>
          <div className="flex gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => handleThemeChange("light")}
              className="flex items-center gap-2"
              disabled={isUpdating}
            >
              <Sun className="w-4 h-4" />
              Clair
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => handleThemeChange("dark")}
              className="flex items-center gap-2"
              disabled={isUpdating}
            >
              <Moon className="w-4 h-4" />
              Sombre
            </Button>
          </div>
        </div>

        {appearanceSettings.map((setting) => (
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
              checked={
                settings[setting.key as keyof typeof settings] as boolean
              }
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
