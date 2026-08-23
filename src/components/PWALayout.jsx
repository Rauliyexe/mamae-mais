import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import DesktopHUD from "./DesktopHUD/DesktopHUD";
import { Monitor } from "lucide-react";

export default function PWALayout({ children, nav, renderScreenContent }) {
  const { isLoggedIn, currentScreen } = useApp();

  // 'auto' | 'hud' | 'mobile'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("mamae_view_mode") || "auto";
  });

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isAuthOrMedical = !isLoggedIn || ["formulario", "portalmedico", "login", "cadastro"].includes(currentScreen);
  const showHUD = isLoggedIn && !isAuthOrMedical && (viewMode === "hud" || (viewMode === "auto" && isDesktop));

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem("mamae_view_mode", newMode);
  };

  // If in medical portal mode, render as a fullscreen dashboard
  if (currentScreen === "portalmedico") {
    return (
      <div className="w-full h-full min-h-screen bg-[#FAF3F6]/30 overflow-y-auto select-none pointer-events-auto">
        {children}
      </div>
    );
  }

  // If visitor is not logged in or is in the onboarding form, render in a fullscreen centered card page
  if (isAuthOrMedical) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FDF5F8] overflow-y-auto flex flex-col justify-center items-center p-0 sm:p-6 select-none font-albert">
        <div className="w-full max-w-[460px] bg-[#FDF5F8] sm:bg-white sm:rounded-[32px] p-4 sm:p-8 sm:border sm:border-[#F0DDE4] sm:shadow-mamaeStrong animate-fadeIn flex flex-col min-h-screen sm:min-h-0 justify-between">
          {children}
        </div>
      </div>
    );
  }

  // If in Desktop HUD Mode
  if (showHUD) {
    return (
      <DesktopHUD
        onViewModeChange={handleViewModeChange}
        currentViewMode="hud"
        renderScreenContent={renderScreenContent}
      />
    );
  }

  // Otherwise, Mobile PWA Companion Mode
  return (
    <div className="w-full h-full min-h-screen bg-[#F2E7EB] flex flex-col items-center justify-center select-none font-albert overflow-hidden sm:p-4 relative">
      {/* Floating Desktop Switcher if viewed on large screen */}
      {isDesktop && (
        <div className="hidden lg:flex absolute top-4 right-4 z-50">
          <button
            onClick={() => handleViewModeChange("hud")}
            className="bg-white/95 hover:bg-[#FBE8EF] text-[#6B2D4E] text-xs font-extrabold px-3.5 py-2 rounded-2xl shadow-md border border-[#F0DDE4] flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Monitor size={14} className="text-[#D4638F]" />
            Abrir Centro de Operações (PC)
          </button>
        </div>
      )}

      {/* App Container: Fullscreen on mobile, centered modern card on desktop/tablets */}
      <div className="relative w-full h-full sm:w-[420px] sm:h-[94vh] sm:max-h-[890px] bg-[#FDF5F8] sm:rounded-[36px] sm:shadow-mamaeStrong sm:border sm:border-[#F0DDE4] overflow-hidden flex flex-col">
        {/* Dynamic Screen Content Wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-none pb-[82px] relative bg-[#FDF5F8]">
          {children}
        </div>

        {/* Fixed Navigation Bar */}
        {nav}
      </div>
    </div>
  );
}
