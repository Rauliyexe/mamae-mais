import React, { useState } from "react";
import { 
  Calendar, Clock, User, AlertCircle, CheckCircle2, 
  ChevronRight, PhoneCall, Bell, Filter, ShieldAlert, Sparkles
} from "lucide-react";

const INITIAL_SCHEDULE = [
  {
    id: "app-1",
    patientName: "Carla Silva",
    specialty: "Obstetrícia (Mamãe+)",
    time: "08:30",
    status: "em_espera", // 'agendado' | 'em_espera' | 'em_consulta' | 'concluido'
    riskLevel: "verde", // 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul'
    reason: "Retorno Pré-natal 2º Trimestre + Análise de USG",
    nfcTag: "NFC-MAMAE-0941",
    arrivedAt: "08:18"
  },
  {
    id: "app-2",
    patientName: "Carlos Eduardo Ramos",
    specialty: "Cardiologia",
    time: "09:15",
    status: "em_espera",
    riskLevel: "amarelo",
    reason: "Avaliação de Holter 24h & Pico Pressórico Relatado",
    nfcTag: "NFC-CARDIO-8812",
    arrivedAt: "09:05"
  },
  {
    id: "app-3",
    patientName: "Ana Souza",
    specialty: "Obstetrícia (Mamãe+)",
    time: "10:00",
    status: "agendado",
    riskLevel: "laranja",
    reason: "Controle de PA Limítrofe (3º Trimestre)",
    nfcTag: "NFC-MAMAE-1822",
    arrivedAt: null
  },
  {
    id: "app-4",
    patientName: "Juliana Mendes",
    specialty: "Endocrinologia",
    time: "10:45",
    status: "agendado",
    riskLevel: "verde",
    reason: "Revisão de Sensor CGM e Metas Glicêmicas",
    nfcTag: "NFC-ENDO-3019",
    arrivedAt: null
  },
  {
    id: "app-5",
    patientName: "Lucas Gabriel (Bebê)",
    specialty: "Pediatria",
    time: "11:30",
    status: "agendado",
    riskLevel: "azul",
    reason: "Puericultura 8 Meses + Acompanhamento Vacinal",
    nfcTag: "NFC-PED-5541",
    arrivedAt: null
  }
];

export default function PresenzScheduleView({ onCallPatient, onSelectPatient }) {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [filterStatus, setFilterStatus] = useState("all");
  const [calledId, setCalledId] = useState(null);

  const getRiskBadge = (level) => {
    switch (level) {
      case "vermelho":
        return { label: "Emergência (Imediato)", bg: "bg-red-500/20 text-red-300 border-red-500/40" };
      case "laranja":
        return { label: "Muito Urgente (10 min)", bg: "bg-orange-500/20 text-orange-300 border-orange-500/40" };
      case "amarelo":
        return { label: "Urgente (60 min)", bg: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
      case "verde":
        return { label: "Pouco Urgente (120 min)", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
      default:
        return { label: "Rotina / Eletivo", bg: "bg-[#7EC8C0]/20 text-[#98D8D0] border-[#7EC8C0]/30" };
    }
  };

  const handleCall = (app) => {
    setCalledId(app.id);
    if (onCallPatient) onCallPatient(app);
    setTimeout(() => setCalledId(null), 3000);
  };

  return (
    <div className="space-y-4 animate-fadeIn font-albert">
      {/* Top Controls */}
      <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-[#7EC8C0]" />
          <div>
            <h3 className="text-sm font-bold text-white font-poppins">Agenda do Dia & Recepção Inteligente</h3>
            <p className="text-[11px] text-[#8CA9B0]">Fila de atendimento integrada com triagem Manchester</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8CA9B0] font-bold">Filtro:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-xs text-white outline-none cursor-pointer"
          >
            <option value="all">Todos os Agendamentos</option>
            <option value="em_espera">Aguardando na Recepção</option>
            <option value="agendado">Horários Futuros</option>
          </select>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {schedule
          .filter(a => filterStatus === "all" || a.status === filterStatus)
          .map((app) => {
            const risk = getRiskBadge(app.riskLevel);
            const isCalled = calledId === app.id;

            return (
              <div
                key={app.id}
                className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 hover:border-[#7EC8C0]/40 rounded-2xl p-4 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#162B30] border border-[#7EC8C0]/30 text-[#7EC8C0] flex flex-col items-center justify-center font-poppins shrink-0">
                    <Clock size={14} />
                    <span className="text-xs font-black text-white mt-0.5">{app.time}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-poppins font-bold text-white text-sm">{app.patientName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#183339] text-[#7EC8C0] font-bold">
                        {app.specialty}
                      </span>
                      <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold border ${risk.bg}`}>
                        {risk.label}
                      </span>
                    </div>

                    <p className="text-xs text-[#A6C5CB]">{app.reason}</p>
                    <div className="text-[10.5px] text-[#8CA9B0] flex items-center gap-3">
                      <span>Tag: <strong className="text-white font-mono">{app.nfcTag}</strong></span>
                      {app.arrivedAt && (
                        <span className="text-emerald-400 font-bold">
                          ✓ Chegou na recepção às {app.arrivedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCall(app)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      isCalled
                        ? "bg-emerald-500 text-white font-black"
                        : "bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-black"
                    }`}
                  >
                    <PhoneCall size={13} />
                    <span>{isCalled ? "Chamada Enviada!" : "Chamar Paciente"}</span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
