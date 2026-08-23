import React from "react";
import { Home, BookHeart, Calendar, Users, Sparkles, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BottomNav() {
  const { currentScreen, navigate } = useApp();

  const items = [
    { key: "inicio", label: "Início", Icon: Home },
    { key: "diario", label: "Diário", Icon: BookHeart },
    { key: "calendario", label: "Agenda", Icon: Calendar },
    { key: "comunidade", label: "Fórum", Icon: Users },
    { key: "chatia", label: "Nina IA", Icon: Sparkles },
    { key: "perfil", label: "Perfil", Icon: User },
  ];

  const getActiveTab = () => {
    if (["inicio", "receitas", "saude"].includes(currentScreen)) return "inicio";
    if (currentScreen === "diario") return "diario";
    if (currentScreen === "calendario") return "calendario";
    if (currentScreen === "comunidade") return "comunidade";
    if (currentScreen === "chatia") return "chatia";
    if (currentScreen === "perfil") return "perfil";
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-[28px] shadow-[0_-6px_28px_rgba(180,77,117,0.06)] px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] flex justify-between z-40 border-t border-[#F0DDE4]">
      {items.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => navigate(key)}
            className="flex-1 flex flex-col items-center gap-1.5 py-1.5 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer"
            style={{ 
              backgroundColor: isActive ? "#FBE8EF" : "transparent" 
            }}
          >
            <Icon
              size={18}
              strokeWidth={2.5}
              color={isActive ? "#D4638F" : "#B8A0AB"}
              className={isActive ? "scale-105" : ""}
            />
            <span
              className="text-[9px] font-extrabold tracking-tight"
              style={{
                fontFamily: "Albert Sans",
                color: isActive ? "#D4638F" : "#B8A0AB",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
