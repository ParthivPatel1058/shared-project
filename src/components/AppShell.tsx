import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

/**
 * Application shell: renders the persistent desktop Sidebar and a content area
 * that respects the sidebar width on large screens. On screens below `lg` the
 * sidebar is hidden (see Sidebar.tsx) and each page's own top Navigation bar
 * provides the mobile menu.
 */
export default function AppShell() {
  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  return (
    <div className="min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className={collapsed ? "lg:pl-20" : "lg:pl-64"}>
        <Outlet />
      </div>
    </div>
  );
}
