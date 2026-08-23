import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PREGNANCY_DATA } from "../../data/mockData";
import { 
  Heart, Sparkles, Ruler, Scale, Eye, Activity, 
  ChevronLeft, ChevronRight, Info, CheckCircle2 
} from "lucide-react";

export default function TelemetryWidget() {
  const { currentWeek, setWeek, trimester } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weekData = PREGNANCY_DATA.weeks[selectedWeek] || {
    size: "Desenvolvimento fetal",
    weight: "140g",
    length: "13cm",
    dev: "O bebê agora consegue ouvir sua voz e engolir líquido amniótico.",
  };

  // Heartbeat approximation for gestational weeks
  const getBpmRange = (wk) => {
    if (wk <= 9) return "160 - 180";
    if (wk <= 20) return "140 - 160";
    if (wk <= 30) return "130 - 150";
    return "120 - 140";
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#F0DDE4] shadow-sm flex flex-col justify-between font-albert relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FAF3F6] to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4A4743] font-poppins">
              Telemetria & Biometria Fetal
            </h3>
            <p className="text-[11px] text-[#8C6B7A]">Monitoramento semanal de marcos anatômicos</p>
          </div>
        </div>

        {/* Week Selector buttons */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2 py-1 rounded-xl border border-[#F0DDE4]">
          <button 
            onClick={() => setSelectedWeek(prev => Math.max(4, prev - 1))}
            className="w-6 h-6 rounded-lg bg-white text-[#C38B9B] hover:bg-[#FAF3F6] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
            disabled={selectedWeek <= 4}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-extrabold text-[#4A4743] px-1 font-poppins">
            Semana {selectedWeek}
          </span>
          <button 
            onClick={() => setSelectedWeek(prev => Math.min(42, prev + 1))}
            className="w-6 h-6 rounded-lg bg-white text-[#C38B9B] hover:bg-[#FAF3F6] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
            disabled={selectedWeek >= 42}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Telemetry Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-4 relative z-10">
        {/* Visual Fetal Hologram / Silhouette Box */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#FAF8F5] to-[#FAF3F6] p-5 rounded-2xl border border-[#F0DDE4] flex flex-col items-center justify-center text-center shadow-inner relative group">
          <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-3 relative group-hover:scale-105 transition-transform duration-300">
            <Activity size={32} className="text-[#C38B9B] animate-pulse" />
            {/* Heartbeat pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-[#C38B9B] animate-ping opacity-25" />
          </div>

          <span className="text-[10px] font-extrabold text-[#C38B9B] uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full shadow-2xs border border-[#F0DDE4] mb-1">
            Tamanho de uma {weekData.size}
          </span>
          <h4 className="text-base font-extrabold text-[#4A4743] font-poppins">
            {selectedWeek}ª Semana de Vida
          </h4>
          <p className="text-[11px] text-[#8C6B7A] mt-0.5">
            {selectedWeek <= 13 ? "1º Trimestre · Formação Vital" : selectedWeek <= 26 ? "2º Trimestre · Crescimento Acelerado" : "3º Trimestre · Maturação Final"}
          </p>
        </div>

        {/* Biometric Readings Grid */}
        <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
          {/* Estimated Weight */}
          <div className="bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
            <div className="flex items-center gap-1.5 text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <Scale size={13} className="text-[#C38B9B]" />
              Peso Estimado
            </div>
            <p className="text-lg font-extrabold text-[#3D2B33] font-poppins">{weekData.weight}</p>
            <p className="text-[10px] text-[#8C6B7A]">Média obstétrica</p>
          </div>

          {/* Estimated Length */}
          <div className="bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
            <div className="flex items-center gap-1.5 text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <Ruler size={13} className="text-[#C38B9B]" />
              Comprimento
            </div>
            <p className="text-lg font-extrabold text-[#3D2B33] font-poppins">{weekData.length}</p>
            <p className="text-[10px] text-[#8C6B7A]">Coroa ao calcanhar</p>
          </div>

          {/* Heart Rate / BPM Estimate */}
          <div className="bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
            <div className="flex items-center gap-1.5 text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <Heart size={13} className="text-[#E53E3E] fill-[#E53E3E] animate-pulse" />
              Batimentos (BPM)
            </div>
            <p className="text-lg font-extrabold text-[#3D2B33] font-poppins">{getBpmRange(selectedWeek)} <span className="text-xs font-normal">bpm</span></p>
            <p className="text-[10px] text-[#38A169] font-medium">Ritmo cardíaco saudável</p>
          </div>

          {/* Auditory / Senses Readiness */}
          <div className="bg-[#FAF3F6]/50 p-3 rounded-2xl border border-[#F0DDE4]">
            <div className="flex items-center gap-1.5 text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <Eye size={13} className="text-[#3182CE]" />
              Sensibilidade
            </div>
            <p className="text-xs font-extrabold text-[#3D2B33] font-poppins mt-1">Reconhece Sons & Voz</p>
            <p className="text-[10px] text-[#8C6B7A]">Conexão sensorial ativa</p>
          </div>
        </div>
      </div>

      {/* Developmental Highlights Description */}
      <div className="bg-[#FAF3F6]/50 p-3.5 rounded-2xl border border-[#F0DDE4] relative z-10 flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center shrink-0 mt-0.5">
          <Info size={14} />
        </div>
        <div>
          <h5 className="text-xs font-bold text-[#4A4743] font-poppins">Marco do Desenvolvimento</h5>
          <p className="text-xs text-[#523A46] leading-relaxed mt-0.5">{weekData.dev}</p>
        </div>
      </div>
    </div>
  );
}
