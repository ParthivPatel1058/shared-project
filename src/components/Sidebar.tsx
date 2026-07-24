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
  ScanSearch,
  PanelRightClose,
  PanelRightOpen,
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
    items: [
      { path: "/", icon: LayoutGrid, labelKey: "home" },
      { path: "/crop-disease", icon: ScanSearch, labelKey: "cropDiseaseDetection" },
    ],
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
 * Persistent desktop sidebar docked on the RIGHT edge. Renders as a slim
 * icon rail by default and expands to full labels via the toggle button.
 * Hidden below the `lg` breakpoint, where the top-bar mobile menu
 * (in Navigation.tsx) takes over.
 */
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed top-0 right-0 bottom-0 z-40 bg-card/85 backdrop-blur-xl border-l border-border/70 shadow-[0_0_24px_hsl(152_45%_20%/0.06)] transition-[width] duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header: brand + expand/collapse control */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-border/60 flex-shrink-0",
          collapsed ? "flex-col justify-center gap-0 py-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img
              src={logo}
              alt="BhoomiX"
              className="h-8 w-8 object-contain rounded-lg flex-shrink-0"
            />
            <span className="font-display text-base font-bold text-foreground truncate">
              BhoomiX
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand menu" : "Collapse menu"}
          className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <PanelRightOpen className="h-[18px] w-[18px]" />
          ) : (
            <PanelRightClose className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>

      {/* Nav sections */}
      <nav className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}>
        {SECTIONS.map((section, i) => (
          <div key={section.headingKey} className={cn(i > 0 && "mt-4")}>
            {collapsed ? (
              i > 0 && <div className="mx-2 mb-3 border-t border-border/60" />
            ) : (
              <h4 className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {t(section.headingKey)}
              </h4>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? t(item.labelKey) : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg transition-colors duration-150",
                      collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 h-9",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">
                        {t(item.labelKey)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
