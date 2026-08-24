import React from "react";
import { useApp } from "../../context/AppContext";
import HUDHeader from "./HUDHeader";
import TelemetryWidget from "./TelemetryWidget";
import HealthAnalyticsWidget from "./HealthAnalyticsWidget";
import ClinicalBoard from "./ClinicalBoard";
import NFCHubWidget from "./NFCHubWidget";

import { 
  Home, BookHeart, Calendar, Users, Sparkles, User, 
  Utensils, HeartPulse, ChevronRight, Stethoscope 
} from "lucide-react";

export default function DesktopHUD({ renderScreenContent }) {
  const { currentScreen, navigate } = useApp();

  const navItems = [
    { key: "inicio", label: "Cockpit Geral", Icon: Home },
    { key: "saude", label: "Saúde & Chutes", Icon: HeartPulse },
    { key: "diario", label: "Diário & Memórias", Icon: BookHeart },
    { key: "calendario", label: "Agenda & Consultas", Icon: Calendar },
    { key: "receitas", label: "Nutrição & Receitas", Icon: Utensils },
    { key: "comunidade", label: "Fórum de Mães", Icon: Users },
    { key: "perfil", label: "Perfil & Cartão", Icon: User },
  ];

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F2E7EB] flex flex-col font-albert text-[#3D2B33] select-none">
      {/* Top HUD Telemetry Header */}
      <HUDHeader />

      {/* Main Operations Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini Sidebar Navigation */}
        <aside className="w-56 bg-white/90 backdrop-blur-md border-r border-[#F0DDE4] p-3 flex flex-col justify-between shrink-0 shadow-sm">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C6B7A] px-3 pt-2 pb-2 font-poppins">
              Módulos do Sistema
            </p>
            <nav className="space-y-1">
              {navItems.map(({ key, label, Icon }) => {
                const isActive = currentScreen === key;
                return (
                  <button
                    key={key}
                    onClick={() => navigate(key)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#FBE8EF] to-[#FFF5F8] text-[#D4638F] border border-[#F0DDE4] shadow-xs"
                        : "text-[#523A46] hover:bg-[#FBE8EF]/60 hover:text-[#6B2D4E]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? "text-[#D4638F]" : "text-[#8C6B7A]"} />
                      <span>{label}</span>
                    </div>
                    {isActive && <ChevronRight size={13} className="text-[#D4638F]" />}
                  </button>
                );
              })}
            </nav>

            <div className="pt-2.5 mt-2.5 border-t border-[#F0DDE4]">
              <p className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#8C6B7A] px-3 pb-1.5 font-poppins">
                Acesso Profissional
              </p>
              <button
                onClick={() => navigate("portalmedico")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  currentScreen === "portalmedico"
                    ? "bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/40 shadow-xs"
                    : "text-[#00F2C3] bg-[#0A161B] hover:bg-[#00F2C3]/20 hover:text-white hover:shadow-xs border border-[#00F2C3]/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope size={16} className="text-[#00F2C3]" />
                  <span>Portal Presenz (Médico)</span>
                </div>
                <ChevronRight size={13} className="text-[#00F2C3]" />
              </button>
            </div>
          </div>

          <div className="bg-[#FDF5F8] p-3 rounded-2xl border border-[#F0DDE4] text-center">
            <span className="text-xl">🌸</span>
            <h5 className="text-[11px] font-bold text-[#6B2D4E] font-poppins mt-1">Mamãe+ Cockpit</h5>
            <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Versão 2.4 · Conectada</p>
          </div>
        </aside>

        {/* Central Operations Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-[#FAF3F6]/40">
          {currentScreen === "inicio" ? (
            /* Cockpit Dashboard Multi-Widget HUD Grid */
            <div className="max-w-[1500px] mx-auto space-y-5 animate-fadeIn pb-16">
              {/* Row 1: Telemetry & Biometrics + Health Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <TelemetryWidget />
                <HealthAnalyticsWidget />
              </div>

              {/* Row 2: Clinical Board & Protocols + NFC Emergency Hub */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <ClinicalBoard />
                <NFCHubWidget />
              </div>
            </div>
          ) : (
            /* Specific Screen View Rendered inside Desktop Container */
            <div className="max-w-[1100px] mx-auto bg-white rounded-3xl p-6 border border-[#F0DDE4] shadow-sm min-h-[600px] animate-fadeIn pb-16">
              {renderScreenContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
