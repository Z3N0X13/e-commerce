"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Session } from "next-auth";
import { Shield, Bell, Eye, EyeOff, Lock, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SecuritySettingsProps {
  session: Session;
  settings: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
  };
  onSettingChange: (key: string, value: boolean | string) => void;
}

export function SecuritySettings({ session, settings, onSettingChange }: SecuritySettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const securitySettings = [
    {
      title: "Authentification à deux facteurs",
      description: "Ajouter une couche de sécurité supplémentaire",
      key: "twoFactorAuth",
      icon: Shield,
    },
    {
      title: "Alertes de connexion",
      description: "Être notifié des nouvelles connexions",
      key: "loginAlerts",
      icon: Bell,
    },
  ];

  const handleSettingChange = async (key: string, value: boolean) => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/security', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     userId: session.user?.id,
      //     [key]: value 
      //   })
      // });

      onSettingChange(key, value);
      toast.success(`${key === 'twoFactorAuth' ? 'Authentification à deux facteurs' : 'Alertes de connexion'} ${value ? 'activées' : 'désactivées'}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres");
      console.error("Server error: " + (error as Error).message)
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsChangingPassword(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous pourriez appeler votre API avec l'ID utilisateur
      // await fetch('/api/settings/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: session.user?.id,
      //     currentPassword: passwords.current,
      //     newPassword: passwords.new
      //   })
      // });

      toast.success("Mot de passe modifié avec succès !");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error("Erreur lors du changement de mot de passe");
      console.error("Server error: " + (error as Error).message)
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Sécurité
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user?.name || session.user?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Membre depuis récemment
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {session.user?.email}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {securitySettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{setting.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
              </div>
            </div>
            <Switch
              checked={settings[setting.key as keyof typeof settings] as boolean}
              onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
              disabled={isUpdating}
            />
          </div>
        ))}
        
        <Separator />
        
        <div className="space-y-4">
          <Label className="text-sm font-medium">Délai de session (minutes)</Label>
          <Select
            value={settings.sessionTimeout}
            onValueChange={(value) => onSettingChange("sessionTimeout", value)}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Changement de mot de passe */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <h3 className="font-medium text-gray-900 dark:text-white">Changer le mot de passe</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  placeholder="Votre mot de passe actuel"
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  disabled={isChangingPassword}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  placeholder="Votre nouveau mot de passe"
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  disabled={isChangingPassword}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Confirmez votre nouveau mot de passe"
                  disabled={isChangingPassword}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  disabled={isChangingPassword}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handlePasswordChange} 
              className="w-full"
              disabled={isChangingPassword || !passwords.current || !passwords.new || !passwords.confirm}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isChangingPassword ? "Modification en cours..." : "Changer le mot de passe"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
