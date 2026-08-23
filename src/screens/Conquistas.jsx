import React from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { 
  Lock, Trophy, BookOpen, Award, Droplet, Heart, MessageSquare, Users, Activity, Sparkles, Smile, Scale, Calendar, CheckCircle2 
} from "lucide-react";

export default function Conquistas() {
  const { unlockedAchievements, ACHIEVEMENTS_LIST } = useApp();

  const totalUnlocked = unlockedAchievements.length;
  const totalAchievements = ACHIEVEMENTS_LIST.length;
  const progressPct = Math.round((totalUnlocked / totalAchievements) * 100);

  const renderAchIcon = (iconName) => {
    const props = { size: 22, className: "text-[#C38B9B]" };
    switch (iconName) {
      case "BookOpen": return <BookOpen {...props} />;
      case "Award": return <Award {...props} />;
      case "Droplet": return <Droplet {...props} />;
      case "Heart": return <Heart {...props} />;
      case "MessageSquare": return <MessageSquare {...props} />;
      case "Users": return <Users {...props} />;
      case "Activity": return <Activity {...props} />;
      case "Sparkles": return <Sparkles {...props} />;
      case "Smile": return <Smile {...props} />;
      case "Scale": return <Scale {...props} />;
      case "Calendar": return <Calendar {...props} />;
      case "CheckCircle2": return <CheckCircle2 {...props} />;
      default: return <Trophy {...props} />;
    }
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FAF8F5]">
      <TopBar title="Conquistas" showBack={true} />

      {/* Progress Summary Card */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#C38B9B] uppercase tracking-wider">Progresso Geral</p>
              <h3 className="text-[#3D2B33] font-bold text-[20px] font-poppins mt-0.5">
                {totalUnlocked} <span className="text-[14px] text-[#8C6B7A] font-semibold">de {totalAchievements}</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FAF3F6] flex items-center justify-center shadow-sm">
              <Trophy size={22} className="text-[#C38B9B]" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#FAF3F6] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E5E1DB] to-[#C38B9B] rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[#8C6B7A] mt-1.5 font-bold text-right">{progressPct}% completo</p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="px-5 mt-4">
        <h3 className="text-[14px] font-bold text-[#3D2B33] font-poppins mb-3 px-0.5">
          Todas as Conquistas
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-card p-4 border flex flex-col items-center text-center gap-2 transition-all duration-300 ${
                  isUnlocked
                    ? "bg-white shadow-mamae border-[#C38B9B]/20"
                    : "bg-[#FAF3F6]/40 border-[#F0DDE4] opacity-60"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  isUnlocked ? "bg-[#FAF3F6]" : "bg-[#F0DDE4]/50"
                }`}>
                  {isUnlocked ? renderAchIcon(ach.icon) : <Lock size={18} className="text-[#B8A0AB]" />}
                </div>
                <div>
                  <h4 className={`text-[11.5px] font-bold font-poppins leading-tight ${
                    isUnlocked ? "text-[#3D2B33]" : "text-[#B8A0AB]"
                  }`}>
                    {ach.title}
                  </h4>
                  <p className={`text-[9.5px] mt-0.5 font-medium leading-snug ${
                    isUnlocked ? "text-[#8C6B7A]" : "text-[#B8A0AB]"
                  }`}>
                    {ach.description}
                  </p>
                </div>
                {isUnlocked && (
                  <span className="text-[8px] font-extrabold text-[#C38B9B] bg-[#FAF3F6] px-2 py-0.5 rounded-full uppercase">
                    ✓ Desbloqueada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
