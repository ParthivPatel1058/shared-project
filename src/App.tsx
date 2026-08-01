import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import AppShell from "@/components/AppShell";
import ClickSpark from "@/components/ui/click-spark";
import RouteAnalytics from "@/components/RouteAnalytics";
import { ThemeSwitchDefs } from "@/components/ui/theme-switch";
import { useUIPrefs } from "@/hooks/useUIPrefs";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import Index from "./pages/Index";
import AgriMarket from "./pages/AgriMarket";
import KisanHelp from "./pages/KisanHelp";
import KisanMart from "./pages/KisanMart";
import GovSchemes from "./pages/GovSchemes";
import RoboticFarming from "./pages/RoboticFarming";
import ShopLocator from "./pages/ShopLocator";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import PartnerOrders from "./pages/PartnerOrders";
import PartnerRegistration from "./pages/PartnerRegistration";
import Support from "./pages/Support";
import OrganicFarming from "./pages/OrganicFarming";
import VegetableFarming from "./pages/VegetableFarming";
import Settings from "./pages/Settings";
import CropDisease from "./pages/CropDisease";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/auth/Welcome";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

const queryClient = new QueryClient();

const App = () => {
  // Mirror saved preferences onto <html> before the tree renders.
  useUIPrefs();
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <ClickSpark />
          <ThemeSwitchDefs />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteAnalytics />
            <AuthProvider>
              <CartProvider>
              <Routes>
                {/* Auth Routes (no shell) */}
                <Route path="/auth/welcome" element={<PublicOnlyRoute><Welcome /></PublicOnlyRoute>} />
                <Route path="/auth/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                <Route path="/auth/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

                {/* Protected Routes — all rendered inside AppShell so the
                    desktop Sidebar persists across navigation. */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Index />} />
                  <Route path="/agri-market" element={<AgriMarket />} />
                  <Route path="/kisan-help" element={<KisanHelp />} />
                  <Route path="/kisan-mart" element={<KisanMart />} />
                  <Route path="/gov-schemes" element={<GovSchemes />} />
                  <Route path="/robotic-farming" element={<RoboticFarming />} />
                  <Route path="/shop-locator" element={<ShopLocator />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/addresses" element={<Addresses />} />
                  <Route path="/partner-orders" element={<PartnerOrders />} />
                  <Route path="/partner-registration" element={<PartnerRegistration />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/organic-farming" element={<OrganicFarming />} />
                  <Route path="/vegetable-farming" element={<VegetableFarming />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/crop-disease" element={<CropDisease />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
