import { User, Package, Heart, Settings, LogOut } from "lucide-react";

export function SidebarMenu({ onLinkClick }: { onLinkClick: () => void }) {
  const mainLinks = [
    {
      href: "/dashboard/profile",
      label: "Mon Profil",
      icon: <User className="w-5 h-5" />,
    },
    {
      href: "/dashboard/orders",
      label: "Mes Commandes",
      icon: <Package className="w-5 h-5" />,
    },
    {
      href: "/dashboard/favorites",
      label: "Mes Favoris",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Paramètres",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const logoutLink = {
    href: "/logout",
    label: "Déconnexion",
    icon: <LogOut className="w-5 h-5" />,
  };

  return (
    <nav className="flex flex-col h-full justify-between">
      <div className="space-y-2">
        {mainLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200/75 text-gray-700 transition-colors duration-200"
          >
            {link.icon}
            <span className="text-sm font-medium">{link.label}</span>
          </a>
        ))}
      </div>

      <hr className="mt-auto border-gray-300" />

      <a
        href={logoutLink.href}
        onClick={onLinkClick}
        className="flex items-center gap-3 px-4 py-2 mt-4 rounded-lg hover:bg-red-100 text-red-600 transition-colors duration-200"
      >
        {logoutLink.icon}
        <span className="text-sm font-medium">{logoutLink.label}</span>
      </a>
    </nav>
  );
}
