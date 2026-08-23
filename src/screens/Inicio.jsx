import React, { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { PREGNANCY_DATA } from "../data/mockData";
import { Smile, Meh, Frown, Laugh, Play, ChevronRight, Activity, BookOpen, Sparkles, CalendarHeart } from "lucide-react";

const MOODS = [
  { key: "triste", label: "Triste", Icon: Frown },
  { key: "confusa", label: "Confusa", Icon: Meh },
  { key: "bem", label: "Bem", Icon: Smile },
  { key: "otima", label: "Ótima", Icon: Laugh },
];

export default function Inicio() {
  const { user, currentWeek, daysRemaining, progressPercent, trimester, mood, setMood, navigate } = useApp();

  const selectedWeekInfo = PREGNANCY_DATA.weeks[currentWeek] || {
    size: "Desconhecido", weight: "N/A", length: "N/A", dev: "Desenvolvimento contínuo."
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn relative bg-[#FAF8F5]">
      <TopBar title={`Olá, ${user.name.split(" ")[0]}`} />

      {/* Gestational Progress Section (Module 2) */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#C38B9B] text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {trimester}º Trimestre
                </span>
                <span className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">
                  Semana {currentWeek}
                </span>
              </div>
              <h2 className="text-[#3D2B33] font-bold text-[18px] font-poppins mt-1 flex items-center gap-2">
                Faltam {daysRemaining} dias <CalendarHeart size={18} className="text-[#C38B9B]" />
              </h2>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#FAF3F6]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#C38B9B] transition-all duration-1000 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-[10px] font-extrabold text-[#C38B9B]">
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Baby Size Card */}
          <div className="pt-3.5 border-t border-[#F0DDE4] flex gap-4 items-center bg-gradient-to-r from-[#FAF3F6] to-white p-3 rounded-2xl border border-[#F0DDE4]/60">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#C38B9B] shadow-sm shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8C6B7A] uppercase tracking-wider">O bebê é do tamanho de:</p>
              <h3 className="text-[#4A4743] font-bold text-[15px] font-poppins">
                {selectedWeekInfo.size}
              </h3>
              <p className="text-[11.5px] text-[#3D2B33] mt-0.5 leading-none font-bold">
                {selectedWeekInfo.weight} · {selectedWeekInfo.length}
              </p>
            </div>
          </div>
          
          <p className="text-[12px] text-[#3D2B33] mt-3 leading-relaxed bg-[#FAF3F6]/20 rounded-xl p-3 border border-[#F0DDE4]/40 font-medium">
            {selectedWeekInfo.dev}
          </p>
        </div>
      </div>

      {/* AI Assistant Promo Banner */}
      <div className="px-5 mt-4">
        <button
          onClick={() => navigate("chatia")}
          className="w-full bg-gradient-to-r from-[#E5E1DB] to-[#C38B9B] text-white rounded-card p-4 text-left shadow-mamae border border-[#C38B9B]/10 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="flex-1 pr-3">
            <span className="inline-flex items-center gap-1 bg-white/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-1">
              <Sparkles size={9} className="fill-white" /> Inteligência Artificial
            </span>
            <h4 className="text-[14.5px] font-bold font-poppins leading-tight">Dúvidas na gestação?</h4>
            <p className="text-[11px] text-white/90 leading-tight mt-1 font-medium">
              Converse com a Nina AI e receba orientações clínicas na hora.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
            <Sparkles size={20} className="text-white fill-white/20" />
          </div>
        </button>
      </div>

      {/* Shortcuts Grid */}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={() => navigate("saude")}
            className="bg-white rounded-card p-4 flex items-center gap-3.5 text-left border border-[#F0DDE4] shadow-mamae hover:bg-[#FAF3F6] active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3F6] border border-[#F0DDE4]/50 flex items-center justify-center shrink-0">
              <Activity size={17} className="text-[#C38B9B]" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#3D2B33] font-poppins">Saúde</h4>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5 font-extrabold uppercase">Estatísticas</p>
            </div>
          </button>

          <button
            onClick={() => navigate("receitas")}
            className="bg-white rounded-card p-4 flex items-center gap-3.5 text-left border border-[#F0DDE4] shadow-mamae hover:bg-[#FAF3F6] active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3F6] border border-[#F0DDE4]/50 flex items-center justify-center shrink-0">
              <BookOpen size={17} className="text-[#C38B9B]" />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#3D2B33] font-poppins">Receitas</h4>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5 font-extrabold uppercase">Nutrição</p>
            </div>
          </button>
        </div>
      </div>

      {/* Mood Selector Section (Module 4) */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4]">
          <h3 className="text-[13.5px] font-bold text-[#3D2B33] mb-3 px-0.5 font-poppins">
            Como você está se sentindo hoje?
          </h3>
          <div className="flex justify-between">
            {MOODS.map(({ key, label, Icon }) => {
              const isActive = mood === key;
              return (
                <button
                  key={key}
                  onClick={() => setMood(key)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
                >
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-[#F0DDE4]/20"
                    style={{
                      backgroundColor: isActive ? "#C38B9B" : "#FAF3F6",
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    <Icon 
                      size={23} 
                      color={isActive ? "#ffffff" : "#C38B9B"} 
                      strokeWidth={2.4} 
                    />
                  </div>
                  <span
                    className="text-[10.5px] font-bold group-hover:text-[#C38B9B] transition-colors"
                    style={{ color: isActive ? "#C38B9B" : "#8C6B7A" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Carousel */}
      <div className="mt-5">
        <div className="px-5 flex items-center justify-between mb-3">
          <h3 className="text-[14.5px] font-bold text-[#3D2B33] font-poppins">
            Conteúdos para você
          </h3>
          <button className="text-[11px] font-bold text-[#C38B9B] flex items-center gap-0.5 cursor-pointer">
            Ver todos <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2.5 pl-5 pr-5 scrollbar-thin">
          {PREGNANCY_DATA.conteudos.map((c) => (
            <div 
              key={c.id} 
              className="shrink-0 w-[155px] rounded-[18px] overflow-hidden bg-white shadow-mamae border border-[#F0DDE4] hover:shadow-md transition duration-200 cursor-pointer"
            >
              <div 
                className="h-[95px] flex items-center justify-center relative transition-all duration-300"
                style={{ backgroundColor: c.color }}
              >
                {c.tag === "Vídeo" && (
                  <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                    <Play size={14} className="text-[#C38B9B] fill-[#C38B9B]" />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-[#C38B9B]">
                  {c.tag}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[11.5px] font-bold text-[#3D2B33] leading-snug line-clamp-2 h-8" style={{ fontFamily: "Albert Sans" }}>
                  {c.title}
                </p>
                <p className="text-[9px] text-[#8C6B7A] mt-1 font-semibold uppercase">{c.readTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipes Carousel */}
      <div className="mt-5">
        <div className="px-5 flex items-center justify-between mb-3">
          <h3 className="text-[14.5px] font-bold text-[#3D2B33] font-poppins">
            Receitas para você
          </h3>
          <button 
            onClick={() => navigate("receitas")} 
            className="text-[11px] font-bold text-[#C38B9B] flex items-center gap-0.5 cursor-pointer"
          >
            Ver todas <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-2.5 pl-5 pr-5 scrollbar-thin">
          {PREGNANCY_DATA.receitas.slice(0, 3).map((r) => (
            <div 
              key={r.id} 
              onClick={() => navigate("receitas")}
              className="shrink-0 w-[145px] rounded-[18px] overflow-hidden bg-white shadow-mamae border border-[#F0DDE4] cursor-pointer hover:shadow-md transition duration-200"
            >
              <div 
                className="h-[85px] transition-all duration-300"
                style={{ backgroundColor: r.imageColor }}
              />
              <div className="p-3">
                <p className="text-[11px] font-bold text-[#3D2B33] leading-snug line-clamp-2 h-8" style={{ fontFamily: "Albert Sans" }}>
                  {r.title}
                </p>
                <p className="text-[9px] text-[#C38B9B] mt-1 font-bold">{r.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
