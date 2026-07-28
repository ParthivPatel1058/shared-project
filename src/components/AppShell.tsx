import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useUIPrefs } from "@/hooks/useUIPrefs";

/**
 * Application shell: renders the persistent desktop Sidebar and a content
 * area that respects its width on large screens. Below `lg` the sidebar is
 * hidden (see Sidebar.tsx) and each page's top Navigation bar provides the
 * mobile menu.
 *
 * The initial collapsed state comes from the user's saved preference; the
 * in-session toggle is kept locally so flipping it does not rewrite the
 * preference the user chose in Settings.
 */
export default function AppShell() {
  const { prefs } = useUIPrefs();
  const [collapsed, setCollapsed] = useState<boolean>(prefs.sidebarCollapsed);

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[100px]" : "lg:pl-[288px]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
