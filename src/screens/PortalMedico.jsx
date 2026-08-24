import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import PresenzLogo, { PresenzIcon } from "../components/PresenzLogo";
import PresenzPrescriptionModal from "../components/PresenzPrescriptionModal";
import PresenzTelemedModal from "../components/PresenzTelemedModal";
import PresenzNFCHubModal from "../components/PresenzNFCHubModal";
import PresenzScheduleView from "../components/PresenzScheduleView";
import PresenzAnalyticsView from "../components/PresenzAnalyticsView";
import PresenzChatDirectModal from "../components/PresenzChatDirectModal";
import { 
  Stethoscope, User, Heart, Activity, FileText, AlertCircle, 
  Send, CheckCircle2, ChevronRight, ShieldAlert, ArrowLeftRight, 
  Users, MessageSquare, Clipboard, Calendar, Clock, Sparkles, 
  Scale, BookOpen, Brain, TrendingUp, RefreshCw, LogOut, ShieldCheck,
  Radio, Wifi, HeartPulse, Zap, AlertTriangle, Eye, Download,
  Check, Info, FileSpreadsheet, Play, Pause, Thermometer, Shield,
  Baby, Droplet, Layers, Filter, PlusCircle, Video, Pill, BarChart3
} from "lucide-react";

const SPECIALTY_MODULES = [
  { id: "all", label: "Todas Especialidades", Icon: Layers, color: "text-[#7EC8C0]" },
  { id: "obstetricia", label: "Obstetrícia (Mamãe+)", Icon: Heart, color: "text-[#E6A4B4]" },
  { id: "cardiologia", label: "Cardiologia", Icon: HeartPulse, color: "text-[#F39C9C]" },
  { id: "endocrinologia", label: "Endocrinologia", Icon: Droplet, color: "text-[#A8E6CF]" },
  { id: "pediatria", label: "Pediatria", Icon: Baby, color: "text-[#FFD3B6]" },
  { id: "clinica", label: "Clínica Geral", Icon: Stethoscope, color: "text-[#8BE3D7]" },
];

export default function PortalMedico() {
  const { 
    patients, userDocuments, addDocumentFeedback, addNotification, navigate,
    doctorUser, userRole, logout 
  } = useApp();

  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'prontuario' | 'exames' | 'agenda' | 'analytics' | 'condutas'
  const [selectedPatientId, setSelectedPatientId] = useState("carla");
  const [recommendation, setRecommendation] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedExame, setSelectedExame] = useState("Holter 24h & ECG Digital");

  // Modal controls
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isTelemedModalOpen, setIsTelemedModalOpen] = useState(false);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Telemetry simulation states
  const [liveFHR, setLiveFHR] = useState(144);
  const [liveHR, setLiveHR] = useState(78);
  const [liveGlucose, setLiveGlucose] = useState(114);
  const [isTelemetryRunning, setIsTelemetryRunning] = useState(true);
  const [nfcSignalStrength, setNfcSignalStrength] = useState("98%");

  // Document feedback editing states
  const [editingDocId, setEditingDocId] = useState(null);
  const [docFeedbackText, setDocFeedbackText] = useState("");

  // AI draft assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Live vitals fluctuation effect
  useEffect(() => {
    if (!isTelemetryRunning) return;
    const interval = setInterval(() => {
      setLiveFHR(prev => Math.min(154, Math.max(136, prev + (Math.floor(Math.random() * 5) - 2))));
      setLiveHR(prev => Math.min(94, Math.max(68, prev + (Math.floor(Math.random() * 3) - 1))));
      setLiveGlucose(prev => Math.min(130, Math.max(90, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isTelemetryRunning]);

  // Filter patients by selected specialty
  const filteredPatients = selectedSpecialtyFilter === "all"
    ? patients
    : patients.filter(p => p.specialty === selectedSpecialtyFilter);

  // Active patient object
  const activePatient = patients.find((p) => p.id === selectedPatientId) || filteredPatients[0] || patients[0];
  const patientDocs = userDocuments.filter((d) => d.patientEmail === activePatient.email);

  const handleSendRecommendation = (e) => {
    e?.preventDefault();
    if (!recommendation.trim()) return;

    const docName = doctorUser?.name || "Dr. Leonardo Pinto";
    addNotification(
      "health",
      `Presenz Tele-Orientação - ${docName}`,
      `${docName} emitiu nova orientação clínica: "${recommendation}"`,
      "inicio"
    );

    setSuccessMsg(`Conduta clínica transmitida em tempo real para ${activePatient.name}!`);
    setRecommendation("");
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const handlePrescribeExame = () => {
    addNotification(
      "calendar",
      "Exame Prescrito via Presenz",
      `Nova solicitação de exame: ${selectedExame}. Sincronizado no prontuário.`,
      "calendario"
    );
    setSuccessMsg(`Exame "${selectedExame}" sincronizado com sucesso para ${activePatient.name}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleSubmitFeedback = (docId) => {
    if (!docFeedbackText.trim()) return;
    addDocumentFeedback(docId, docFeedbackText);
    
    const docName = doctorUser?.name || "Dr. Leonardo Pinto";
    addNotification(
      "health",
      "Laudo Analisado pelo Especialista",
      `${docName} inseriu parecer clínico oficial.`,
      "bibliotecaexames"
    );

    setSuccessMsg("Parecer clínico gravado com assinatura digital Presenz!");
    setEditingDocId(null);
    setDocFeedbackText("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Simulated Multi-Specialty AI Copilot
  const handleDraftAICopilot = () => {
    if (!aiPrompt.trim()) return;
    setIsDrafting(true);
    setTimeout(() => {
      let draftText = "";
      const name = activePatient.name.split(" ")[0];
      const spec = activePatient.specialty || "clinica";

      if (spec === "obstetricia") {
        if (aiPrompt.toLowerCase().includes("liquido")) {
          draftText = `Conduta Presenz (Obstetrícia) para ${name}: Aporte hídrico oral aumentado para 2.8L/dia. Repouso relativo em decúbito lateral esquerdo. Reavaliação ultrassonográfica de ILA em 8 dias. Monitorar movimentos fetais via app.`;
        } else {
          draftText = `Parecer Obstétrico Presenz para ${name} (${activePatient.weeks}ª Sem): Pré-natal com boa evolução fetal. Manter suplementação polivitamínica e rotina de aferição pressórica diária. Retorno presencial em 15 dias.`;
        }
      } else if (spec === "cardiologia") {
        draftText = `Conduta Cardiológica Presenz para ${name}: Holter 24h evidenciando ritmo sinusal estável sem pausas patológicas. Manter bloqueador beta / anti-hipertensivo conforme prescrito. Dieta com restrição moderada de sódio e monitoramento diário da PA via Smart Tag Presenz. Retorno com novo ECG em 30 dias.`;
      } else if (spec === "endocrinologia") {
        draftText = `Protocolo de Ajuste Glicêmico Presenz para ${name}: Sensor CGM registrando 84% de Tempo no Alvo (TIR). Manter contagem de carboidratos com relação insulina/carbo prescrita. Monitorar glicemias pré e pós-prandiais. Próxima coleta de HbA1c em 60 dias.`;
      } else if (spec === "pediatria") {
        draftText = `Avaliação Pediátrica Presenz para ${name}: Marcos do neurodesenvolvimento compatíveis com a faixa etária. Introdução alimentar adequada com boa aceitação hídrica. Vacinas em dia. Agendada próxima consulta de puericultura para o próximo mês.`;
      } else {
        draftText = `Conduta Clínica Presenz para ${name}: Parâmetros hemodinâmicos compensados. Manter medicações de uso contínuo, hidratação adequada e atividade física supervisionada. Solicito painel metabólico de rotina.`;
      }

      setRecommendation(draftText);
      setIsDrafting(false);
      setAiPrompt("");
    }, 1000);
  };

  const totalPatients = patients.length;
  const alertCount = patients.filter(p => p.status === "alerta").length;

  return (
    <div className="w-full min-h-screen bg-[#0C1618] text-[#E2E8F0] font-albert flex flex-col pb-20 selection:bg-[#7EC8C0]/30 selection:text-white">
      {/* Background Soft Ambient Pastel Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7EC8C0]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-[#5BB0A6]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= TOP NAVIGATION HEADER ================= */}
      <header className="bg-[#101F24]/90 backdrop-blur-xl border-b border-[#7EC8C0]/20 px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <PresenzLogo size="md" showSlogan={true} />

          {/* Telemetry Live Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#162B30] border border-[#7EC8C0]/25 text-[#98D8D0] text-[10px] font-extrabold uppercase tracking-widest font-poppins">
            <span className="w-2 h-2 rounded-full bg-[#7EC8C0] animate-pulse" />
            <Radio size={12} />
            <span>NFC Bio-Telemetry · Multi-Especialidades</span>
          </div>
        </div>

        {/* Doctor Identity & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7EC8C0] font-poppins flex items-center justify-end gap-1">
              <ShieldCheck size={12} />
              CRM/{doctorUser?.uf || "SP"} {doctorUser?.crm || "184920"}
            </span>
            <span className="text-xs font-bold text-white font-poppins">
              {doctorUser?.name || "Dr. Leonardo Pinto"}
            </span>
            <span className="text-[9.5px] text-[#8CA9B0]">
              {doctorUser?.specialty || "Medicina Integrada"} · {doctorUser?.clinic || "Hospital Santa Clara"}
            </span>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#162B30] border border-[#7EC8C0]/30 text-[#7EC8C0] flex items-center justify-center font-bold text-sm shadow-xs">
            <Stethoscope size={18} />
          </div>

          {/* Disconnect or Return Button */}
          {userRole === "doctor" ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-[#2D1A1E] hover:bg-[#A84242] text-[#F39C9C] hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-[#A84242]/40 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
              title="Desconectar do CRM"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair do CRM</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("inicio")}
              className="flex items-center gap-1.5 bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#7EC8C0]/30 hover:border-[#7EC8C0] cursor-pointer transition-all duration-200 active:scale-95 shadow-sm group"
            >
              <ArrowLeftRight size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              <span>Voltar ao App Mamãe+</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= MULTI-SPECIALTY SELECTOR BAR ================= */}
      <div className="bg-[#0E1B1F] border-b border-[#7EC8C0]/15 px-6 py-2.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8CA9B0] font-poppins shrink-0 mr-2 flex items-center gap-1">
            <Filter size={12} className="text-[#7EC8C0]" />
            Especialidade:
          </span>
          <div className="flex items-center gap-2">
            {SPECIALTY_MODULES.map(({ id, label, Icon, color }) => {
              const isSelected = selectedSpecialtyFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedSpecialtyFilter(id);
                    if (id !== "all") {
                      const firstInSpec = patients.find(p => p.specialty === id);
                      if (firstInSpec) setSelectedPatientId(firstInSpec.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-poppins whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                      : "bg-[#14262C] text-[#A6C5CB] hover:bg-[#1A3138] hover:text-white border border-[#7EC8C0]/15"
                  }`}
                >
                  <Icon size={13} className={isSelected ? "text-[#0C1618]" : color} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAIN WORKSPACE ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-5">
        
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-[#162E2A] border border-[#7EC8C0] text-[#98D8D0] px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold font-poppins shadow-md animate-fadeIn">
            <CheckCircle2 size={16} className="text-[#7EC8C0]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= TOP METRICS HUD CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: Total Patients */}
          <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-3.5 shadow-sm relative overflow-hidden group hover:border-[#7EC8C0]/40 transition-all">
            <div className="flex justify-between items-center text-[#8CA9B0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">Total de Pacientes</span>
              <Users size={15} className="text-[#7EC8C0]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-poppins">{totalPatients}</span>
              <span className="text-[10px] text-[#7EC8C0] font-bold">Multi-Clínico</span>
            </div>
          </div>

          {/* Card 2: Adaptive Specialty Metric */}
          <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-3.5 shadow-sm relative overflow-hidden group hover:border-[#7EC8C0]/40 transition-all">
            <div className="flex justify-between items-center text-[#8CA9B0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">
                {activePatient.specialty === "obstetricia" ? "FCF Cardiofetal" : activePatient.specialty === "endocrinologia" ? "Glicemia Atual (CGM)" : "Frequência Cardíaca"}
              </span>
              <HeartPulse size={15} className="text-[#7EC8C0] animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#8BE3D7] font-poppins">
                {activePatient.specialty === "obstetricia" ? liveFHR : activePatient.specialty === "endocrinologia" ? liveGlucose : liveHR}
              </span>
              <span className="text-[10px] text-[#A2C2C9] font-bold">
                {activePatient.specialty === "endocrinologia" ? "mg/dL" : "BPM"} (Estável)
              </span>
            </div>
          </div>

          {/* Card 3: Alert Cases */}
          <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#C56B6B]/30 rounded-2xl p-3.5 shadow-sm relative overflow-hidden group hover:border-[#C56B6B]/60 transition-all">
            <div className="flex justify-between items-center text-[#8CA9B0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins text-[#F39C9C]">Casos em Alerta</span>
              <AlertTriangle size={15} className="text-[#F39C9C]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#F39C9C] font-poppins">{alertCount}</span>
              <span className="text-[10px] text-[#F39C9C]/80 font-bold">Monitoramento Ativo</span>
            </div>
          </div>

          {/* Card 4: Universal NFC Status */}
          <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-3.5 shadow-sm relative overflow-hidden group hover:border-[#7EC8C0]/40 transition-all">
            <div className="flex justify-between items-center text-[#8CA9B0]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">NFC Tag Health SOS</span>
              <Radio size={15} className="text-[#7EC8C0]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-poppins">{nfcSignalStrength}</span>
              <span className="text-[10px] text-[#7EC8C0] font-bold">Sinal Ótimo</span>
            </div>
          </div>
        </div>

        {/* ================= PATIENT SELECTOR & QUICK MEDICAL SUITE ACTIONS ================= */}
        <div className="bg-[#112025]/90 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#8CA9B0] uppercase tracking-wider font-poppins px-1">
              Prontuário Ativo:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {filteredPatients.map((p) => {
                const isSelected = p.id === activePatient.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] text-[#0C1618] shadow-sm font-black"
                        : "bg-[#0A1619] text-[#A6C5CB] border border-[#7EC8C0]/15 hover:border-[#7EC8C0]/40 hover:text-white"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded-md ${
                      p.status === "alerta" 
                        ? (isSelected ? "bg-red-950 text-white" : "bg-red-500/20 text-red-300") 
                        : (isSelected ? "bg-[#0C1618]/25 text-[#0C1618]" : "bg-[#7EC8C0]/15 text-[#98D8D0]")
                    }`}>
                      {p.specialty === "obstetricia" ? `${p.weeks}ª Sem` : p.specialtyLabel.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setIsTelemedModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] border border-[#7EC8C0]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Video size={13} />
              <span>Telemedicina</span>
            </button>

            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] border border-[#7EC8C0]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Pill size={13} />
              <span>Receituário & QR</span>
            </button>

            <button
              onClick={() => setIsNfcModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] border border-[#7EC8C0]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <Radio size={13} />
              <span>NFC Hub Pro</span>
            </button>

            <button
              onClick={() => setIsChatModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] border border-[#7EC8C0]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <MessageSquare size={13} />
              <span>Canal Direct</span>
            </button>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex border-b border-[#7EC8C0]/20 bg-[#101F24]/80 rounded-t-2xl overflow-x-auto scrollbar-none shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "overview"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity size={15} />
            <span>📡 Telemetria & Bio-Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab("prontuario")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "prontuario"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <Clipboard size={15} />
            <span>📋 Prontuário & NFC</span>
          </button>

          <button
            onClick={() => setActiveTab("exames")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "exames"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText size={15} />
            <span>🔬 Exames & Copiloto IA ({patientDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "agenda"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar size={15} />
            <span>📅 Agenda & Triagem</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "analytics"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 size={15} />
            <span>📊 BI & Desfechos</span>
          </button>

          <button
            onClick={() => setActiveTab("condutas")}
            className={`flex-1 py-3.5 px-4 text-center text-xs font-extrabold font-poppins tracking-wider uppercase whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "condutas"
                ? "border-[#7EC8C0] text-[#98D8D0] bg-[#7EC8C0]/10"
                : "border-transparent text-[#8CA9B0] hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap size={15} />
            <span>⚡ Condutas</span>
          </button>
        </div>

        {/* ================= TAB 1: TELEMETRIA & BIO-MONITOR ================= */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Live Bio-Monitor Card */}
            <div className="bg-[#112025]/90 backdrop-blur-xl border border-[#7EC8C0]/25 rounded-3xl p-5 shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#7EC8C0]/15">
                <div className="flex items-center gap-3">
                  <PresenzIcon size={34} />
                  <div>
                    <h3 className="font-poppins font-bold text-white text-sm flex items-center gap-2">
                      {activePatient.specialty === "obstetricia" 
                        ? "Cardiotocografia & Frequência Cardíaca Fetal (FCF)" 
                        : activePatient.specialty === "cardiologia"
                        ? "Eletrocardiograma Contínuo DII & Telemetria Cardíaca"
                        : activePatient.specialty === "endocrinologia"
                        ? "Curva Contínua de Glicose (Sensor CGM)"
                        : "Monitor Biométrico de Sinais Vitais em Tempo Real"}
                      <span className="px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] text-[9.5px] font-extrabold border border-[#7EC8C0]/30">
                        {activePatient.specialtyLabel}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#8CA9B0]">Paciente: {activePatient.name} · Idade: {activePatient.age || 30} anos · NFC: {activePatient.nfcTag}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTelemetryRunning(!isTelemetryRunning)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#091518] hover:bg-[#7EC8C0]/15 border border-[#7EC8C0]/25 text-[#98D8D0] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isTelemetryRunning ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isTelemetryRunning ? "Pausar" : "Retomar"}</span>
                  </button>
                  <span className="text-xl font-black text-[#8BE3D7] font-poppins">
                    {activePatient.specialty === "obstetricia" ? liveFHR : activePatient.specialty === "endocrinologia" ? liveGlucose : liveHR}
                    <span className="text-xs text-[#A2C2C9] font-normal ml-1">
                      {activePatient.specialty === "endocrinologia" ? "mg/dL" : "BPM"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Animated Bio Waveform */}
              <div className="mt-4 h-32 w-full bg-[#081214] rounded-2xl border border-[#7EC8C0]/20 p-2 relative overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#7ec8c008_1px,transparent_1px),linear-gradient(to_bottom,#7ec8c008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 100">
                  <defs>
                    <linearGradient id="ecgGradPastel" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7EC8C0" stopOpacity="0.1" />
                      <stop offset="70%" stopColor="#7EC8C0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M 0,50 L 80,50 L 95,30 L 110,75 L 125,18 L 140,82 L 155,50 L 250,50 L 265,35 L 280,70 L 295,20 L 310,80 L 325,50 L 420,50 L 435,32 L 450,72 L 465,15 L 480,85 L 495,50 L 600,50 L 615,30 L 630,75 L 645,18 L 660,82 L 675,50 L 760,50 L 775,32 L 790,75 L 800,50"
                    fill="none"
                    stroke="url(#ecgGradPastel)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isTelemetryRunning ? "animate-pulse" : ""}
                  />
                </svg>

                <div className="absolute bottom-2 right-3 text-[10px] text-[#98D8D0] font-mono bg-[#091518]/90 px-2 py-0.5 rounded border border-[#7EC8C0]/25">
                  Sensor Status: Presenz Live Sync · Sinal 100%
                </div>
              </div>

              {/* Biomarkers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#7EC8C0]/15">
                <div className="bg-[#0A1619] p-2.5 rounded-xl border border-[#7EC8C0]/15 text-center">
                  <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Pressão Arterial</span>
                  <p className="text-sm font-black text-white mt-0.5">{activePatient.vitals?.bp || "120/80 mmHg"}</p>
                </div>
                <div className="bg-[#0A1619] p-2.5 rounded-xl border border-[#7EC8C0]/15 text-center">
                  <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Oximetria SpO2</span>
                  <p className="text-sm font-black text-[#8BE3D7] mt-0.5">{activePatient.vitals?.spo2 || "99%"}</p>
                </div>
                <div className="bg-[#0A1619] p-2.5 rounded-xl border border-[#7EC8C0]/15 text-center">
                  <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Temperatura</span>
                  <p className="text-sm font-black text-white mt-0.5">{activePatient.vitals?.temp || "36.5°C"}</p>
                </div>
                <div className="bg-[#0A1619] p-2.5 rounded-xl border border-[#7EC8C0]/15 text-center">
                  <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">
                    {activePatient.specialty === "obstetricia" ? "Índice ILA" : activePatient.specialty === "cardiologia" ? "Variabilidade HRV" : "Glicose / Parâmetro"}
                  </span>
                  <p className="text-sm font-black text-[#A8E6CF] mt-0.5">
                    {activePatient.specialty === "obstetricia" ? "14.2 cm (Normal)" : activePatient.specialty === "cardiologia" ? "42 ms" : activePatient.vitals?.glucose || "Normal"}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily History & AI Quick Copilot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily Diary Feed */}
              <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm">
                <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2 text-[#98D8D0]">
                  <BookOpen size={14} className="text-[#7EC8C0]" />
                  Histórico Clínico Recente & Sincronização Presenz
                </h4>
                <div className="space-y-2.5">
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/15 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Última leitura via Tag NFC</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] font-bold">
                        Tag: {activePatient.nfcTag}
                      </span>
                    </div>
                    <p className="text-xs text-[#A6C5CB]">
                      Condição: {activePatient.riskConditions}. Todos os dados de medicação e histórico clínico sincronizados na nuvem Presenz.
                    </p>
                  </div>
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/15 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Alergias e Restrições</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        Alergias: {activePatient.allergies}
                      </span>
                    </div>
                    <p className="text-xs text-[#A6C5CB]">Tipo Sanguíneo: {activePatient.bloodType} · Classificação: {activePatient.specialtyLabel}</p>
                  </div>
                </div>
              </div>

              {/* Presenz AI Copilot */}
              <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#98D8D0]">
                    <Brain size={14} className="text-[#7EC8C0]" />
                    Copiloto Multidisciplinar Presenz AI
                  </h4>
                  <p className="text-xs text-[#8CA9B0] mb-3">
                    Gere laudos, pareceres e condutas personalizadas para {activePatient.name} ({activePatient.specialtyLabel}).
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => { setAiPrompt("Parecer de rotina e ajuste medicamentoso"); }}
                        className="px-2.5 py-1 bg-[#091518] hover:bg-[#7EC8C0]/15 text-[#98D8D0] border border-[#7EC8C0]/20 rounded-lg text-[10.5px] font-medium transition cursor-pointer"
                      >
                        🩺 Parecer de Rotina
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAiPrompt("Orientação sobre líquido amniótico e hidratação"); }}
                        className="px-2.5 py-1 bg-[#091518] hover:bg-[#7EC8C0]/15 text-[#98D8D0] border border-[#7EC8C0]/20 rounded-lg text-[10.5px] font-medium transition cursor-pointer"
                      >
                        💧 Aporte Hídrico
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAiPrompt("Conduta para controle de pressão arterial"); }}
                        className="px-2.5 py-1 bg-[#091518] hover:bg-[#7EC8C0]/15 text-[#98D8D0] border border-[#7EC8C0]/20 rounded-lg text-[10.5px] font-medium transition cursor-pointer"
                      >
                        ❤️ Controle Pressórico
                      </button>
                    </div>

                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Descreva a conduta ou orientação para o paciente..."
                      className="w-full h-20 bg-[#081214] border border-[#7EC8C0]/25 rounded-xl p-2.5 text-xs text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition resize-none font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDraftAICopilot}
                    disabled={isDrafting || !aiPrompt.trim()}
                    className="w-full py-2 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={13} />
                    {isDrafting ? "Redigindo Parecer com IA..." : "Gerar Minuta Clínica"}
                  </button>
                </div>

                {recommendation && (
                  <div className="mt-3 p-3 bg-[#162B30] border border-[#7EC8C0]/30 rounded-xl animate-fadeIn">
                    <p className="text-[10px] font-bold text-[#98D8D0] uppercase">Minuta Pronta para Transmissão:</p>
                    <p className="text-xs text-white mt-1 leading-relaxed">{recommendation}</p>
                    <button
                      onClick={handleSendRecommendation}
                      className="mt-2.5 w-full py-1.5 bg-[#7EC8C0] hover:bg-[#6EB8B0] text-[#0C1618] font-black text-xs rounded-lg transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send size={12} />
                      Transmitir Parecer ao Paciente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRONTUÁRIO & NFC ================= */}
        {activeTab === "prontuario" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#7EC8C0]/15">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7EC8C0] to-[#5BB0A6] text-[#0C1618] flex items-center justify-center font-black text-lg shadow-sm">
                    {activePatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-white text-sm">{activePatient.name}</h3>
                    <p className="text-xs text-[#8CA9B0]">{activePatient.email}</p>
                    <span className="inline-block mt-1 text-[9.5px] px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] font-extrabold border border-[#7EC8C0]/30">
                      Cartão Presenz NFC: {activePatient.nfcTag}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8CA9B0]">Especialidade:</span>
                    <span className="font-bold text-[#8BE3D7]">{activePatient.specialtyLabel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8CA9B0]">Tipo Sanguíneo:</span>
                    <span className="font-bold text-white">{activePatient.bloodType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8CA9B0]">Alergias Conhecidas:</span>
                    <span className="font-bold text-white">{activePatient.allergies}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8CA9B0]">Condição Clínica:</span>
                    <span className="font-bold text-white">{activePatient.riskConditions}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm space-y-4">
                <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-[#98D8D0]">
                  <Clipboard size={14} className="text-[#7EC8C0]" />
                  Ficha Médica Integrada Presenz Cloud
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/15 text-center">
                    <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Idade / Sexo</span>
                    <p className="text-sm font-black text-white mt-0.5">{activePatient.age || 30} anos · {activePatient.gender || "F"}</p>
                  </div>
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/15 text-center">
                    <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Módulo do Sistema</span>
                    <p className="text-sm font-black text-[#8BE3D7] mt-0.5">{activePatient.specialtyLabel}</p>
                  </div>
                  <div className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/15 text-center">
                    <span className="text-[10px] font-bold text-[#8CA9B0] uppercase">Status de Monitoramento</span>
                    <p className="text-sm font-black text-[#A8E6CF] mt-0.5 capitalize">{activePatient.status}</p>
                  </div>
                </div>

                <div className="bg-[#091518] p-4 rounded-2xl border border-[#7EC8C0]/15 space-y-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#7EC8C0]" />
                    Sincronização com o Ecossistema Mamãe+ & Presenz
                  </span>
                  <p className="text-xs text-[#A6C5CB] leading-relaxed">
                    Este prontuário está unificado com a rede de saúde em tempo real do Presenz. Os registros de sinais vitais, exames e orientações médicas são automaticamente transmitidos para os dispositivos autorizados do paciente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: EXAMES & LAUDOS ================= */}
        {activeTab === "exames" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 gap-4">
              {patientDocs.length === 0 ? (
                <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-10 text-center">
                  <FileText size={36} className="mx-auto text-[#8CA9B0] mb-2 opacity-50" />
                  <p className="text-white font-bold text-sm">Nenhum exame anexado para {activePatient.name}.</p>
                  <p className="text-xs text-[#8CA9B0] mt-1">Exames podem ser enviados pelo paciente ou anexados na clínica.</p>
                </div>
              ) : (
                patientDocs.map((doc) => (
                  <div key={doc.id} className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#162B30] border border-[#7EC8C0]/30 text-[#7EC8C0] flex items-center justify-center shrink-0">
                        <FileText size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-poppins font-bold text-white text-sm">{doc.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                            doc.status === "Analisado"
                              ? "bg-[#7EC8C0]/20 text-[#98D8D0] border border-[#7EC8C0]/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#8CA9B0] mt-0.5">
                          Enviado em {doc.date} · Categoria: <strong className="text-white">{doc.type}</strong>
                        </p>
                        {doc.feedback && (
                          <div className="mt-2 p-2.5 bg-[#081214] rounded-xl border border-[#7EC8C0]/20 text-xs text-white">
                            <span className="text-[10px] font-bold text-[#98D8D0] uppercase block mb-0.5">Parecer Registrado pelo CRM:</span>
                            {doc.feedback}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {editingDocId === doc.id ? (
                        <div className="flex flex-col gap-2 w-full md:w-80">
                          <textarea
                            value={docFeedbackText}
                            onChange={(e) => setDocFeedbackText(e.target.value)}
                            placeholder="Insira as observações clínicas do laudo..."
                            className="w-full h-20 bg-[#081214] border border-[#7EC8C0]/30 rounded-xl p-2 text-xs text-white outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmitFeedback(doc.id)}
                              className="flex-1 py-1.5 bg-[#7EC8C0] hover:bg-[#6EB8B0] text-[#0C1618] font-black text-xs rounded-lg transition"
                            >
                              Gravar Parecer
                            </button>
                            <button
                              onClick={() => setEditingDocId(null)}
                              className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-lg hover:bg-white/20 transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingDocId(doc.id);
                            setDocFeedbackText(doc.feedback || "");
                          }}
                          className="px-4 py-2 rounded-xl bg-[#162B30] hover:bg-[#7EC8C0]/20 text-[#98D8D0] border border-[#7EC8C0]/30 text-xs font-bold transition active:scale-95 cursor-pointer"
                        >
                          {doc.feedback ? "Editar Parecer" : "Emitir Parecer Clínico"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: AGENDA & TRIAGEM MANCHESTER ================= */}
        {activeTab === "agenda" && (
          <PresenzScheduleView 
            onCallPatient={(app) => setSuccessMsg(`Chamada sonora e notificação enviada para ${app.patientName} na recepção!`)}
          />
        )}

        {/* ================= TAB 5: BI & ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <PresenzAnalyticsView />
        )}

        {/* ================= TAB 6: CONDUTAS & PRESCRIÇÕES ================= */}
        {activeTab === "condutas" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Prescribe Scan / Exam */}
              <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#98D8D0]">
                    <Calendar size={14} className="text-[#7EC8C0]" />
                    Prescrição Rápida de Exames ({activePatient.specialtyLabel})
                  </h4>
                  <p className="text-xs text-[#8CA9B0] mb-4">
                    Insira solicitações de exames diagnósticos na agenda oficial de {activePatient.name}.
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-white font-poppins">Tipo de Exame Especializado:</label>
                      <select
                        value={selectedExame}
                        onChange={(e) => setSelectedExame(e.target.value)}
                        className="w-full p-2.5 bg-[#081214] border border-[#7EC8C0]/30 rounded-xl text-xs text-white outline-none focus:border-[#7EC8C0] font-medium cursor-pointer"
                      >
                        <option value="Holter 24h & ECG Digital">Holter 24 Horas & Eletrocardiograma Digital</option>
                        <option value="Monitoramento Contínuo de Glicose (Sensor CGM)">Monitoramento Contínuo de Glicose (Sensor CGM)</option>
                        <option value="Ultrassom Morfológico 2º Tri">Ultrassom Morfológico 2º Trimestre</option>
                        <option value="Dopplerfluxometria Obstétrica">Dopplerfluxometria Obstétrica</option>
                        <option value="Ecocardiograma com Mapeamento de Fluxo">Ecocardiograma com Mapeamento de Fluxo</option>
                        <option value="Painel Lipídico & Função Renal">Painel Lipídico & Função Renal (Creatinina/Ureia)</option>
                        <option value="Puericultura & Avaliação de Desenvolvimento">Puericultura & Avaliação de Desenvolvimento Infantil</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrescribeExame}
                  className="mt-5 w-full py-2.5 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-black text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  Prescrever & Sincronizar no Prontuário
                </button>
              </div>

              {/* Direct Medical Guidance Form */}
              <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#98D8D0]">
                    <MessageSquare size={14} className="text-[#7EC8C0]" />
                    Orientação Direta ao Paciente
                  </h4>
                  <p className="text-xs text-[#8CA9B0] mb-4">
                    Envie condutas com carimbo e assinatura digital do CRM {doctorUser?.crm || "184920"}.
                  </p>

                  <textarea
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    placeholder="Digite a orientação médica (ex: dieta, medicação, repouso, ajuste posológico)..."
                    className="w-full h-28 bg-[#081214] border border-[#7EC8C0]/30 rounded-xl p-3 text-xs text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition resize-none font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendRecommendation}
                  disabled={!recommendation.trim()}
                  className="mt-5 w-full py-2.5 bg-[#7EC8C0] hover:bg-[#6EB8B0] text-[#0C1618] font-black text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  Transmitir Orientação via Nuvem Presenz
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= ALL 6 INTEGRATED ADVANCED MODALS ================= */}
      <PresenzPrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patient={activePatient}
        doctorUser={doctorUser}
        onPrescriptionIssued={(doc) => setSuccessMsg(`${doc.type === "receita" ? "Receita" : "Atestado"} gerado e assinado digitalmente com sucesso!`)}
      />

      <PresenzTelemedModal
        isOpen={isTelemedModalOpen}
        onClose={() => setIsTelemedModalOpen(false)}
        patient={activePatient}
        doctorUser={doctorUser}
      />

      <PresenzNFCHubModal
        isOpen={isNfcModalOpen}
        onClose={() => setIsNfcModalOpen(false)}
        patient={activePatient}
        onSaveNfcData={() => setSuccessMsg(`Dados gravados e sincronizados na Tag NFC de ${activePatient.name}!`)}
      />

      <PresenzChatDirectModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        patient={activePatient}
        doctorUser={doctorUser}
        onSendAlert={(msg) => setSuccessMsg(msg)}
      />

    </div>
  );
}
