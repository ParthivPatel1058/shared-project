import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingBag,
  HelpCircle,
  Store,
  Package,
  Landmark,
  Bot,
  Leaf,
  Carrot,
  MapPin,
  Truck,
  LifeBuoy,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/bhoomix-logo.jpeg";

interface NavItem {
  path: string;
  icon: typeof LayoutGrid;
  labelKey: string;
}

interface NavSection {
  headingKey: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    headingKey: "dashboard",
    items: [{ path: "/", icon: LayoutGrid, labelKey: "home" }],
  },
  {
    headingKey: "shopping",
    items: [
      { path: "/agri-market", icon: ShoppingBag, labelKey: "agriMarket" },
      { path: "/kisan-mart", icon: Store, labelKey: "kisanMart" },
      { path: "/kisan-help", icon: HelpCircle, labelKey: "kisanHelp" },
      { path: "/orders", icon: Package, labelKey: "orders" },
    ],
  },
  {
    headingKey: "navigation",
    items: [
      { path: "/gov-schemes", icon: Landmark, labelKey: "govSchemes" },
      { path: "/robotic-farming", icon: Bot, labelKey: "roboticFarming" },
      { path: "/organic-farming", icon: Leaf, labelKey: "organicFarming" },
      { path: "/vegetable-farming", icon: Carrot, labelKey: "vegetableFarming" },
      { path: "/shop-locator", icon: MapPin, labelKey: "shopLocator" },
      { path: "/partner-registration", icon: Truck, labelKey: "deliveryPartner" },
    ],
  },
  {
    headingKey: "accountSection",
    items: [
      { path: "/partner-orders", icon: Truck, labelKey: "partnerOrders" },
      { path: "/support", icon: LifeBuoy, labelKey: "support" },
      { path: "/settings", icon: SettingsIcon, labelKey: "settings" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Persistent, collapsible desktop sidebar. Hidden below the `lg` breakpoint,
 * where the top-bar mobile menu (in Navigation.tsx) takes over.
 */
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 glass-strong border-r border-primary/20 transition-[width] duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 h-20 px-4 border-b border-border/40 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={logo}
            alt="Bhoomi"
            className="h-10 w-10 object-contain rounded-2xl flex-shrink-0"
          />
          {!collapsed && (
            <span className="text-xl font-bold text-foreground truncate">Bhoomi</span>
          )}
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.headingKey}>
            {!collapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(section.headingKey)}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200",
                      collapsed && "justify-center",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "text-foreground hover:bg-primary/10",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{t(item.labelKey)}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex items-center justify-center gap-2 m-3 px-3 py-2.5 rounded-2xl text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors flex-shrink-0"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        {!collapsed && <span className="text-sm">{t("menu")}</span>}
      </button>
    </aside>
  );
}
