import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import DesktopHUD from "./DesktopHUD/DesktopHUD";

export default function PWALayout({ children, nav, renderScreenContent }) {
  const { isLoggedIn, currentScreen, userRole } = useApp();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isAuthScreen = !isLoggedIn || ["formulario", "login", "cadastro"].includes(currentScreen);

  // 1. If in medical portal (or logged in as doctor), render full-screen professional portal
  if (currentScreen === "portalmedico" || (isLoggedIn && userRole === "doctor")) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FAF3F6]/30 overflow-y-auto select-none pointer-events-auto">
        {renderScreenContent ? renderScreenContent() : children}
      </div>
    );
  }

  // 2. If visitor is not logged in or in auth/onboarding, render centered card page
  if (isAuthScreen) {
    return (
      <div className="w-full h-full min-h-screen bg-[#FDF5F8] overflow-y-auto flex flex-col justify-center items-center p-0 sm:p-6 select-none font-albert">
        <div className="w-full max-w-[460px] bg-[#FDF5F8] sm:bg-white sm:rounded-[32px] p-4 sm:p-8 sm:border sm:border-[#F0DDE4] sm:shadow-mamaeStrong animate-fadeIn flex flex-col min-h-screen sm:min-h-0 justify-between">
          {children}
        </div>
      </div>
    );
  }

  // 3. Desktop Mode: strictly full Desktop Cockpit/HUD (no mobile frame toggle)
  if (isDesktop) {
    return (
      <DesktopHUD
        renderScreenContent={renderScreenContent}
      />
    );
  }

  // 4. Mobile Mode: strictly native mobile full-screen experience
  return (
    <div className="w-full h-full min-h-screen bg-[#FDF5F8] flex flex-col select-none font-albert overflow-hidden relative">
      {/* Mobile Screen Content Wrapper */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-[82px] relative bg-[#FDF5F8]">
        {children}
      </div>

      {/* Fixed Navigation Bar */}
      {nav}
    </div>
  );
}
