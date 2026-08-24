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

  // 1. If in medical portal (or logged in as doctor), render full-screen professional portal with smooth vertical scrolling
  if (currentScreen === "portalmedico" || (isLoggedIn && userRole === "doctor")) {
    return (
      <div className="w-full min-h-screen bg-[#0C1618] overflow-y-auto overflow-x-hidden select-none pointer-events-auto">
        {renderScreenContent ? renderScreenContent() : children}
      </div>
    );
  }

  // 2. If in Login screen, let the login screen render its responsive morphing layout freely with full scrolling
  if (currentScreen === "login") {
    return (
      <div className="w-full min-h-screen overflow-y-auto overflow-x-hidden select-none font-albert">
        {children}
      </div>
    );
  }

  // 3. Other auth screens (Cadastro, Formulario): render centered modern card
  if (isAuthScreen) {
    return (
      <div className="w-full min-h-screen bg-[#FAF8F5] overflow-y-auto flex flex-col justify-center items-center p-0 sm:p-6 select-none font-albert">
        <div className="w-full max-w-[480px] bg-[#FAF8F5] sm:bg-white sm:rounded-[32px] p-4 sm:p-8 sm:border sm:border-[#F0DDE4] sm:shadow-mamaeStrong animate-fadeIn flex flex-col min-h-screen sm:min-h-0 justify-between">
          {children}
        </div>
      </div>
    );
  }

  // 4. Desktop Mode: strictly full Desktop Cockpit/HUD
  if (isDesktop) {
    return (
      <div className="w-full min-h-screen overflow-y-auto overflow-x-hidden select-none">
        <DesktopHUD
          renderScreenContent={renderScreenContent}
        />
      </div>
    );
  }

  // 5. Mobile Mode: strictly native mobile full-screen experience with scrollable content
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
