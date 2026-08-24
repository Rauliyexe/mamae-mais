import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Watch, Heart, Activity, Battery, Wifi, CheckCircle2, 
  AlertTriangle, ShieldCheck, Flame, Moon, Footprints, 
  Sparkles, X, RefreshCw, Zap
} from "lucide-react";

export default function SmartwatchModal() {
  const { 
    isSmartwatchModalOpen, 
    setIsSmartwatchModalOpen, 
    smartwatchState, 
    setSmartwatchState, 
    bpmHistory, 
    setSmartwatchScenario,
    triggerSOS,
    user
  } = useApp();

  const [activeDevice, setActiveDevice] = useState("Apple Watch Series 9");

  const devices = [
    { id: "apple", name: "Apple Watch Series 9", os: "watchOS 10.5", icon: "🍎" },
    { id: "galaxy", name: "Galaxy Watch 6", os: "Wear OS 4.0", icon: "⭐" },
    { id: "garmin", name: "Garmin Venu 3", os: "Garmin OS", icon: "🏃" },
  ];

  if (!isSmartwatchModalOpen) return null;

  const getBpmStatus = (bpm) => {
    if (bpm < 60) return { label: "Bradicardia Leve", color: "text-amber-500", bg: "bg-amber-50" };
    if (bpm <= 100) return { label: "Ritmo Sinusal Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (bpm <= 125) return { label: "Frequência Acelerada", color: "text-amber-600", bg: "bg-amber-50" };
    return { label: "⚠️ Taquicardia de Alerta", color: "text-red-600", bg: "bg-red-50" };
  };

  const status = getBpmStatus(smartwatchState.bpm);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-4 select-none font-albert animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl border border-[#F0DDE4] overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#3D2B33] to-[#4A4743] text-white p-4.5 px-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D4638F] shadow-inner">
              <Watch size={24} className="text-[#FBE8EF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-poppins font-bold text-[15px] tracking-wide text-white">
                  Telemetria Smartwatch
                </h3>
                <span className="bg-[#81C784] text-[#1B5E20] text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-ping" />
                  Conectado
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                {activeDevice} · Bateria {smartwatchState.battery}%
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSmartwatchModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin bg-[#FAF8F5]">
          
          {/* Main Heart Rate Live Display */}
          <div className="bg-gradient-to-br from-[#FAF3F6] via-white to-[#FAF3F6] p-5 rounded-[28px] border border-[#F0DDE4] shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10 mb-3">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#8C6B7A]">
                  Frequência Cardíaca Materna
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[44px] font-black font-poppins text-[#3D2B33] leading-none">
                    {smartwatchState.bpm}
                  </span>
                  <span className="text-[14px] font-bold text-[#8C6B7A]">BPM</span>
                </div>
              </div>

              {/* Pulsing Animated Heart */}
              <div className="w-16 h-16 rounded-3xl bg-white border border-[#F0DDE4] flex items-center justify-center text-[#D4638F] shadow-sm relative">
                <Heart 
                  size={32} 
                  className="fill-[#D4638F] animate-pulse" 
                  style={{ animationDuration: `${Math.max(0.4, 60 / smartwatchState.bpm)}s` }}
                />
              </div>
            </div>

            {/* Status Pill */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${status.bg} ${status.color} border border-current/20`}>
                {status.label}
              </span>
              <span className="text-[10px] text-[#8C6B7A] font-semibold flex items-center gap-1">
                <RefreshCw size={11} className="animate-spin text-[#D4638F]" />
                Sincronizando via Bluetooth
              </span>
            </div>

            {/* ECG Pulse Waveform Simulation */}
            <div className="h-14 w-full bg-[#3D2B33] rounded-2xl p-2 px-3 flex items-center justify-between relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:8px_8px]" />
              <svg className="w-full h-full text-[#81C784]" viewBox="0 0 300 40" preserveAspectRatio="none">
                <path
                  d="M 0,20 L 40,20 L 50,8 L 60,32 L 70,12 L 80,20 L 120,20 L 130,5 L 140,35 L 150,15 L 160,20 L 200,20 L 210,8 L 220,32 L 230,12 L 240,20 L 300,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Biometrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* SpO2 */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-xs">
              <div className="flex items-center gap-2 mb-1 text-[#1976D2]">
                <Activity size={16} />
                <span className="text-[10.5px] font-bold text-[#8C6B7A] uppercase">Oxigênio (SpO2)</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-black text-[#3D2B33] font-poppins">{smartwatchState.spo2}%</span>
                <span className="text-[10px] text-[#2E7D32] font-bold">Ideal</span>
              </div>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Saturação periférica contínua</p>
            </div>

            {/* Stress */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-xs">
              <div className="flex items-center gap-2 mb-1 text-[#8E24AA]">
                <Zap size={16} />
                <span className="text-[10.5px] font-bold text-[#8C6B7A] uppercase">Estresse (HRV)</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-black text-[#3D2B33] font-poppins">{smartwatchState.stress}%</span>
                <span className="text-[10px] text-[#8E24AA] font-bold">{smartwatchState.stressLabel.split(" ")[0]}</span>
              </div>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Variabilidade da FC</p>
            </div>

            {/* Skin Temp */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-xs">
              <div className="flex items-center gap-2 mb-1 text-[#E65100]">
                <Flame size={16} />
                <span className="text-[10.5px] font-bold text-[#8C6B7A] uppercase">Temp. Cutânea</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[22px] font-black text-[#3D2B33] font-poppins">{smartwatchState.skinTemp}°C</span>
                <span className="text-[10px] text-[#2E7D32] font-bold">Normal</span>
              </div>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Sensor térmico no pulso</p>
            </div>

            {/* Fall & Safety Detection */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-xs">
              <div className="flex items-center gap-2 mb-1 text-[#2E7D32]">
                <ShieldCheck size={16} />
                <span className="text-[10.5px] font-bold text-[#8C6B7A] uppercase">Detecção Queda</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[16px] font-black text-[#2E7D32] font-poppins">Armado</span>
              </div>
              <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">Gatilho automático de SOS</p>
            </div>
          </div>

          {/* Scenario Simulation Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-[#F0DDE4] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[12px] font-bold text-[#3D2B33] font-poppins flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D4638F]" />
                Simular Cenários Fisiológicos
              </h4>
              <span className="text-[9.5px] font-extrabold text-[#D4638F] bg-[#FBE8EF] px-2 py-0.5 rounded-full">
                Laboratório
              </span>
            </div>
            <p className="text-[10.5px] text-[#8C6B7A] leading-snug">
              Alterne os estados abaixo para simular a resposta do relógio e os alertas clínicos automáticos:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setSmartwatchScenario("repouso")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  smartwatchState.scenario === "repouso"
                    ? "bg-[#D4638F] text-white border-[#D4638F] shadow-xs"
                    : "bg-[#FAF3F6]/50 text-[#3D2B33] border-[#F0DDE4] hover:bg-[#FAF3F6]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Moon size={13} /> Repouso (74 BPM)
                </div>
                <p className={`text-[9px] mt-0.5 ${smartwatchState.scenario === "repouso" ? "text-white/80" : "text-[#8C6B7A]"}`}>
                  Relaxamento e calma
                </p>
              </button>

              <button
                onClick={() => setSmartwatchScenario("caminhada")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  smartwatchState.scenario === "caminhada"
                    ? "bg-[#D4638F] text-white border-[#D4638F] shadow-xs"
                    : "bg-[#FAF3F6]/50 text-[#3D2B33] border-[#F0DDE4] hover:bg-[#FAF3F6]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Footprints size={13} /> Caminhada (96 BPM)
                </div>
                <p className={`text-[9px] mt-0.5 ${smartwatchState.scenario === "caminhada" ? "text-white/80" : "text-[#8C6B7A]"}`}>
                  Exercício moderado
                </p>
              </button>

              <button
                onClick={() => setSmartwatchScenario("ansiedade")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  smartwatchState.scenario === "ansiedade"
                    ? "bg-[#E65100] text-white border-[#E65100] shadow-xs"
                    : "bg-[#FAF3F6]/50 text-[#3D2B33] border-[#F0DDE4] hover:bg-[#FAF3F6]"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Zap size={13} /> Ansiedade (118 BPM)
                </div>
                <p className={`text-[9px] mt-0.5 ${smartwatchState.scenario === "ansiedade" ? "text-white/80" : "text-[#8C6B7A]"}`}>
                  Pico de estresse
                </p>
              </button>

              <button
                onClick={() => setSmartwatchScenario("critico")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  smartwatchState.scenario === "critico"
                    ? "bg-red-600 text-white border-red-600 shadow-xs animate-pulse"
                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <AlertTriangle size={13} /> Alerta Crítico (142 BPM)
                </div>
                <p className={`text-[9px] mt-0.5 ${smartwatchState.scenario === "critico" ? "text-white/80" : "text-red-600/70"}`}>
                  Dispara sugestão SOS
                </p>
              </button>
            </div>
          </div>

          {/* Critical Scenario SOS trigger banner */}
          {smartwatchState.scenario === "critico" && (
            <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 animate-fadeIn space-y-2.5">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                <AlertTriangle size={16} />
                <span>Anomalia Cardíaca Detectada no Smartwatch</span>
              </div>
              <p className="text-[11px] text-red-800 leading-snug">
                Os sensores registraram frequência cardíaca acima de 140 BPM em repouso. Deseja acionar o protocolo de emergência SOS?
              </p>
              <button
                onClick={() => {
                  setIsSmartwatchModalOpen(false);
                  triggerSOS("Taquicardia Detectada pelo Smartwatch (>140 BPM)");
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🚨 Acionar SOS Obstétrico Agora
              </button>
            </div>
          )}

          {/* Device Model Selector */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#F0DDE4] shadow-xs">
            <label className="text-[10.5px] font-bold text-[#8C6B7A] uppercase block mb-2">
              Dispositivo Vinculado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDevice(d.name)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    activeDevice === d.name
                      ? "bg-[#FAF3F6] text-[#D4638F] border-[#D4638F] font-bold"
                      : "bg-white text-[#8C6B7A] border-[#F0DDE4] font-medium hover:bg-[#FAF3F6]/50"
                  }`}
                >
                  <span className="text-[14px] block mb-0.5">{d.icon}</span>
                  <span className="text-[10px] block truncate">{d.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#F0DDE4] flex justify-end shrink-0">
          <button
            onClick={() => setIsSmartwatchModalOpen(false)}
            className="bg-[#D4638F] hover:bg-[#B84D75] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
}
