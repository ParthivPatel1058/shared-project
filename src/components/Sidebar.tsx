import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  ScanSearch,
  ShoppingBag,
  Store,
  Landmark,
  Sprout,
  Leaf,
  Carrot,
  Bot,
  MapPin,
  Truck,
  Package,
  Settings as SettingsIcon,
  ChevronRight,
  ChevronUp,
  ChevronsRight,
  ChevronsLeft,
  LogOut,
  Sun,
  Moon,
  LifeBuoy,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useOrderCount } from "@/hooks/useOrderCount";
import ThemeSwitch from "@/components/ui/theme-switch";
import { cn } from "@/lib/utils";
import logo from "@/assets/bhoomix-logo.jpeg";

interface Item {
  path: string;
  icon: typeof LayoutGrid;
  label: { en: string; hi: string };
  /** Nested children turn this row into an expandable group. */
  children?: Item[];
  badgeKey?: "orders";
}

const NAV: Item[] = [
  { path: "/", icon: LayoutGrid, label: { en: "Overview", hi: "अवलोकन" } },
  { path: "/crop-disease", icon: ScanSearch, label: { en: "Crop Disease", hi: "फसल रोग" } },
  { path: "/kisan-help", icon: HelpCircle, label: { en: "Crop Advisory", hi: "फसल सलाह" } },
  { path: "/agri-market", icon: ShoppingBag, label: { en: "Agri Market", hi: "कृषि बाज़ार" } },
  { path: "/kisan-mart", icon: Store, label: { en: "Kisan Mart", hi: "किसान मार्ट" } },
  {
    path: "#farming",
    icon: Sprout,
    label: { en: "Farming Guides", hi: "खेती गाइड" },
    children: [
      { path: "/organic-farming", icon: Leaf, label: { en: "Organic", hi: "जैविक" } },
      { path: "/vegetable-farming", icon: Carrot, label: { en: "Vegetable", hi: "सब्ज़ी" } },
      { path: "/robotic-farming", icon: Bot, label: { en: "Robotic", hi: "रोबोटिक" } },
    ],
  },
  { path: "/gov-schemes", icon: Landmark, label: { en: "Schemes", hi: "योजनाएं" } },
  { path: "/orders", icon: Package, label: { en: "Orders", hi: "ऑर्डर" }, badgeKey: "orders" },
  { path: "/addresses", icon: MapPin, label: { en: "Addresses", hi: "पते" } },
  {
    path: "#delivery",
    icon: Truck,
    label: { en: "Delivery", hi: "डिलीवरी" },
    children: [
      { path: "/partner-registration", icon: Truck, label: { en: "Become a Partner", hi: "पार्टनर बनें" } },
      { path: "/partner-orders", icon: Package, label: { en: "Partner Orders", hi: "पार्टनर ऑर्डर" } },
    ],
  },
  { path: "/shop-locator", icon: MapPin, label: { en: "Nearby Shops", hi: "नज़दीकी दुकानें" } },
  { path: "/support", icon: LifeBuoy, label: { en: "Support", hi: "सहायता" } },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Application sidebar. Expanded it shows labelled rows with an accent bar on
 * the active item and an inline expandable sub-tree; collapsed it becomes an
 * icon rail where each icon reveals its label in a floating gradient pill.
 */
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const orderCount = useOrderCount();
  const en = language === "en";

  const [openGroup, setOpenGroup] = useState<string | null>("#farming");

  const name = (user?.email ?? "").split("@")[0] || "Farmer";
  const initials = name.slice(0, 2).toUpperCase();

  const isActive = (p: string) => location.pathname === p;
  const groupActive = (item: Item) =>
    !!item.children?.some((c) => isActive(c.path));

  const badgeFor = (item: Item) =>
    item.badgeKey === "orders" && orderCount > 0 ? orderCount : null;

  /* ---------- a single row ---------- */
  const Row = ({ item, nested = false }: { item: Item; nested?: boolean }) => {
    const Icon = item.icon;
    const hasChildren = !!item.children?.length;
    const open = openGroup === item.path;
    const active = hasChildren ? groupActive(item) : isActive(item.path);
    const badge = badgeFor(item);

    const body = (
      <>
        {/* Accent bar on the active row */}
        {active && (
          <motion.span
            layoutId="sidebar-accent"
            className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full accent-grad-v"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}

        <span className="relative flex-shrink-0">
          <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" />
          {/* In the rail the badge rides on the icon */}
          {collapsed && badge && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full accent-solid px-1 text-[9px] font-bold text-white">
              {badge}
            </span>
          )}
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 truncate text-sm font-medium">
              {en ? item.label.en : item.label.hi}
            </span>
            {badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full accent-solid px-1.5 text-[10px] font-bold text-white">
                {badge}
              </span>
            )}
            {hasChildren ? (
              <ChevronUp
                strokeWidth={2}
                className={cn(
                  "h-4 w-4 opacity-60 transition-transform duration-300",
                  !open && "rotate-180",
                )}
              />
            ) : (
              active && <ChevronRight strokeWidth={2} className="h-4 w-4 opacity-60" />
            )}
          </>
        )}
      </>
    );

    const rowClass = cn(
      "group/row relative flex items-center rounded-xl transition-colors duration-200",
      collapsed ? "h-11 w-11 justify-center" : "h-11 gap-3 px-3",
      nested && !collapsed && "h-10 pl-3",
      active
        ? "bg-black/[0.06] text-neutral-900 dark:bg-white/[0.10] dark:text-white"
        : "text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/[0.06] dark:hover:text-white",
    );

    const flyout = collapsed && (
      <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl accent-grad accent-ink px-3 py-2 text-xs font-semibold opacity-0 shadow-lg transition-all duration-200 group-hover/row:opacity-100">
        {en ? item.label.en : item.label.hi}
      </span>
    );

    if (hasChildren) {
      return (
        <button
          type="button"
          onClick={() => (collapsed ? onToggle() : setOpenGroup(open ? null : item.path))}
          className={cn(rowClass, "w-full")}
        >
          {body}
          {flyout}
        </button>
      );
    }

    return (
      <Link to={item.path} className={rowClass}>
        {body}
        {flyout}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-3 top-3 bottom-3 z-40 hidden lg:flex flex-col rounded-[26px] border transition-[width] duration-300 backdrop-blur-2xl border-black/10 bg-white/80 shadow-[0_24px_70px_rgba(30,40,60,0.16)] dark:border-white/10 dark:bg-[#0b0d12]/85 dark:shadow-[0_24px_70px_rgba(0,0,0,0.5)]",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
    >
      {/* Collapse handle, straddling the right edge */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-[72px] z-50 flex h-7 w-7 items-center justify-center rounded-full border shadow-lg transition-colors border-black/10 bg-white text-neutral-500 hover:text-neutral-900 dark:border-white/15 dark:bg-[#141821] dark:text-white/70 dark:hover:text-white"
      >
        {collapsed ? (
          <ChevronsRight strokeWidth={2.5} className="h-3.5 w-3.5" />
        ) : (
          <ChevronsLeft strokeWidth={2.5} className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Brand */}
      <div className={cn("flex items-center pt-5 pb-4", collapsed ? "justify-center" : "px-4 gap-2.5")}>
        <img src={logo} alt="" className="h-8 w-8 flex-shrink-0 rounded-lg object-cover ring-1 ring-black/10 dark:ring-white/15" />
        {!collapsed && (
          <span className="truncate text-[17px] font-semibold tracking-tight text-neutral-900 dark:text-white">
            Bhoomi<span className="text-neutral-400 dark:text-white/50">X</span>
          </span>
        )}
      </div>

      <div className={cn("h-px bg-black/10 dark:bg-white/10", collapsed ? "mx-4" : "mx-4")} />

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto overflow-x-visible py-4 space-y-1", collapsed ? "px-3" : "px-3")}>
        {NAV.map((item) => (
          <div key={item.path}>
            <Row item={item} />

            {/* Nested tree */}
            <AnimatePresence initial={false}>
              {!collapsed && item.children && openGroup === item.path && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="relative ml-[22px] mt-1 space-y-1 pl-3">
                    {/* connector line */}
                    <span className="absolute left-0 top-1 bottom-1 w-px bg-black/12 dark:bg-white/15" />
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-200",
                          isActive(child.path)
                            ? "bg-black/[0.06] font-medium text-neutral-900 dark:bg-white/[0.10] dark:text-white"
                            : "text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 dark:text-white/55 dark:hover:bg-white/[0.05] dark:hover:text-white",
                        )}
                      >
                        <span className="flex-1 truncate">
                          {en ? child.label.en : child.label.hi}
                        </span>
                        <ChevronRight strokeWidth={2} className="h-3.5 w-3.5 opacity-50" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

      </nav>

      {/* Settings */}
      <div className={cn("pb-3", collapsed ? "px-3" : "px-3")}>
        <Row item={{ path: "/settings", icon: SettingsIcon, label: { en: "Settings", hi: "सेटिंग्स" } }} />
      </div>

      <div className="mx-4 h-px bg-black/10 dark:bg-white/10" />

      {/* User */}
      <div className={cn("flex items-center py-4", collapsed ? "justify-center px-3" : "gap-3 px-4")}>
        <button
          onClick={() => navigate("/settings")}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full accent-grad accent-ink text-[11px] font-bold ring-2 ring-black/5 dark:ring-white/10"
        >
          {initials || "BX"}
        </button>
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-sm font-medium capitalize text-neutral-800 dark:text-white/85">{name}</span>
            <button
              onClick={signOut}
              aria-label="Sign out"
              className="transition-colors text-neutral-400 hover:text-neutral-900 dark:text-white/50 dark:hover:text-white"
            >
              <LogOut strokeWidth={1.75} className="h-[18px] w-[18px]" />
            </button>
          </>
        )}
      </div>

      {/* Theme switch — the illustrated toggle needs ~79px of width, so the
          icon-rail keeps a compact button instead. */}
      <div className={cn("pb-4", collapsed ? "px-3" : "px-4")}>
        {collapsed ? (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors text-neutral-500 hover:bg-black/[0.04] hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Moon strokeWidth={2} className="h-[18px] w-[18px]" />
            ) : (
              <Sun strokeWidth={2} className="h-[18px] w-[18px]" />
            )}
          </button>
        ) : (
          <div className="flex justify-center">
            <ThemeSwitch size={13} />
          </div>
        )}
      </div>
    </aside>
  );
}
