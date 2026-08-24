import React, { useState, useEffect } from "react";
import PresenzLogo, { PresenzIcon } from "./PresenzLogo";
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, HeartPulse, Activity,
  Maximize2, Radio, MessageSquare, Sparkles, ShieldCheck, Share2,
  FileText, Check, AlertCircle, X, Volume2
} from "lucide-react";

export default function PresenzTelemedModal({ isOpen, onClose, patient, doctorUser }) {
  if (!isOpen || !patient) return null;

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(128); // seconds
  const [activeHUDTab, setActiveHUDTab] = useState("vitals"); // 'vitals' | 'notes' | 'ai'
  
  // Real-time bio telemetry state
  const [currentHR, setCurrentHR] = useState(patient.specialty === "obstetricia" ? 144 : 78);
  const [consultNotes, setConsultNotes] = useState("");
  const [aiTranscript, setAiTranscript] = useState([
    { speaker: "Médico", text: "Olá, como você tem se sentido desde nossa última conversa?", time: "00:15" },
    { speaker: patient.name.split(" ")[0], text: "Tive um pouco de cansaço no final do dia, mas a pressão ficou estável.", time: "00:32" },
    { speaker: "Médico", text: "Perfeito, seus dados no Smart Tag mostram oximetria e batimentos excelentes.", time: "00:58" },
  ]);
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  // Call timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleGenerateAISummary = () => {
    setIsAiSummarizing(true);
    setTimeout(() => {
      setAiSummary(`Resumo Clínico da Teleconsulta com ${patient.name}: Paciente refere estabilização dos sintomas e boa adesão medicamentosa. Telemetria em tempo real demonstra sinais vitais preservados (FC ${currentHR} bpm, SpO2 99%, PA ${patient.vitals?.bp || "120/80"}). Conduta: manter orientações prévias e reavaliação agendada.`);
      setIsAiSummarizing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050C0E]/90 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fadeIn font-albert">
      <div className="bg-[#0F1E22] border border-[#7EC8C0]/30 rounded-[32px] w-full max-w-6xl h-[94vh] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Top Telemed Bar */}
        <div className="bg-[#14262C] border-b border-[#7EC8C0]/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PresenzIcon size={32} />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 font-poppins">
                  TELECONSULTA PRESENZ AO VIVO · {formatTimer(callDuration)}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] font-extrabold">
                  CRIPTO END-TO-END
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-poppins">
                Atendimento: {patient.name} ({patient.specialtyLabel})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8CA9B0] hidden sm:inline">
              Dr. {doctorUser?.name || "Leonardo Pinto"} (CRM/{doctorUser?.uf || "SP"} {doctorUser?.crm || "184920"})
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#0A1619] hover:bg-[#7EC8C0]/20 text-[#A6C5CB] hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Telemedicine Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#0A1518]">
          
          {/* Left / Center: Video Stream */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0C191C] to-[#071012]">
            
            {/* Patient Video Simulation Frame */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#7EC8C0]/20 bg-[#081214] flex items-center justify-center shadow-inner">
              {isVideoOn ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&auto=format&fit=crop&q=80"
                    alt="Paciente em Telemedicina"
                    className="w-full h-full object-cover opacity-85"
                  />

                  {/* Telemetry HUD Badge over video */}
                  <div className="absolute top-4 left-4 bg-[#091518]/85 backdrop-blur-md p-3 rounded-2xl border border-[#7EC8C0]/30 shadow-lg space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8BE3D7]">
                      <HeartPulse size={16} className="text-[#7EC8C0] animate-pulse" />
                      <span>{patient.specialty === "obstetricia" ? "FCF Fetal: 144 BPM" : `FC Paciente: ${currentHR} BPM`}</span>
                    </div>
                    <div className="text-[10px] text-[#A6C5CB] flex gap-3">
                      <span>PA: {patient.vitals?.bp || "118/76"}</span>
                      <span>SpO2: {patient.vitals?.spo2 || "99%"}</span>
                    </div>
                  </div>

                  {/* Doctor Picture-in-Picture */}
                  <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-40 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#7EC8C0] shadow-2xl bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
                      alt="Médico"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-2 text-[9px] bg-black/60 px-1.5 py-0.2 rounded text-white font-mono">
                      Você (CRM)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#162B30] flex items-center justify-center text-[#7EC8C0] border border-[#7EC8C0]/40">
                    <VideoOff size={32} />
                  </div>
                  <p className="text-white font-bold text-sm">Câmera desativada</p>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3.5 rounded-2xl transition cursor-pointer shadow-md ${
                  isMicOn ? "bg-[#162B30] text-[#7EC8C0] hover:bg-[#1E3940]" : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3.5 rounded-2xl transition cursor-pointer shadow-md ${
                  isVideoOn ? "bg-[#162B30] text-[#7EC8C0] hover:bg-[#1E3940]" : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <PhoneOff size={16} />
                <span>Encerrar Teleconsulta</span>
              </button>
            </div>
          </div>

          {/* Right: Real-Time Clinical HUD & AI Assistant */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#7EC8C0]/20 bg-[#0E1B1F] p-4 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-4">
              {/* HUD Tabs */}
              <div className="grid grid-cols-3 p-1 bg-[#091518] rounded-xl border border-[#7EC8C0]/20 text-[11px] font-bold font-poppins">
                <button
                  onClick={() => setActiveHUDTab("vitals")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${activeHUDTab === "vitals" ? "bg-[#7EC8C0] text-[#0C1618] font-black" : "text-[#A6C5CB]"}`}
                >
                  Sinais Vitais
                </button>
                <button
                  onClick={() => setActiveHUDTab("notes")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${activeHUDTab === "notes" ? "bg-[#7EC8C0] text-[#0C1618] font-black" : "text-[#A6C5CB]"}`}
                >
                  Anotações
                </button>
                <button
                  onClick={() => setActiveHUDTab("ai")}
                  className={`py-1.5 rounded-lg transition cursor-pointer ${activeHUDTab === "ai" ? "bg-[#7EC8C0] text-[#0C1618] font-black" : "text-[#A6C5CB]"}`}
                >
                  Transcrição IA
                </button>
              </div>

              {/* 1. SINAIS VITAIS EM TEMPO REAL */}
              {activeHUDTab === "vitals" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/20 space-y-2">
                    <span className="text-[10px] font-bold text-[#7EC8C0] uppercase tracking-wider">Bio-Monitor Presenz</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#122227] p-2 rounded-xl">
                        <span className="text-[#8CA9B0] text-[10px]">Freq. Cardíaca</span>
                        <p className="font-bold text-white text-sm">{currentHR} BPM</p>
                      </div>
                      <div className="bg-[#122227] p-2 rounded-xl">
                        <span className="text-[#8CA9B0] text-[10px]">Oximetria SpO2</span>
                        <p className="font-bold text-[#8BE3D7] text-sm">99%</p>
                      </div>
                      <div className="bg-[#122227] p-2 rounded-xl">
                        <span className="text-[#8CA9B0] text-[10px]">Pressão Arterial</span>
                        <p className="font-bold text-white text-sm">{patient.vitals?.bp || "118/76"}</p>
                      </div>
                      <div className="bg-[#122227] p-2 rounded-xl">
                        <span className="text-[#8CA9B0] text-[10px]">Tag NFC</span>
                        <p className="font-bold text-[#A8E6CF] text-xs font-mono">{patient.nfcTag}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/20 space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-[#7EC8C0] uppercase">Alergias & Risco</span>
                    <p className="text-white font-medium">{patient.allergies}</p>
                    <p className="text-[#8CA9B0] text-[11px]">{patient.riskConditions}</p>
                  </div>
                </div>
              )}

              {/* 2. ANOTAÇÕES DA CONSULTA */}
              {activeHUDTab === "notes" && (
                <div className="space-y-3 animate-fadeIn">
                  <textarea
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder="Escreva as observações de evolução da consulta..."
                    className="w-full h-48 bg-[#091518] border border-[#7EC8C0]/30 rounded-2xl p-3 text-xs text-white placeholder-[#688A92] outline-none resize-none font-medium"
                  />
                </div>
              )}

              {/* 3. TRANSCRIÇÃO & COPILOTO IA */}
              {activeHUDTab === "ai" && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/20 space-y-2 max-h-48 overflow-y-auto">
                    {aiTranscript.map((t, i) => (
                      <div key={i} className="text-xs space-y-0.5">
                        <span className="font-bold text-[#7EC8C0] text-[10px]">{t.speaker} ({t.time}):</span>
                        <p className="text-[#A6C5CB]">{t.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerateAISummary}
                    disabled={isAiSummarizing}
                    className="w-full py-2 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] text-[#0C1618] font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={13} />
                    {isAiSummarizing ? "Sintetizando Anamnese..." : "Gerar Resumo Clínico com IA"}
                  </button>

                  {aiSummary && (
                    <div className="p-3 bg-[#14262C] border border-[#7EC8C0]/30 rounded-xl text-xs text-white leading-relaxed animate-fadeIn">
                      <span className="text-[10px] font-bold text-[#7EC8C0] uppercase block mb-1">Síntese de Anamnese:</span>
                      {aiSummary}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
