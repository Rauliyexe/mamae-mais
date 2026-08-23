import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  TrendingUp, Droplet, Activity, Smile, Plus, Play, Square, 
  Check, ArrowUpRight, Scale, Clock, Frown, Meh
} from "lucide-react";

export default function HealthAnalyticsWidget() {
  const { 
    weightHistory, addWeight, currentWeek,
    kickSessions, activeKickSession, startKickSession, registerKick, endKickSession,
    mood, setMood, getMoodStats
  } = useApp();

  const [newWeightVal, setNewWeightVal] = useState("");
  const [waterCups, setWaterCups] = useState(6); // 6 x 250ml = 1.5L
  const [waterGoal] = useState(10); // 2.5L

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!newWeightVal || isNaN(newWeightVal)) return;
    addWeight(newWeightVal);
    setNewWeightVal("");
  };

  const latestWeight = weightHistory?.[0]?.value || 64.8;
  const prevWeight = weightHistory?.[1]?.value || 64.2;
  const weightDiff = (latestWeight - prevWeight).toFixed(1);

  const moodStats = getMoodStats(7);

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#F0DDE4] shadow-sm flex flex-col justify-between font-albert">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FAF3F6] text-[#C38B9B] flex items-center justify-center font-bold">
            <Activity size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4A4743] font-poppins">
              Analytics de Saúde & Atividade Materna
            </h3>
            <p className="text-[11px] text-[#8C6B7A]">Métricas biométricas e registros diários</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3">
        {/* 1. Weight Progression Card */}
        <div className="bg-[#FAF3F6]/50 p-4 rounded-2xl border border-[#F0DDE4] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <span className="flex items-center gap-1"><Scale size={13} className="text-[#C38B9B]" /> Evolução de Peso</span>
              <span className={`text-[10px] font-bold ${weightDiff >= 0 ? "text-[#38A169]" : "text-[#C38B9B]"} flex items-center`}>
                {weightDiff >= 0 ? `+${weightDiff}kg` : `${weightDiff}kg`}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[#3D2B33] font-poppins">{latestWeight} <span className="text-sm font-normal text-[#8C6B7A]">kg</span></p>
            <p className="text-[10.5px] text-[#8C6B7A] mt-0.5">Semana {currentWeek} · Ganho adequado</p>
          </div>

          <form onSubmit={handleAddWeight} className="flex gap-1.5 mt-3 pt-2 border-t border-[#F0DDE4]">
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 65.2"
              value={newWeightVal}
              onChange={(e) => setNewWeightVal(e.target.value)}
              className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-[#F0DDE4] text-xs font-bold text-[#3D2B33] focus:outline-none focus:border-[#C38B9B]"
            />
            <button
              type="submit"
              className="bg-[#C38B9B] hover:bg-[#A87483] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              Salvar
            </button>
          </form>
        </div>

        {/* 2. Hydration Tracker */}
        <div className="bg-[#FAF3F6]/50 p-4 rounded-2xl border border-[#F0DDE4] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <span className="flex items-center gap-1"><Droplet size={13} className="text-[#3182CE]" /> Hidratação</span>
              <span className="text-[10px] font-bold text-[#3182CE]">
                {((waterCups / waterGoal) * 100).toFixed(0)}% da meta
              </span>
            </div>
            <p className="text-2xl font-extrabold text-[#3D2B33] font-poppins">
              {(waterCups * 0.25).toFixed(1)} <span className="text-sm font-normal text-[#8C6B7A]">/ {(waterGoal * 0.25).toFixed(1)}L</span>
            </p>
            <p className="text-[10.5px] text-[#8C6B7A] mt-0.5">{waterCups} de {waterGoal} copos diários</p>
          </div>

          {/* Progress bar and quick add */}
          <div className="mt-3 pt-2 border-t border-[#F0DDE4]">
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-[#3182CE] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterCups / waterGoal) * 100)}%` }}
              />
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setWaterCups(prev => Math.min(waterGoal + 4, prev + 1))}
                className="flex-1 bg-white hover:bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8] py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
              >
                <Plus size={12} /> +250ml
              </button>
              <button
                type="button"
                onClick={() => setWaterCups(0)}
                className="text-[10px] text-[#8C6B7A] hover:text-[#C53030] px-1.5 py-1"
                title="Resetar contagem"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* 3. Live Kick Counter Console */}
        <div className="bg-[#FAF3F6]/50 p-4 rounded-2xl border border-[#F0DDE4] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8C6B7A] text-[10px] font-bold uppercase mb-1">
              <span className="flex items-center gap-1"><Activity size={13} className="text-[#38A169]" /> Contador de Chutes</span>
              {activeKickSession && (
                <span className="inline-flex items-center text-[9px] font-bold text-[#38A169] bg-[#F0FFF4] px-1.5 py-0.5 rounded-full border border-[#C6F6D5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38A169] animate-ping mr-1" />
                  GRAVANDO
                </span>
              )}
            </div>

            {activeKickSession ? (
              <div>
                <p className="text-2xl font-extrabold text-[#38A169] font-poppins">
                  {activeKickSession.kicks.length} <span className="text-xs font-normal text-[#8C6B7A]">movimentos</span>
                </p>
                <p className="text-[10.5px] text-[#8C6B7A] mt-0.5 flex items-center gap-1">
                  <Clock size={11} /> Sessão em andamento
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-extrabold text-[#3D2B33] font-poppins">
                  {kickSessions?.length || 0} <span className="text-xs font-normal text-[#8C6B7A]">sessões</span>
                </p>
                <p className="text-[10.5px] text-[#8C6B7A] mt-0.5">Pronta para nova contagem</p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-[#F0DDE4] flex gap-1.5">
            {activeKickSession ? (
              <>
                <button
                  type="button"
                  onClick={registerKick}
                  className="flex-1 bg-[#38A169] hover:bg-[#2F855A] text-white py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Activity size={13} /> Chute! (+1)
                </button>
                <button
                  type="button"
                  onClick={endKickSession}
                  className="bg-white hover:bg-[#FFF5F5] text-[#C53030] border border-[#FEB2B2] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="Finalizar e Salvar Sessão"
                >
                  <Square size={12} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startKickSession}
                className="w-full bg-[#FAF3F6] hover:bg-[#F5ECEF] text-[#4A4743] py-1.5 rounded-xl text-xs font-extrabold transition-all border border-[#F0DDE4] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Play size={12} className="text-[#C38B9B]" /> Iniciar Sessão no Cockpit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mood Fast Selector Ribbon */}
      <div className="bg-[#FAF3F6]/50 px-4 py-2.5 rounded-2xl border border-[#F0DDE4] flex items-center justify-between">
        <span className="text-xs font-bold text-[#4A4743] flex items-center gap-1.5">
          <Smile size={14} className="text-[#C38B9B]" />
          Como você está se sentindo hoje?
        </span>
        <div className="flex gap-2">
          {[
            { key: "triste", Icon: Frown, label: "Triste" },
            { key: "confusa", Icon: Meh, label: "Confusa" },
            { key: "bem", Icon: Smile, label: "Bem" },
            { key: "otima", Icon: Smile, label: "Ótima" },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMood(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                mood === key
                  ? "bg-[#C38B9B] text-white shadow-sm scale-105"
                  : "bg-white text-[#4A4743] border border-[#F0DDE4] hover:bg-[#FAF3F6]"
              }`}
            >
              <Icon size={14} className={mood === key ? "text-white" : "text-[#C38B9B]"} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
