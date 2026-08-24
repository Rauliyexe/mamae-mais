import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import PresenzLogo, { PresenzIcon } from "../components/PresenzLogo";
import { 
  Stethoscope, User, Heart, Activity, FileText, AlertCircle, 
  Send, CheckCircle2, ChevronRight, ShieldAlert, ArrowLeftRight, 
  Users, MessageSquare, Clipboard, Calendar, Clock, Sparkles, 
  Scale, BookOpen, Brain, TrendingUp, RefreshCw, LogOut, ShieldCheck,
  Radio, Wifi, HeartPulse, Zap, AlertTriangle, Eye, Download,
  Check, Info, FileSpreadsheet, Play, Pause
} from "lucide-react";

export default function PortalMedico() {
  const { 
    patients, userDocuments, addDocumentFeedback, addNotification, navigate,
    doctorUser, userRole, logout 
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'prontuario' | 'exames' | 'condutas'
  const [selectedPatientId, setSelectedPatientId] = useState("carla");
  const [recommendation, setRecommendation] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedExame, setSelectedExame] = useState("Ultrassom Morfológico 2º Tri");

  // Telemetry simulation states
  const [liveFHR, setLiveFHR] = useState(144);
  const [isTelemetryRunning, setIsTelemetryRunning] = useState(true);
  const [nfcSignalStrength, setNfcSignalStrength] = useState("98%");

  // Document feedback editing states
  const [editingDocId, setEditingDocId] = useState(null);
  const [docFeedbackText, setDocFeedbackText] = useState("");

  // AI draft assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Live FHR fluctuation effect for telemetry realism
  useEffect(() => {
    if (!isTelemetryRunning) return;
    const interval = setInterval(() => {
      setLiveFHR(prev => Math.min(156, Math.max(136, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 1800);
    return () => clearInterval(interval);
  }, [isTelemetryRunning]);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientDocs = userDocuments.filter((d) => d.patientEmail === activePatient.email);

  // Mocks for clinical data
  const getWeightHistoryMock = (patientId) => {
    if (patientId === "carla") {
      return [
        { date: "2026-03-15", weight: 61.2, week: 6, diff: "+0.0 kg" },
        { date: "2026-04-18", weight: 62.5, week: 10, diff: "+1.3 kg" },
        { date: "2026-05-20", weight: 63.8, week: 14, diff: "+2.6 kg" },
        { date: "2026-06-15", weight: 64.8, week: 17, diff: "+3.6 kg" }
      ];
    } else if (patientId === "ana") {
      return [
        { date: "2026-03-10", weight: 67.0, week: 8, diff: "+0.0 kg" },
        { date: "2026-05-12", weight: 69.4, week: 16, diff: "+2.4 kg" },
        { date: "2026-07-10", weight: 71.8, week: 24, diff: "+4.8 kg" },
        { date: "2026-08-08", weight: 73.2, week: 28, diff: "+6.2 kg" }
      ];
    } else {
      return [
        { date: "2026-06-01", weight: 57.0, week: 4, diff: "+0.0 kg" },
        { date: "2026-07-02", weight: 57.6, week: 8, diff: "+0.6 kg" },
        { date: "2026-08-01", weight: 58.0, week: 12, diff: "+1.0 kg" }
      ];
    }
  };

  const getSymptomTimelineMock = (patientId) => {
    if (patientId === "carla") {
      return [
        { date: "Hoje", mood: "Otima", water: "8/8 copos", kicks: "12 chutes", notes: "Sem inchaços, sentindo chutes leves e regulares." },
        { date: "Ontem", mood: "Bem", water: "6/8 copos", kicks: "10 chutes", notes: "Leve cansaço no final da tarde, sono reparador." },
        { date: "3 dias atrás", mood: "Otima", water: "8/8 copos", kicks: "14 chutes", notes: "Dormiu muito bem, caminhada matinal de 25 min." }
      ];
    } else if (patientId === "ana") {
      return [
        { date: "Hoje", mood: "Confusa", water: "5/8 copos", kicks: "6 chutes", notes: "Dores lombares leves, sensação de barriga dura após esforço." },
        { date: "Ontem", mood: "Triste", water: "4/8 copos", kicks: "8 chutes", notes: "Ansiedade moderada e inchaço nos pés no final do dia." },
        { date: "4 dias atrás", mood: "Bem", water: "7/8 copos", kicks: "11 chutes", notes: "Consulta pré-natal de rotina realizada." }
      ];
    } else {
      return [
        { date: "Hoje", mood: "Otima", water: "8/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Náuseas matinais diminuindo gradativamente." },
        { date: "Ontem", mood: "Otima", water: "9/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Excelente disposição para rotina diária." },
        { date: "5 dias atrás", mood: "Bem", water: "8/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Exame laboratorial inicial agendado." }
      ];
    }
  };

  const handleSendRecommendation = (e) => {
    e?.preventDefault();
    if (!recommendation.trim()) return;

    const docName = doctorUser?.name || "Dr. Leonardo Pinto";
    addNotification(
      "health",
      `Orientação Presenz - ${docName}`,
      `${docName} enviou uma nova orientação clínica: "${recommendation}"`,
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
      `Nova solicitação de exame: ${selectedExame}. Verifique detalhes na agenda.`,
      "calendario"
    );
    setSuccessMsg(`Exame "${selectedExame}" sincronizado na agenda de ${activePatient.name}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleSubmitFeedback = (docId) => {
    if (!docFeedbackText.trim()) return;
    addDocumentFeedback(docId, docFeedbackText);
    
    const docName = doctorUser?.name || "Dr. Leonardo Pinto";
    addNotification(
      "health",
      "Laudo Analisado pelo Especialista",
      `${docName} inseriu parecer clínico no seu exame.`,
      "bibliotecaexames"
    );

    setSuccessMsg("Parecer clínico gravado com assinatura digital Presenz!");
    setEditingDocId(null);
    setDocFeedbackText("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Simulated AI clinical draft assistant
  const handleDraftAICopilot = () => {
    if (!aiPrompt.trim()) return;
    setIsDrafting(true);
    setTimeout(() => {
      let draftText = "";
      const name = activePatient.name.split(" ")[0];
      if (aiPrompt.toLowerCase().includes("liquido") || aiPrompt.toLowerCase().includes("líquido")) {
        draftText = `Conduta Presenz para ILA (Líquido Amniótico) - Paciente ${name}: Recomenda-se aumentar aporte hídrico para no mínimo 2.8L/dia (11-12 copos de água mineral). Repouso relativo em decúbito lateral esquerdo para otimização da perfusão útero-placentária. Agendar reavaliação ultrassonográfica de ILA e Dopplerfluxometria em 8 dias. Em caso de perda de líquido súbita, acionar botão SOS do app Presenz.`;
      } else if (aiPrompt.toLowerCase().includes("pressao") || aiPrompt.toLowerCase().includes("pressão")) {
        draftText = `Protocolo Presenz para Monitoramento Pressórico - Paciente ${name}: Aferir pressão arterial 2x/dia (pela manhã e às 19h), registrando no diário do app. Dieta hipossódica moderada. Se PA >= 140x90 mmHg associada a cefaleia refratária, escotomas cintilantes ou epigastralgia, encaminhar-se imediatamente ao pronto-atendimento obstétrico.`;
      } else {
        draftText = `Parecer Clínico Integrado Presenz para ${name} (${activePatient.weeks}ª semana): Gestação evoluindo com parâmetros biométricos favoráveis. Manter suplementação com polivitamínico pré-natal e sulfato ferroso. Atividade física leve autorizada (30 min de hidroginástica ou caminhada). Próximo retorno clínico presencial agendado para 15 dias.`;
      }
      setRecommendation(draftText);
      setIsDrafting(false);
      setAiPrompt("");
    }, 1100);
  };

  // General Statistics Calculations
  const totalMothers = patients.length;
  const alertMothers = patients.filter(p => p.status === "alerta").length;
  const pendingDocs = userDocuments.filter(d => d.status === "Aguardando Leitura").length;

  return (
    <div className="w-full min-h-screen bg-[#070F12] text-[#E2E8F0] font-albert flex flex-col selection:bg-[#00F2C3]/30 selection:text-white">
      {/* Background Ambient Cyber Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#00F2C3]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ================= TOP NAVIGATION HEADER ================= */}
      <header className="bg-[#09151A]/90 backdrop-blur-xl border-b border-[#00F2C3]/20 px-6 py-3.5 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.6)] sticky top-0 z-40">
        <div className="flex items-center gap-4">
          {/* Presenz Logo */}
          <PresenzLogo size="md" showSlogan={true} />

          {/* Telemetry Live Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00F2C3]/10 border border-[#00F2C3]/30 text-[#00F2C3] text-[10px] font-extrabold uppercase tracking-widest font-poppins">
            <span className="w-2 h-2 rounded-full bg-[#00F2C3] animate-ping" />
            <Radio size={12} />
            <span>NFC Bio-Telemetry · 24/7 Ativa</span>
          </div>
        </div>

        {/* Doctor Identity & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00F2C3] font-poppins flex items-center justify-end gap-1">
              <ShieldCheck size={12} />
              CRM/{doctorUser?.uf || "SP"} {doctorUser?.crm || "184920"}
            </span>
            <span className="text-xs font-bold text-white font-poppins">
              {doctorUser?.name || "Dr. Leonardo Pinto"}
            </span>
            <span className="text-[9.5px] text-[#7E99A3]">
              {doctorUser?.clinic || "Hospital e Maternidade Santa Clara"}
            </span>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#00F2C3]/10 border border-[#00F2C3]/30 text-[#00F2C3] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(0,242,195,0.2)]">
            <Stethoscope size={18} />
          </div>

          {/* Disconnect or Return Button */}
          {userRole === "doctor" ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30] text-[#FF6B6B] hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-[#FF3B30]/30 hover:border-[#FF3B30] cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
              title="Desconectar do CRM"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sair do CRM</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("inicio")}
              className="flex items-center gap-1.5 bg-[#00F2C3]/10 hover:bg-[#00F2C3] text-[#00F2C3] hover:text-[#070F12] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#00F2C3]/30 hover:border-[#00F2C3] cursor-pointer transition-all duration-200 active:scale-95 shadow-sm group"
            >
              <ArrowLeftRight size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              <span>Voltar ao App da Mãe</span>
            </button>
          )}
        </div>
      </header>

      {/* ================= MAIN WORKSPACE ================= */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-5">
        
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-[#00F2C3]/15 border border-[#00F2C3] text-[#00F2C3] px-4 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold font-poppins shadow-[0_0_25px_rgba(0,242,195,0.3)] animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= TOP METRICS HUD CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Card 1: Total Patients */}
          <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-2xl p-3.5 shadow-lg relative overflow-hidden group hover:border-[#00F2C3]/50 transition-all">
            <div className="flex justify-between items-center text-[#7E99A3]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">Gestantes Ativas</span>
              <Users size={15} className="text-[#00F2C3]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-poppins">{totalMothers}</span>
              <span className="text-[10px] text-[#00F2C3] font-bold">100% monitoradas</span>
            </div>
          </div>

          {/* Card 2: FCF Live Telemetry */}
          <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-2xl p-3.5 shadow-lg relative overflow-hidden group hover:border-[#00F2C3]/50 transition-all">
            <div className="flex justify-between items-center text-[#7E99A3]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">Batimentos Cardiofetais</span>
              <HeartPulse size={15} className="text-[#00F2C3] animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#00F2C3] font-poppins drop-shadow-[0_0_8px_#00F2C3]">{liveFHR}</span>
              <span className="text-[10px] text-white/70 font-bold">BPM (Normal)</span>
            </div>
          </div>

          {/* Card 3: Alert Cases */}
          <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#FF3B30]/30 rounded-2xl p-3.5 shadow-lg relative overflow-hidden group hover:border-[#FF3B30]/60 transition-all">
            <div className="flex justify-between items-center text-[#7E99A3]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins text-[#FF6B6B]">Atenção / Risco</span>
              <AlertTriangle size={15} className="text-[#FF3B30]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#FF6B6B] font-poppins">{alertMothers}</span>
              <span className="text-[10px] text-[#FF6B6B]/80 font-bold">PA Limítrofe</span>
            </div>
          </div>

          {/* Card 4: NFC Telemetry Status */}
          <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-2xl p-3.5 shadow-lg relative overflow-hidden group hover:border-[#00F2C3]/50 transition-all">
            <div className="flex justify-between items-center text-[#7E99A3]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider font-poppins">Cartão NFC SOS</span>
              <Radio size={15} className="text-[#00F2C3]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-poppins">{nfcSignalStrength}</span>
              <span className="text-[10px] text-[#00F2C3] font-bold">Sinal Ótimo</span>
            </div>
          </div>
        </div>

        {/* ================= PATIENT SELECTOR BAR ================= */}
        <div className="bg-[#0D1C22]/90 backdrop-blur-xl border border-[#00F2C3]/20 rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7E99A3] uppercase tracking-wider font-poppins px-1">
              Selecionar Paciente:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {patients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] text-[#070F12] shadow-[0_0_18px_rgba(0,242,195,0.4)] font-black"
                        : "bg-[#0A161B] text-[#A0B8C2] border border-[#00F2C3]/10 hover:border-[#00F2C3]/40 hover:text-white"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      p.status === "alerta" 
                        ? (isSelected ? "bg-red-900 text-white" : "bg-red-500/20 text-red-400") 
                        : (isSelected ? "bg-[#070F12]/30 text-[#070F12]" : "bg-[#00F2C3]/10 text-[#00F2C3]")
                    }`}>
                      {p.weeks}ª Sem
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#7E99A3] font-medium bg-[#0A161B] px-3 py-1.5 rounded-xl border border-[#00F2C3]/10">
            <Activity size={13} className="text-[#00F2C3]" />
            <span>Condição: <strong className="text-white">{activePatient.riskConditions}</strong></span>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex border-b border-[#00F2C3]/20 bg-[#09151A]/80 rounded-t-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "overview"
                ? "border-[#00F2C3] text-[#00F2C3] bg-[#00F2C3]/10 shadow-[0_0_15px_rgba(0,242,195,0.2)]"
                : "border-transparent text-[#7E99A3] hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity size={15} />
            <span>📡 Telemetria & Bio-Monitor</span>
          </button>

          <button
            onClick={() => setActiveTab("prontuario")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "prontuario"
                ? "border-[#00F2C3] text-[#00F2C3] bg-[#00F2C3]/10 shadow-[0_0_15px_rgba(0,242,195,0.2)]"
                : "border-transparent text-[#7E99A3] hover:text-white hover:bg-white/5"
            }`}
          >
            <Clipboard size={15} />
            <span>📋 Prontuário & NFC</span>
          </button>

          <button
            onClick={() => setActiveTab("exames")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "exames"
                ? "border-[#00F2C3] text-[#00F2C3] bg-[#00F2C3]/10 shadow-[0_0_15px_rgba(0,242,195,0.2)]"
                : "border-transparent text-[#7E99A3] hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText size={15} />
            <span>🔬 Exames & Copiloto IA ({patientDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("condutas")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "condutas"
                ? "border-[#00F2C3] text-[#00F2C3] bg-[#00F2C3]/10 shadow-[0_0_15px_rgba(0,242,195,0.2)]"
                : "border-transparent text-[#7E99A3] hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap size={15} />
            <span>⚡ Condutas & Prescrições</span>
          </button>
        </div>

        {/* ================= TAB 1: TELEMETRIA & BIO-MONITOR ================= */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Live Cardiotocography ECG Monitor */}
            <div className="bg-[#0D1C22]/90 backdrop-blur-xl border border-[#00F2C3]/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(0,242,195,0.15)] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#00F2C3]/15">
                <div className="flex items-center gap-3">
                  <PresenzIcon size={34} />
                  <div>
                    <h3 className="font-poppins font-black text-white text-sm flex items-center gap-2">
                      Cardiotocografia & Traçado Cardíaco Fetal Contínuo (FCF)
                      <span className="px-2 py-0.5 rounded-full bg-[#00F2C3]/20 text-[#00F2C3] text-[9.5px] font-extrabold border border-[#00F2C3]/40">
                        LIVE PRESENZ SIGNAL
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#7E99A3]">Paciente: {activePatient.name} · {activePatient.weeks}ª Semana de Gestação</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTelemetryRunning(!isTelemetryRunning)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A161B] hover:bg-[#00F2C3]/20 border border-[#00F2C3]/30 text-[#00F2C3] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isTelemetryRunning ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isTelemetryRunning ? "Pausar Traçado" : "Retomar Traçado"}</span>
                  </button>
                  <span className="text-xl font-black text-[#00F2C3] font-poppins drop-shadow-[0_0_10px_#00F2C3]">
                    {liveFHR} <span className="text-xs text-white/70 font-normal">BPM</span>
                  </span>
                </div>
              </div>

              {/* Animated ECG Canvas / SVG Graphic */}
              <div className="mt-4 h-32 w-full bg-[#050C0E] rounded-2xl border border-[#00F2C3]/20 p-2 relative overflow-hidden flex items-center">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f2c308_1px,transparent_1px),linear-gradient(to_bottom,#00f2c308_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                
                {/* Glowing ECG Pulse Wave */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 100">
                  <defs>
                    <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00F2C3" stopOpacity="0.1" />
                      <stop offset="70%" stopColor="#00F2C3" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                  
                  {/* Waveform Path */}
                  <path
                    d="M 0,50 L 80,50 L 95,30 L 110,75 L 125,18 L 140,82 L 155,50 L 250,50 L 265,35 L 280,70 L 295,20 L 310,80 L 325,50 L 420,50 L 435,32 L 450,72 L 465,15 L 480,85 L 495,50 L 600,50 L 615,30 L 630,75 L 645,18 L 660,82 L 675,50 L 760,50 L 775,32 L 790,75 L 800,50"
                    fill="none"
                    stroke="url(#ecgGrad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isTelemetryRunning ? "animate-pulse" : ""}
                  />
                </svg>

                {/* Status Indicator in Corner */}
                <div className="absolute bottom-2 right-3 text-[10px] text-[#00F2C3] font-mono bg-[#070F12]/80 px-2 py-0.5 rounded border border-[#00F2C3]/30">
                  Variabilidade Fetal: 8-15 bpm · Reativo
                </div>
              </div>

              {/* Biomarkers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#00F2C3]/15">
                <div className="bg-[#09151A] p-2.5 rounded-xl border border-[#00F2C3]/15 text-center">
                  <span className="text-[10px] font-bold text-[#7E99A3] uppercase">Pressão Materna</span>
                  <p className="text-sm font-black text-white mt-0.5">
                    {activePatient.id === "ana" ? "138/88 mmHg" : "118/76 mmHg"}
                  </p>
                </div>
                <div className="bg-[#09151A] p-2.5 rounded-xl border border-[#00F2C3]/15 text-center">
                  <span className="text-[10px] font-bold text-[#7E99A3] uppercase">Índice ILA</span>
                  <p className="text-sm font-black text-[#00F2C3] mt-0.5">14.2 cm (Límpido)</p>
                </div>
                <div className="bg-[#09151A] p-2.5 rounded-xl border border-[#00F2C3]/15 text-center">
                  <span className="text-[10px] font-bold text-[#7E99A3] uppercase">Chutes Hoje</span>
                  <p className="text-sm font-black text-white mt-0.5">12 chutes registrados</p>
                </div>
                <div className="bg-[#09151A] p-2.5 rounded-xl border border-[#00F2C3]/15 text-center">
                  <span className="text-[10px] font-bold text-[#7E99A3] uppercase">Hidratação Hoje</span>
                  <p className="text-sm font-black text-[#00E5FF] mt-0.5">8 / 8 copos (Meta 100%)</p>
                </div>
              </div>
            </div>

            {/* Daily Symptoms & Clinical Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily Diary Feed */}
              <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg">
                <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2 text-[#00F2C3]">
                  <BookOpen size={14} />
                  Diário e Relatos da Gestante (Sincronização Presenz)
                </h4>
                <div className="space-y-2.5">
                  {getSymptomTimelineMock(activePatient.id).map((item, idx) => (
                    <div key={idx} className="bg-[#081317] p-3 rounded-2xl border border-[#00F2C3]/10 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{item.date}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F2C3]/10 text-[#00F2C3] font-bold">
                          Humor: {item.mood}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0B8C2]">{item.notes}</p>
                      <div className="text-[10px] text-[#7E99A3] flex gap-3 mt-1 font-medium">
                        <span>💧 Água: {item.water}</span>
                        <span>👶 Chutes: {item.kicks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presenz AI Quick Clinical Copilot */}
              <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#00F2C3]">
                    <Brain size={14} />
                    Copiloto de Conduta Clínica Presenz AI
                  </h4>
                  <p className="text-xs text-[#7E99A3] mb-3">
                    Gere minutas de orientações obstétricas baseadas nos dados clínicos e exames de {activePatient.name}.
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setAiPrompt("Orientação sobre líquido amniótico e hidratação"); }}
                        className="px-2.5 py-1 bg-[#081317] hover:bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/20 rounded-lg text-[10.5px] font-medium transition cursor-pointer"
                      >
                        💧 Líquido Amniótico
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAiPrompt("Conduta para pressão arterial limítrofe"); }}
                        className="px-2.5 py-1 bg-[#081317] hover:bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/20 rounded-lg text-[10.5px] font-medium transition cursor-pointer"
                      >
                        🩺 Pressão Limítrofe
                      </button>
                    </div>

                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Descreva o que deseja orientar à paciente (ex: repouso, hidratação, vitaminas)..."
                      className="w-full h-20 bg-[#060D10] border border-[#00F2C3]/20 rounded-xl p-2.5 text-xs text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition resize-none font-medium"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDraftAICopilot}
                    disabled={isDrafting || !aiPrompt.trim()}
                    className="w-full py-2 bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] hover:from-[#00D4AA] text-[#070F12] font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,195,0.3)] transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={13} />
                    {isDrafting ? "Redigindo Parecer com IA..." : "Gerar Minuta Clínica"}
                  </button>
                </div>

                {recommendation && (
                  <div className="mt-3 p-3 bg-[#00F2C3]/10 border border-[#00F2C3]/30 rounded-xl animate-fadeIn">
                    <p className="text-[10px] font-bold text-[#00F2C3] uppercase">Minuta Pronta para Envio:</p>
                    <p className="text-xs text-white mt-1 leading-relaxed">{recommendation}</p>
                    <button
                      onClick={handleSendRecommendation}
                      className="mt-2.5 w-full py-1.5 bg-[#00F2C3] hover:bg-[#00D4AA] text-[#070F12] font-black text-xs rounded-lg transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send size={12} />
                      Transmitir Parecer ao Celular da Mãe
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
              {/* Bio & NFC SOS Card */}
              <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-[#00F2C3]/15">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F2C3] to-[#00E5FF] text-[#070F12] flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(0,242,195,0.3)]">
                    {activePatient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-white text-sm">{activePatient.name}</h3>
                    <p className="text-xs text-[#7E99A3]">{activePatient.email}</p>
                    <span className="inline-block mt-1 text-[9.5px] px-2 py-0.5 rounded-full bg-[#00F2C3]/15 text-[#00F2C3] font-extrabold border border-[#00F2C3]/30">
                      Cartão Presenz NFC Pareado
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7E99A3]">Tipo Sanguíneo:</span>
                    <span className="font-bold text-white">{activePatient.bloodType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7E99A3]">Alergias:</span>
                    <span className="font-bold text-white">{activePatient.allergies}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7E99A3]">Idade Gestacional:</span>
                    <span className="font-bold text-[#00F2C3]">{activePatient.weeks} semanas ({activePatient.trimester}º Tri)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7E99A3]">Data Prevista (DPP):</span>
                    <span className="font-bold text-white">{activePatient.dueDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#7E99A3]">Classificação Obstétrica:</span>
                    <span className="font-bold text-white">{activePatient.isFirstPregnancy ? "Primigesta (1ª Gestação)" : "Multigesta"}</span>
                  </div>
                </div>
              </div>

              {/* Weight History and Progression */}
              <div className="lg:col-span-2 bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg">
                <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-2 text-[#00F2C3]">
                  <Scale size={14} />
                  Curva e Histórico de Ganho Ponderal (Peso Gestacional)
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#00F2C3]/20 text-[#7E99A3] text-[10.5px] font-extrabold uppercase font-poppins">
                        <th className="pb-2">Data da Pesagem</th>
                        <th className="pb-2">Semana</th>
                        <th className="pb-2">Peso Registrado</th>
                        <th className="pb-2">Variação / Meta OMS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {getWeightHistoryMock(activePatient.id).map((w, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition">
                          <td className="py-2.5 text-white font-medium">{w.date}</td>
                          <td className="py-2.5 text-[#00F2C3] font-bold">{w.week}ª Sem</td>
                          <td className="py-2.5 text-white font-bold">{w.weight} kg</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#00F2C3]/10 text-[#00F2C3] text-[10px] font-extrabold">
                              {w.diff}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-10 text-center">
                  <FileText size={36} className="mx-auto text-[#7E99A3] mb-2 opacity-50" />
                  <p className="text-white font-bold text-sm">Nenhum exame anexado para {activePatient.name}.</p>
                  <p className="text-xs text-[#7E99A3] mt-1">A gestante pode enviar PDFs e ultrassons pelo aplicativo móvel Mamãe+.</p>
                </div>
              ) : (
                patientDocs.map((doc) => (
                  <div key={doc.id} className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#00F2C3]/10 border border-[#00F2C3]/30 text-[#00F2C3] flex items-center justify-center shrink-0">
                        <FileText size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-poppins font-bold text-white text-sm">{doc.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                            doc.status === "Analisado"
                              ? "bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#7E99A3] mt-0.5">
                          Enviado em {doc.date} · Categoria: <strong className="text-white">{doc.category}</strong>
                        </p>
                        {doc.feedback && (
                          <div className="mt-2 p-2.5 bg-[#060D10] rounded-xl border border-[#00F2C3]/20 text-xs text-white">
                            <span className="text-[10px] font-bold text-[#00F2C3] uppercase block mb-0.5">Parecer Registrado pelo CRM:</span>
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
                            className="w-full h-20 bg-[#060D10] border border-[#00F2C3]/30 rounded-xl p-2 text-xs text-white outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmitFeedback(doc.id)}
                              className="flex-1 py-1.5 bg-[#00F2C3] hover:bg-[#00D4AA] text-[#070F12] font-black text-xs rounded-lg transition"
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
                          className="px-4 py-2 rounded-xl bg-[#00F2C3]/10 hover:bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/30 text-xs font-bold transition active:scale-95 cursor-pointer"
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

        {/* ================= TAB 4: CONDUTAS & PRESCRIÇÕES ================= */}
        {activeTab === "condutas" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Prescribe Scan / Exam */}
              <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#00F2C3]">
                    <Calendar size={14} />
                    Prescrição Rápida de Exames Complementares
                  </h4>
                  <p className="text-xs text-[#7E99A3] mb-4">
                    Insira exames na agenda oficial de {activePatient.name} com instruções prévias de preparo.
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-white font-poppins">Tipo de Exame Obstétrico:</label>
                      <select
                        value={selectedExame}
                        onChange={(e) => setSelectedExame(e.target.value)}
                        className="w-full p-2.5 bg-[#060D10] border border-[#00F2C3]/30 rounded-xl text-xs text-white outline-none focus:border-[#00F2C3] font-medium cursor-pointer"
                      >
                        <option value="Ultrassom Morfológico 2º Tri">Ultrassom Morfológico de 2º Trimestre</option>
                        <option value="Dopplerfluxometria Obstétrica">Dopplerfluxometria Útero-Placentária</option>
                        <option value="Ecocardiograma Fetal">Ecocardiograma Fetal com Mapeamento de Fluxo</option>
                        <option value="Curva Glicêmica (TOTG 75g)">Curva Glicêmica Oral (TOTG 75g - Rastreio DMG)</option>
                        <option value="Cultura de Estreptococo B (GBS)">Cultura Vaginal/Retal para Estreptococo B (GBS)</option>
                        <option value="Cardiotocografia Basal em Consultório">Cardiotocografia Basal em Consultório</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrescribeExame}
                  className="mt-5 w-full py-2.5 bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] hover:from-[#00D4AA] text-[#070F12] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,195,0.3)] transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  Prescrever & Sincronizar na Agenda da Mãe
                </button>
              </div>

              {/* Direct Medical Guidance Form */}
              <div className="bg-[#0D1C22]/80 backdrop-blur-xl border border-[#00F2C3]/20 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-2 text-[#00F2C3]">
                    <MessageSquare size={14} />
                    Orientação Direta ao App da Gestante
                  </h4>
                  <p className="text-xs text-[#7E99A3] mb-4">
                    Envie mensagens de conduta direta com selo e carimbo do CRM {doctorUser?.crm || "184920"}.
                  </p>

                  <textarea
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    placeholder="Digite a recomendação clínica (ex: repouso, dieta, ajuste de vitaminas)..."
                    className="w-full h-28 bg-[#060D10] border border-[#00F2C3]/30 rounded-xl p-3 text-xs text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition resize-none font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendRecommendation}
                  disabled={!recommendation.trim()}
                  className="mt-5 w-full py-2.5 bg-[#00F2C3] hover:bg-[#00D4AA] text-[#070F12] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,242,195,0.3)] transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  Transmitir Orientação via Nuvem Presenz
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
