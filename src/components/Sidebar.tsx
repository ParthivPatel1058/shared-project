import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ScanSearch,
  ShoppingBag,
  Store,
  HelpCircle,
  Landmark,
  Bot,
  Leaf,
  Carrot,
  MapPin,
  Truck,
  Settings as SettingsIcon,
  Zap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/bhoomix-logo.jpeg";

interface NavItem {
  path: string;
  icon: typeof Home;
  emoji: string;
  label: { en: string; hi: string };
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", icon: Home, emoji: "🏠", label: { en: "Home", hi: "होम" } },
  { path: "/crop-disease", icon: ScanSearch, emoji: "🔬", label: { en: "Crop Disease", hi: "फसल रोग" } },
  { path: "/agri-market", icon: ShoppingBag, emoji: "🛒", label: { en: "Agri Market", hi: "कृषि बाज़ार" } },
  { path: "/kisan-mart", icon: Store, emoji: "🏪", label: { en: "Kisan Mart", hi: "किसान मार्ट" } },
  { path: "/kisan-help", icon: HelpCircle, emoji: "👨‍🌾", label: { en: "Crop Advisory", hi: "फसल सलाह" } },
  { path: "/gov-schemes", icon: Landmark, emoji: "🏛️", label: { en: "Govt. Schemes", hi: "सरकारी योजनाएं" } },
  { path: "/robotic-farming", icon: Bot, emoji: "🤖", label: { en: "Robotic Farming", hi: "रोबोटिक कृषि" } },
  { path: "/organic-farming", icon: Leaf, emoji: "🌱", label: { en: "Organic Farming", hi: "जैविक खेती" } },
  { path: "/vegetable-farming", icon: Carrot, emoji: "🥕", label: { en: "Vegetable Farming", hi: "सब्जी खेती" } },
  { path: "/shop-locator", icon: MapPin, emoji: "📍", label: { en: "Nearby Shops", hi: "नज़दीकी दुकानें" } },
  { path: "/partner-registration", icon: Truck, emoji: "🚚", label: { en: "Delivery", hi: "डिलीवरी" } },
  { path: "/settings", icon: SettingsIcon, emoji: "⚙️", label: { en: "Settings", hi: "सेटिंग्स" } },
];

const QUICK_ACTIONS: NavItem[] = [
  { path: "/crop-disease", icon: ScanSearch, emoji: "🔬", label: { en: "Scan Disease", hi: "रोग स्कैन" } },
  { path: "/kisan-help", icon: HelpCircle, emoji: "💬", label: { en: "Ask Advisory", hi: "सलाह पूछें" } },
  { path: "/shop-locator", icon: MapPin, emoji: "📍", label: { en: "Nearby Shops", hi: "नज़दीकी दुकानें" } },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Floating glass dock — VisionOS-style sidebar pinned to the left edge with
 * breathing room on all sides. Icon rail when collapsed, full labels when
 * expanded. Hidden below `lg`, where the top-bar mobile menu takes over.
 */
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const en = language === "en";

  const email = user?.email ?? "";
  const name = email.split("@")[0] || "Farmer";
  const initials = name.slice(0, 2).toUpperCase();

  const renderItem = (item: NavItem, subtle = false) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={`${item.path}-${item.label.en}`}
        to={item.path}
        title={collapsed ? (en ? item.label.en : item.label.hi) : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl transition-all duration-300",
          collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3.5 h-10",
          isActive
            ? "bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            : "text-white/60 hover:text-white hover:bg-white/[0.07]",
        )}
      >
        {/* Active indicator */}
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-cyan-300 to-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
        )}
        <span
          className={cn(
            "text-[19px] leading-none flex-shrink-0 transition-transform duration-300 drop-shadow",
            isActive ? "scale-110" : "group-hover:scale-110 opacity-90",
          )}
        >
          {item.emoji}
        </span>
        {!collapsed && (
          <span className={cn("text-sm truncate transition-colors", subtle ? "font-normal" : "font-medium")}>
            {en ? item.label.en : item.label.hi}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-3 top-3 bottom-3 z-40 glass-dock rounded-[32px] transition-[width] duration-300 overflow-hidden",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      {/* Brand */}
      <div className={cn("flex items-center flex-shrink-0 pt-5 pb-4", collapsed ? "flex-col gap-3" : "px-5 justify-between")}>
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <img
            src={logo}
            alt="BhoomiX"
            className="h-9 w-9 object-cover rounded-xl ring-1 ring-white/20 flex-shrink-0"
          />
          {!collapsed && (
            <span className="font-display text-base font-bold text-white truncate">BhoomiX</span>
          )}
        </Link>
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center h-8 w-8 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen strokeWidth={1.75} className="h-[17px] w-[17px]" />
          ) : (
            <PanelLeftClose strokeWidth={1.75} className="h-[17px] w-[17px]" />
          )}
        </button>
      </div>

      {/* Navigation — spacing instead of separators */}
      <nav className={cn("flex-1 overflow-y-auto py-1 space-y-1", collapsed ? "px-3" : "px-3.5")}>
        {NAV_ITEMS.map((item) => renderItem(item))}

        {/* Quick actions */}
        <div className="pt-6">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3.5 mb-2">
              <Zap strokeWidth={1.75} className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {en ? "Quick Actions" : "त्वरित कार्य"}
              </span>
            </div>
          )}
          <div className="space-y-1">
            {QUICK_ACTIONS.map((item) => renderItem(item, true))}
          </div>
        </div>
      </nav>

      {/* User profile */}
      <button
        onClick={() => navigate("/settings")}
        className={cn(
          "flex items-center gap-3 m-3 p-2.5 rounded-3xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 transition-all duration-300 flex-shrink-0",
          collapsed && "justify-center p-2",
        )}
      >
        <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-[0_0_14px_rgba(45,212,191,0.35)]">
          {initials || "BX"}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 text-left flex-1">
              <p className="text-sm font-semibold text-white truncate capitalize">{name}</p>
              <p className="text-[11px] text-white/50 truncate">
                {en ? "Premium Farmer" : "प्रीमियम किसान"}
              </p>
            </div>
            <ChevronRight strokeWidth={1.75} className="h-4 w-4 text-white/40" />
          </>
        )}
      </button>
    </aside>
  );
}
