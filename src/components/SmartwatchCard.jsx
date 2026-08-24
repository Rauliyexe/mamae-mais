import React from "react";
import { useApp } from "../context/AppContext";
import { Watch, Heart, Activity, Zap, ChevronRight } from "lucide-react";

export default function SmartwatchCard() {
  const { smartwatchState, setIsSmartwatchModalOpen } = useApp();

  return (
    <div 
      onClick={() => setIsSmartwatchModalOpen(true)}
      className="bg-white rounded-card p-4 shadow-mamae border border-[#F0DDE4] hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] group"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FAF3F6] border border-[#F0DDE4] flex items-center justify-center text-[#D4638F]">
            <Watch size={17} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[12.5px] font-bold text-[#3D2B33] font-poppins leading-tight">
                {smartwatchState.deviceName || "Relógio Conectado"}
              </h4>
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
            </div>
            <p className="text-[10px] text-[#8C6B7A] font-semibold">
              Telemetria Materna em Tempo Real
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold text-[#D4638F] bg-[#FBE8EF] px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-[#D4638F] group-hover:text-white transition-colors">
          <span>Ver Métricas</span>
          <ChevronRight size={11} />
        </span>
      </div>

      {/* Main Metric Strip */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0DDE4]/60">
        {/* Heart Rate */}
        <div className="bg-[#FAF3F6]/50 p-2.5 rounded-2xl border border-[#F0DDE4]/50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#D4638F] shadow-xs shrink-0">
            <Heart 
              size={15} 
              className="fill-[#D4638F] animate-pulse" 
              style={{ animationDuration: `${Math.max(0.4, 60 / smartwatchState.bpm)}s` }}
            />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-[#8C6B7A] font-bold block uppercase">Pulso</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[14px] font-black text-[#3D2B33] font-poppins">{smartwatchState.bpm}</span>
              <span className="text-[8.5px] text-[#8C6B7A] font-bold">BPM</span>
            </div>
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-[#FAF3F6]/50 p-2.5 rounded-2xl border border-[#F0DDE4]/50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#1976D2] shadow-xs shrink-0">
            <Activity size={15} />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-[#8C6B7A] font-bold block uppercase">Oxigênio</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[14px] font-black text-[#3D2B33] font-poppins">{smartwatchState.spo2}%</span>
              <span className="text-[8.5px] text-[#2E7D32] font-bold">SpO2</span>
            </div>
          </div>
        </div>

        {/* Stress */}
        <div className="bg-[#FAF3F6]/50 p-2.5 rounded-2xl border border-[#F0DDE4]/50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#8E24AA] shadow-xs shrink-0">
            <Zap size={15} />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] text-[#8C6B7A] font-bold block uppercase">Estresse</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[14px] font-black text-[#3D2B33] font-poppins">{smartwatchState.stress}%</span>
              <span className="text-[8.5px] text-[#8E24AA] font-bold">HRV</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
