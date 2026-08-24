import React from "react";
import { Bell, ChevronLeft, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TopBar({ title, showBack = false, onNotify, rightAction }) {
  const { goBack, navigate, unreadCount, triggerSOS } = useApp();

  if (showBack) {
    return (
      <div className="w-full flex items-center justify-between px-5 pt-[max(16px,env(safe-area-inset-top))] pb-4 bg-white/85 backdrop-blur-md border-b border-[#F0DDE4] shrink-0 relative z-20">
        <button 
          onClick={goBack}
          className="w-9 h-9 rounded-2xl bg-white border border-[#F0DDE4] flex items-center justify-center active:scale-90 transition-all text-[#3D2B33] shrink-0 hover:bg-[#FAF3F6] cursor-pointer"
          aria-label="Voltar"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        
        <h2 className="text-[#4A4743] text-[15.5px] font-bold text-center flex-1 font-poppins px-2 truncate">
          {title}
        </h2>
        
        <button
          onClick={() => triggerSOS("Acionamento Rápido via Barra Superior")}
          className="w-9 h-9 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center active:scale-90 transition-all shrink-0 hover:bg-red-100 cursor-pointer shadow-xs"
          title="SOS Emergência"
        >
          <ShieldAlert size={18} className="animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between px-5 pt-[max(20px,env(safe-area-inset-top))] pb-4 bg-white/85 backdrop-blur-md border-b border-[#F0DDE4] shrink-0 relative z-20">
      <div>
        <p className="text-[#C38B9B] text-[9.5px] font-extrabold tracking-widest font-albert uppercase">
          Mamãe+
        </p>
        <h1 className="text-[#4A4743] text-[18px] font-bold font-poppins mt-0.5">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* SOS Emergency Button */}
        <button
          onClick={() => triggerSOS("Acionamento Rápido via Barra Superior")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[11px] shadow-sm hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all cursor-pointer font-poppins"
          title="SOS Emergência"
        >
          <ShieldAlert size={14} className="animate-pulse text-white" />
          <span>SOS</span>
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => navigate("notificacoes")}
          className="relative w-9 h-9 rounded-2xl bg-white border border-[#F0DDE4] flex items-center justify-center active:scale-95 transition-all text-[#3D2B33] shrink-0 hover:bg-[#FAF3F6] cursor-pointer"
          aria-label="Notificações"
        >
          <Bell size={17} strokeWidth={2.2} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-[#C38B9B] text-white text-[8px] font-extrabold flex items-center justify-center px-1 shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {rightAction && (
          <div className="shrink-0">
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
}
