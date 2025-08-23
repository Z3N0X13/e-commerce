"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { toast } from "sonner";

import TopBar from "@/components/global/TopBar";
import Footer from "@/components/global/Footer";
import { NotificationSettings } from "../../../components/settings/NotificationSettings";
import { SecuritySettings } from "../../../components/settings/SecuritySettings";
import { AppearanceSettings } from "../../../components/settings/AppearanceSettings";
import { PreferencesSidebar } from "../../../components/settings/PreferencesSidebar";

interface SettingsClientProps {
  session: Session;
}

interface Settings {
  // Notifications
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;

  // Sécurité
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;

  // Apparence
  theme: string;
  compactMode: boolean;
  animations: boolean;

  // Préférences
  language: string;
  currency: string;
  timezone: string;

  // Confidentialité
  profileVisibility: string;
  dataSharing: boolean;
  analytics: boolean;
}

export function SettingsClient({ session }: SettingsClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
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
  });

  // Charger les paramètres depuis l'API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          toast.error("Erreur lors du chargement des paramètres");
        }
      } catch (error) {
        toast.error("Erreur de connexion");
        console.error("Server error: " + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (isLoading) {
    return (
      <>
        <TopBar />
        <div className="min-h-screen bg-gray-100 dark:bg-black/30 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-opacity-50 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Chargement des paramètres...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gray-100 dark:bg-black/30 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Paramètres
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Personnalisez votre expérience utilisateur -{" "}
              {session.user?.name || session.user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Paramètres Principaux */}
            <div className="lg:col-span-2 space-y-6">
              <NotificationSettings
                session={session}
                settings={{
                  emailNotifications: settings.emailNotifications,
                  orderUpdates: settings.orderUpdates,
                  promotions: settings.promotions,
                  newsletter: settings.newsletter,
                }}
                onSettingChange={handleSettingChange}
              />

              <SecuritySettings
                session={session}
                settings={{
                  twoFactorAuth: settings.twoFactorAuth,
                  loginAlerts: settings.loginAlerts,
                  sessionTimeout: settings.sessionTimeout,
                }}
                onSettingChange={handleSettingChange}
              />

              <AppearanceSettings
                session={session}
                settings={{
                  theme: settings.theme,
                  compactMode: settings.compactMode,
                  animations: settings.animations,
                }}
                onSettingChange={handleSettingChange}
              />
            </div>

            <PreferencesSidebar
              session={session}
              settings={{
                language: settings.language,
                currency: settings.currency,
                timezone: settings.timezone,
                profileVisibility: settings.profileVisibility,
                dataSharing: settings.dataSharing,
                analytics: settings.analytics,
              }}
              onSettingChange={handleSettingChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
