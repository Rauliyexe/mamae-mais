import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  Heart, CalendarHeart, Sparkles, Smartphone, Monitor, Bell, 
  AlertTriangle, Droplet, Activity, LogOut, ChevronRight, User, Stethoscope,
  Smile, Meh, Frown
} from "lucide-react";
import logoImg from "../../assets/logo.png";

export default function HUDHeader({ onViewModeChange, currentViewMode }) {
  const { 
    user, currentWeek, daysRemaining, progressPercent, trimester, 
    unreadCount, notifications, navigate, logout, kickSessions, mood
  } = useApp();

  const todaysKicks = kickSessions
    ?.filter(s => s.date === new Date().toISOString().slice(0, 10))
    .reduce((acc, s) => acc + (s.count || 0), 0) || 0;

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#F0DDE4] px-6 py-3 shrink-0 flex items-center justify-between shadow-sm z-30 font-albert">
      {/* Brand & Live System Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="Logo Mamãe+" className="w-12 h-12 object-contain shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C38B9B] font-poppins">
                CENTRO DE OPERAÇÕES
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3182CE] animate-pulse mr-1" />
                LIVE HUD
              </span>
            </div>
            <h1 className="text-[17px] font-bold text-[#4A4743] font-poppins leading-tight flex items-center gap-2">
              Mamãe+ Cockpit <span className="text-xs font-normal text-[#8C6B7A]">· {user.name}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Telemetry Ribbons */}
      <div className="hidden lg:flex items-center gap-3 bg-[#FAF3F6]/50 px-4 py-2 rounded-2xl border border-[#F0DDE4]">
        {/* Gestational Progress */}
        <div className="flex items-center gap-2.5 border-r border-[#F0DDE4] pr-4">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#FAF3F6]" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#C38B9B]" strokeWidth="4" strokeDasharray={`${progressPercent}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[8.5px] font-extrabold text-[#C38B9B]">{progressPercent}%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">Idade Gestacional</p>
            <p className="text-xs font-extrabold text-[#3D2B33]">Semana {currentWeek} <span className="text-[#C38B9B]">({trimester}º Tri)</span></p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 border-r border-[#F0DDE4] pr-4">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#C38B9B]">
            <CalendarHeart size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">Contagem Regressiva</p>
            <p className="text-xs font-extrabold text-[#3D2B33]">{daysRemaining} dias para o parto</p>
          </div>
        </div>

        {/* Activity & Kicks */}
        <div className="flex items-center gap-2 border-r border-[#F0DDE4] pr-4">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#38A169]">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">Chutes Hoje</p>
            <p className="text-xs font-extrabold text-[#3D2B33]">{todaysKicks} registrados</p>
          </div>
        </div>

        {/* Mood Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#C38B9B]">
            {mood === "otima" ? (
              <Smile size={16} className="text-[#C38B9B] fill-[#C38B9B]/20" />
            ) : mood === "bem" ? (
              <Smile size={16} className="text-[#C38B9B]" />
            ) : mood === "confusa" ? (
              <Meh size={16} className="text-[#8C6B7A]" />
            ) : mood === "triste" ? (
              <Frown size={16} className="text-[#8C6B7A]" />
            ) : (
              <Smile size={16} className="text-[#8C6B7A]" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">Estado de Humor</p>
            <p className="text-xs font-extrabold text-[#3D2B33] capitalize">{mood || "Registrar"}</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Mode Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Doctor Portal Button */}
        <button
          onClick={() => navigate("portalmedico")}
          className="flex items-center gap-1.5 bg-[#0A161B] hover:bg-[#00F2C3] text-[#00F2C3] hover:text-[#070F12] border border-[#00F2C3]/30 hover:border-[#00F2C3] text-xs font-extrabold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,242,195,0.4)] active:scale-95 group"
          title="Acessar Portal Clínico Presenz"
        >
          <Stethoscope size={14} className="group-hover:rotate-12 transition-transform duration-200 text-[#00F2C3] group-hover:text-[#070F12]" />
          <span className="hidden md:inline font-poppins">Presenz Clínico</span>
        </button>

        {/* Emergency NFC Quick Access */}
        <button
          onClick={() => navigate("cartaonfc")}
          className="flex items-center gap-1.5 bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#C53030] border border-[#FEB2B2] text-xs font-extrabold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          title="Ficha Médica de Emergência & Cartão NFC"
        >
          <AlertTriangle size={14} />
          <span className="hidden md:inline">Ficha SOS</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("notificacoes")}
          className="relative w-9 h-9 rounded-xl bg-white border border-[#F0DDE4] text-[#3D2B33] hover:bg-[#FAF3F6] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Notificações"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C38B9B] text-white text-[8px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#F0DDE4]">
          <button
            onClick={() => navigate("perfil")}
            className="w-9 h-9 rounded-xl bg-[#FAF3F6] text-[#4A4743] font-bold text-sm flex items-center justify-center border border-[#F0DDE4] hover:border-[#C38B9B] transition-all cursor-pointer"
            title="Perfil da Gestante"
          >
            {user.name.charAt(0)}
          </button>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-lg text-[#8C6B7A] hover:text-[#C53030] hover:bg-[#FFF5F5] flex items-center justify-center transition-colors cursor-pointer"
            title="Sair da Conta"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
