import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Stethoscope, User, Heart, Activity, FileText, AlertCircle, 
  Send, CheckCircle2, ChevronRight, ShieldAlert, ArrowLeftRight, 
  Users, MessageSquare, Clipboard, Calendar, Clock, Sparkles, 
  Scale, BookOpen, Brain, TrendingUp, RefreshCw, LogOut, ShieldCheck
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

  // Document feedback editing states
  const [editingDocId, setEditingDocId] = useState(null);
  const [docFeedbackText, setDocFeedbackText] = useState("");

  // AI draft assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientDocs = userDocuments.filter((d) => d.patientEmail === activePatient.email);

  // Mocks for clinical data (simulated per patient)
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
        { date: "Hoje", mood: "Otima", water: "8/8 copos", kicks: "12 chutes", notes: "Sem inchaços, sentindo chutes leves." },
        { date: "Ontem", mood: "Bem", water: "6/8 copos", kicks: "10 chutes", notes: "Leve cansaço no final da tarde." },
        { date: "3 dias atrás", mood: "Otima", water: "8/8 copos", kicks: "14 chutes", notes: "Dormiu muito bem." }
      ];
    } else if (patientId === "ana") {
      return [
        { date: "Hoje", mood: "Confusa", water: "5/8 copos", kicks: "6 chutes", notes: "Dores lombares leves, sensação de barriga dura." },
        { date: "Ontem", mood: "Triste", water: "4/8 copos", kicks: "8 chutes", notes: "Ansiedade moderada e inchaço nos pés." },
        { date: "4 dias atrás", mood: "Bem", water: "7/8 copos", kicks: "11 chutes", notes: "Consulta de rotina normal." }
      ];
    } else {
      return [
        { date: "Hoje", mood: "Otima", water: "8/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Náuseas matinais diminuindo." },
        { date: "Ontem", mood: "Otima", water: "9/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Excelente disposição para caminhadas." },
        { date: "5 dias atrás", mood: "Bem", water: "8/8 copos", kicks: "Não aplicável (1º Tri)", notes: "Exame laboratorial inicial agendado." }
      ];
    }
  };

  const handleSendRecommendation = (e) => {
    e?.preventDefault();
    if (!recommendation.trim()) return;

    addNotification(
      "health",
      "Nova Orientação Médica",
      `Dr. Leonardo recomendou: ${recommendation}`,
      "inicio"
    );

    setSuccessMsg(`Recomendação enviada com sucesso para ${activePatient.name}!`);
    setRecommendation("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handlePrescribeExame = () => {
    addNotification(
      "calendar",
      "Exame Prescrito pelo Médico",
      `Nova solicitação: ${selectedExame}. Verifique com o laboratório.`,
      "calendario"
    );
    setSuccessMsg(`Exame "${selectedExame}" adicionado à agenda de ${activePatient.name}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleSubmitFeedback = (docId) => {
    if (!docFeedbackText.trim()) return;
    addDocumentFeedback(docId, docFeedbackText);
    
    addNotification(
      "health",
      "Retorno de Exame Disponível",
      `Dr. Leonardo comentou no laudo: "${docFeedbackText.slice(0, 45)}..."`,
      "bibliotecaexames"
    );

    setSuccessMsg("Observações clínicas salvas e enviadas à gestante!");
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
        draftText = `Orientação sobre Líquido Amniótico: Recomendamos à paciente ${name} aumentar significativamente a ingestão de água mineral para no mínimo 2.5 litros diários (cerca de 10 a 12 copos). Monitorar se há vazamentos de líquido em roupas íntimas e repousar em decúbito lateral esquerdo sempre que possível. Repetir ultrassonografia obstétrica com doppler em 10 dias para reavaliação do ILA (Índice de Líquido Amniótico).`;
      } else if (aiPrompt.toLowerCase().includes("pressao") || aiPrompt.toLowerCase().includes("pressão")) {
        draftText = `Conduta para Pressão Arterial Limitrofe: Orientamos a paciente ${name} a realizar aferições da pressão arterial duas vezes ao dia (manhã e noite) e anotar em seu diário. Restringir alimentos ricos em sódio. Caso registre pressão maior ou igual a 140/90 mmHg, acompanhada de dor de cabeça forte ou distúrbios visuais, deve dirigir-se imediatamente ao pronto-atendimento obstétrico.`;
      } else {
        draftText = `Recomendação Clínica Geral para ${name}: Com base nos relatos de prontuário, a gestação encontra-se na ${activePatient.weeks}ª semana. Recomendamos manter a suplementação de micronutrientes (ácido fólico / ferro), realizar caminhadas leves de 30 minutos em dias alternados e assegurar hidratação adequada. Próxima consulta em consultório agendada em duas semanas.`;
      }
      setRecommendation(draftText);
      setIsDrafting(false);
      setAiPrompt("");
    }, 1200);
  };

  // General Statistics Calculations
  const totalMothers = patients.length;
  const alertMothers = patients.filter(p => p.status === "alerta").length;
  const pendingDocs = userDocuments.filter(d => d.status === "Aguardando Leitura").length;
  const avgWeeks = (patients.reduce((sum, p) => sum + p.weeks, 0) / patients.length).toFixed(1);

  return (
    <div className="w-full min-h-screen pb-12 font-albert bg-[#FAF8F5] flex flex-col">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-[#F0DDE4] px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2B6CB0] text-white flex items-center justify-center font-bold shadow-sm">
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold bg-[#2B6CB0] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-poppins">
                NFCARE · PORTAL CLÍNICO
              </span>
              <span className="text-[10.5px] font-bold text-[#2B6CB0] font-poppins">
                CRM/{doctorUser?.uf || "SP"} {doctorUser?.crm || "184.920"} · {doctorUser?.name || "Dr. Leonardo Pinto"} {doctorUser?.clinic ? `(${doctorUser.clinic})` : ""}
              </span>
            </div>
            <h1 className="text-base font-bold text-[#4A4743] font-poppins mt-0.5">
              Painel Multidisciplinar Obstétrico NFCare
            </h1>
          </div>
        </div>

        {userRole === "doctor" ? (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-[#FFF5F5] hover:bg-[#E53E3E] text-[#C53030] hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-[#FEB2B2] hover:border-[#E53E3E] cursor-pointer transition-all duration-200 active:scale-95 shadow-xs"
            title="Desconectar do CRM"
          >
            <LogOut size={14} />
            Sair do CRM
          </button>
        ) : (
          <button
            onClick={() => navigate("inicio")}
            className="flex items-center gap-1.5 bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white text-[#4A4743] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#F0DDE4] hover:border-[#C38B9B] cursor-pointer transition-all duration-200 active:scale-95 shadow-xs hover:shadow-sm group"
          >
            <ArrowLeftRight size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            Voltar ao App da Mãe
          </button>
        )}
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#F0DDE4] bg-white rounded-t-3xl overflow-hidden shadow-2xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "overview"
                ? "border-[#C38B9B] text-[#C38B9B] bg-[#FAF3F6]/70 shadow-xs"
                : "border-transparent text-[#8C6B7A] hover:text-[#3D2B33] hover:bg-[#FAF3F6]/40"
            }`}
          >
            📊 Visão Geral Multidisciplinar
          </button>
          <button
            onClick={() => setActiveTab("prontuario")}
            className={`flex-1 py-3.5 text-center text-xs font-extrabold font-poppins tracking-wider uppercase transition-all duration-200 border-b-2 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "prontuario"
                ? "border-[#C38B9B] text-[#C38B9B] bg-[#FAF3F6]/70 shadow-xs"
                : "border-transparent text-[#8C6B7A] hover:text-[#3D2B33] hover:bg-[#FAF3F6]/40"
            }`}
          >
            📋 Fichas e Prontuários Clínicos
          </button>
        </div>

        {successMsg && (
          <div className="bg-[#FAF3F6] border border-[#F0DDE4] text-[#C38B9B] p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {/* VIEW 1: OVERVIEW CLINICAL DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-3xl border border-[#F0DDE4] shadow-xs hover:shadow-md hover:border-[#C38B9B]/50 transition-all duration-200 flex flex-col justify-center cursor-default">
                <span className="text-[9px] text-[#8C6B7A] font-extrabold uppercase tracking-wider">Mães em Acompanhamento</span>
                <p className="text-[22px] font-extrabold text-[#4A4743] font-poppins mt-1">{totalMothers}</p>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F0DDE4] shadow-xs hover:shadow-md hover:border-red-400 transition-all duration-200 flex flex-col justify-center border-l-4 border-l-red-500 cursor-default">
                <span className="text-[9px] text-[#8C6B7A] font-extrabold uppercase tracking-wider">Alertas Ativos</span>
                <p className="text-[22px] font-extrabold text-red-600 font-poppins mt-1">{alertMothers}</p>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F0DDE4] shadow-xs hover:shadow-md hover:border-[#C38B9B] transition-all duration-200 flex flex-col justify-center border-l-4 border-l-[#C38B9B] cursor-default">
                <span className="text-[9px] text-[#8C6B7A] font-extrabold uppercase tracking-wider">Exames Pendentes</span>
                <p className="text-[22px] font-extrabold text-[#C38B9B] font-poppins mt-1">{pendingDocs}</p>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F0DDE4] shadow-xs hover:shadow-md hover:border-[#C38B9B]/50 transition-all duration-200 flex flex-col justify-center cursor-default">
                <span className="text-[9px] text-[#8C6B7A] font-extrabold uppercase tracking-wider">Média de Idade Gestacional</span>
                <p className="text-[22px] font-extrabold text-[#4A4743] font-poppins mt-1">{avgWeeks} semanas</p>
              </div>
            </div>

            {/* Patients Overview Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patients.map((pat) => {
                const isAlert = pat.status === "alerta";
                const isExcel = pat.status === "excelente";
                const recentDocs = userDocuments.filter(d => d.patientEmail === pat.email);
                const pendingCount = recentDocs.filter(d => d.status === "Aguardando Leitura").length;

                return (
                  <div 
                    key={pat.id}
                    className="bg-white rounded-3xl border border-[#F0DDE4] p-5 shadow-mamae hover:shadow-lg hover:border-[#C38B9B]/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4 relative group"
                  >
                    {/* Status Badge */}
                    <span className={`absolute top-4 right-4 text-[8px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border transition-transform duration-200 group-hover:scale-105 ${
                      isAlert 
                        ? "bg-red-50 text-red-600 border-red-200" 
                        : isExcel 
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 text-[#8C6B7A] border-gray-200"
                    }`}>
                      {isAlert ? "Atenção Clínica" : isExcel ? "Estável (Ótimo)" : "Estável / Saudável"}
                    </span>

                    {/* Patient identity */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm uppercase shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                        isAlert ? "bg-red-100 text-red-700" : "bg-[#FAF3F6] text-[#C38B9B] border border-[#F0DDE4]"
                      }`}>
                        {pat.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xs.5 font-bold text-[#3D2B33] group-hover:text-[#C38B9B] transition-colors">{pat.name}</h4>
                        <p className="text-[10px] text-[#8C6B7A] mt-0.5 font-semibold">Tipo Sanguíneo: {pat.bloodType}</p>
                      </div>
                    </div>

                    {/* Gestational progression details */}
                    <div className="space-y-1.5 pt-2 border-t border-[#F0DDE4]/40">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-[#8C6B7A]">Progresso Gestacional:</span>
                        <span className="text-[#4A4743]">{pat.weeks} semanas / {pat.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FAF3F6] rounded-full overflow-hidden border border-[#F0DDE4]/40">
                        <div 
                          className={`h-full rounded-full transition-all ${isAlert ? "bg-red-500" : "bg-[#C38B9B]"}`} 
                          style={{ width: `${pat.progressPercent}%` }} 
                        />
                      </div>
                    </div>

                    {/* Quick overview metrics */}
                    <div className="bg-[#FAF3F6]/55 group-hover:bg-[#FAF3F6]/80 transition-colors rounded-2xl p-3 text-[10px] space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#8C6B7A]">Condição Clínica:</span>
                        <span className="text-[#4A4743] font-bold truncate max-w-[140px]">{pat.riskConditions}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-[#8C6B7A]">Exames na fila:</span>
                        <span className="text-[#4A4743] font-bold">{pendingCount} laudos pendentes</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-[#8C6B7A]">Último peso:</span>
                        <span className="text-[#4A4743] font-bold">{pat.latestWeight} kg</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => {
                        setSelectedPatientId(pat.id);
                        setActiveTab("prontuario");
                      }}
                      className="w-full bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] hover:border-[#C38B9B] text-[#C38B9B] font-bold text-[10.5px] py-2 rounded-xl transition-all duration-200 cursor-pointer text-center active:scale-95 shadow-2xs hover:shadow-xs"
                    >
                      Abrir Prontuário Clínico
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: DETAILED CLINICAL WORKSHEET */}
        {activeTab === "prontuario" && (
          <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
            
            {/* Left Patients Selector Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0 bg-white rounded-3xl border border-[#F0DDE4] p-4 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0DDE4]">
                <Users size={16} className="text-[#C38B9B]" />
                <h3 className="text-xs font-extrabold text-[#4A4743] uppercase tracking-wider">
                  Listagem de Pacientes
                </h3>
              </div>

              <div className="space-y-2">
                {patients.map((pat) => {
                  const isSelected = pat.id === selectedPatientId;
                  const isAlert = pat.status === "alerta";
                  
                  return (
                    <button
                      key={pat.id}
                      onClick={() => {
                        setSelectedPatientId(pat.id);
                        setEditingDocId(null);
                        setDocFeedbackText("");
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF3F6] border-[#C38B9B] shadow-xs"
                          : "bg-[#FAF3F6]/30 hover:bg-[#FAF3F6] hover:border-[#C38B9B]/60 hover:shadow-xs border-[#F0DDE4]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 transition-transform duration-200 ${
                          isSelected 
                            ? "bg-[#C38B9B] text-white" 
                            : "bg-[#FAF3F6] text-[#8C6B7A] border border-[#F0DDE4]"
                        }`}>
                          {pat.name[0]}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[11.5px] font-bold text-[#3D2B33] truncate leading-tight">
                            {pat.name}
                          </h4>
                          <p className="text-[9.5px] text-[#8C6B7A] mt-0.5">
                            Semana {pat.weeks} gestacional
                          </p>
                        </div>
                      </div>

                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isAlert ? "bg-red-500 animate-pulse" : "bg-gray-300"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Detailed Clinical Content Workspace */}
            <main className="flex-1 space-y-6">
              
              {/* Header details */}
              <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF3F6] text-[#C38B9B] border border-[#F0DDE4] flex items-center justify-center font-bold text-lg uppercase shrink-0">
                    {activePatient.name[0]}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#3D2B33] font-poppins">{activePatient.name}</h2>
                    <p className="text-xs text-[#8C6B7A] mt-0.5">
                      D.P.P: {activePatient.dueDate} · Tipo Sanguíneo: {activePatient.bloodType} · Alergias: {activePatient.allergies}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-[#FAF3F6] px-3.5 py-2 rounded-2xl border border-[#F0DDE4] text-center">
                    <span className="text-[9px] text-[#C38B9B] font-extrabold uppercase">Diferença Peso</span>
                    <p className="text-[13px] font-extrabold text-[#4A4743] font-poppins mt-0.5">
                      {getWeightHistoryMock(activePatient.id).slice(-1)[0]?.diff}
                    </p>
                  </div>
                  <div className="bg-[#FAF3F6] px-3.5 py-2 rounded-2xl border border-[#F0DDE4] text-center">
                    <span className="text-[9px] text-[#C38B9B] font-extrabold uppercase">Semanas</span>
                    <p className="text-[13px] font-extrabold text-[#4A4743] font-poppins mt-0.5">{activePatient.weeks} Sem</p>
                  </div>
                </div>
              </div>

              {/* Main panels */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left side: Anamnese & Symptom logs */}
                <div className="xl:col-span-7 space-y-6">
                  
                  {/* Ficha Clínica Card */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-2 border-b border-[#F0DDE4] pb-2.5">
                      <BookOpen size={16} className="text-[#C38B9B]" /> Prontuário Geral & Anamnese
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="bg-[#FAF3F6]/30 p-2.5 rounded-2xl border border-[#F0DDE4]/40">
                        <span className="text-[9.5px] text-[#8C6B7A] block font-semibold">Condição Obstétrica:</span>
                        <span className="font-bold text-[#4A4743] mt-0.5 block">{activePatient.riskConditions}</span>
                      </div>
                      <div className="bg-[#FAF3F6]/30 p-2.5 rounded-2xl border border-[#F0DDE4]/40">
                        <span className="text-[9.5px] text-[#8C6B7A] block font-semibold">Paridade:</span>
                        <span className="font-bold text-[#4A4743] mt-0.5 block">{activePatient.isFirstPregnancy ? "Primigesta (1ª Gravidez)" : "Multigesta"}</span>
                      </div>
                      <div className="bg-[#FAF3F6]/30 p-2.5 rounded-2xl border border-[#F0DDE4]/40">
                        <span className="text-[9.5px] text-[#8C6B7A] block font-semibold">Trimester Atual:</span>
                        <span className="font-bold text-[#4A4743] mt-0.5 block">{activePatient.trimester}º Trimestre</span>
                      </div>
                      <div className="bg-[#FAF3F6]/30 p-2.5 rounded-2xl border border-[#F0DDE4]/40">
                        <span className="text-[9.5px] text-[#8C6B7A] block font-semibold">Próxima Consulta:</span>
                        <span className="font-bold text-[#4A4743] mt-0.5 block">2 semanas (Agendado)</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight gain Log */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-3.5">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-2">
                      <Scale size={16} className="text-[#C38B9B]" /> Gestograma: Histórico Ponderal
                    </h3>
                    
                    <div className="overflow-x-auto border border-[#F0DDE4] rounded-2xl">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FAF3F6] border-b border-[#F0DDE4] text-[#8C6B7A] font-extrabold uppercase text-[9px] tracking-wider">
                            <th className="p-3">Semana</th>
                            <th className="p-3">Data Registro</th>
                            <th className="p-3 text-right">Peso Clínico</th>
                            <th className="p-3 text-right">Evolução</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0DDE4]/40 text-[#4A4743] font-medium">
                          {getWeightHistoryMock(activePatient.id).map((entry, index) => (
                            <tr key={index} className="hover:bg-[#FAF3F6]/20">
                              <td className="p-3 font-bold">{entry.week} sem</td>
                              <td className="p-3">{entry.date}</td>
                              <td className="p-3 text-right font-bold">{entry.weight.toFixed(1)} kg</td>
                              <td className="p-3 text-right font-extrabold text-[#C38B9B]">{entry.diff}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Symptom logs Timeline */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-3.5">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-2">
                      <Activity size={16} className="text-[#C38B9B]" /> Linha do Tempo: Diário & Sintomas Recentes
                    </h3>

                    <div className="relative border-l border-[#F0DDE4] pl-4.5 ml-2.5 space-y-5">
                      {getSymptomTimelineMock(activePatient.id).map((log, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <span className="absolute -left-[24.5px] top-1 w-3 h-3 rounded-full bg-[#C38B9B] border border-white shadow-2xs" />
                          
                          <div>
                            <div className="flex justify-between items-center text-[10.5px]">
                              <span className="font-bold text-[#4A4743]">{log.date}</span>
                              <span className="text-[9.5px] font-extrabold text-[#C38B9B] bg-[#FAF3F6] border border-[#F0DDE4] px-2 py-0.2 rounded-full">
                                Humor: {log.mood}
                              </span>
                            </div>
                            <p className="text-xs text-[#523A46] font-bold mt-1">"{log.notes}"</p>
                            <div className="flex gap-4.5 text-[9.5px] text-[#8C6B7A] mt-1 font-semibold">
                              <span>💧 Hidratação: {log.water}</span>
                              {activePatient.id !== "mariana" && <span>👶 Movimentos: {log.kicks}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right side: Uploaded Exams Drawer list & Action forms */}
                <div className="xl:col-span-5 space-y-6">
                  
                  {/* Exams Documents Library Drawer */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-2 border-b border-[#F0DDE4] pb-2.5">
                      <FileText size={17} className="text-[#C38B9B]" /> Fichas de Exames & Laudos
                    </h3>

                    {patientDocs.length === 0 ? (
                      <p className="text-xs text-[#8C6B7A] italic text-center py-4">
                        Nenhum documento anexado por esta paciente ainda.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {patientDocs.map((doc) => (
                          <div key={doc.id} className="bg-[#FAF3F6]/30 hover:bg-[#FAF3F6]/60 transition-all duration-200 border border-[#F0DDE4] rounded-2xl p-4 space-y-3 shadow-3xs hover:shadow-xs">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-[#3D2B33]">{doc.title}</h4>
                                <span className="text-[9.5px] text-[#8C6B7A] font-semibold mt-0.5 block">
                                  {doc.type} · {doc.date} {doc.drawer && `· Gaveta: ${doc.drawer === "ultrassom" ? "Ultrassom" : doc.drawer === "sangue" ? "Sangue" : "Outros"}`}
                                </span>
                              </div>
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border uppercase ${
                                doc.status === "Analisado" ? "bg-[#F0FFF4] text-[#2F855A] border-[#C6F6D5]" : "bg-[#FFFDF0] text-[#D69E2E] border-[#FEFCBF]"
                              }`}>
                                {doc.status}
                              </span>
                            </div>

                            {/* Image Sandbox Preview */}
                            <div className="flex items-center gap-2.5 bg-white hover:bg-[#FAF3F6]/40 p-2 border border-[#F0DDE4] hover:border-[#C38B9B] rounded-xl text-[10.5px] transition-all duration-200 cursor-pointer shadow-3xs hover:shadow-2xs">
                              <img 
                                src={doc.fileUrl} 
                                alt="Laudo" 
                                className="w-9 h-9 object-cover rounded-lg border border-[#F0DDE4] shrink-0" 
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-[#3D2B33] block truncate">
                                  Ver documento físico
                                </span>
                                <span className="text-[8.5px] text-[#8C6B7A] block">Sandbox do pré-natal</span>
                              </div>
                            </div>

                            {/* Doctor Feedback panel */}
                            {doc.feedback && (
                              <div className="bg-[#FAF3F6] border border-[#F0DDE4] p-2.5 rounded-xl text-[10px] space-y-0.5">
                                <span className="font-extrabold text-[#C38B9B] block">Retorno emitido:</span>
                                <p className="text-[#523A46] leading-relaxed font-medium">{doc.feedback}</p>
                              </div>
                            )}

                            {/* Editing feedback inputs */}
                            {editingDocId === doc.id ? (
                              <div className="space-y-2 pt-2 border-t border-[#F0DDE4]/40">
                                <textarea
                                  rows={3}
                                  placeholder="Digite orientações obstétricas sobre este laudo..."
                                  value={docFeedbackText}
                                  onChange={(e) => setDocFeedbackText(e.target.value)}
                                  className="w-full bg-white border border-[#F0DDE4] rounded-xl p-2 text-xs text-[#3D2B33] outline-none focus:border-[#C38B9B] font-medium"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingDocId(null)}
                                    className="bg-[#8C6B7A]/10 hover:bg-[#8C6B7A]/25 text-[#3D2B33] text-[9.5px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={() => handleSubmitFeedback(doc.id)}
                                    className="bg-[#C38B9B] hover:bg-[#A87483] text-white text-[9.5px] font-bold px-3 py-1 rounded-lg cursor-pointer transition-all active:scale-95 shadow-2xs hover:shadow-xs"
                                  >
                                    Salvar & Notificar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-end pt-1">
                                <button
                                  onClick={() => {
                                    setEditingDocId(doc.id);
                                    setDocFeedbackText(doc.feedback || "");
                                  }}
                                  className="bg-[#C38B9B] hover:bg-[#A87483] text-white text-[9.5px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs"
                                >
                                  <MessageSquare size={9} /> {doc.feedback ? "Editar Feedback" : "Inserir Parecer de Laudo"}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Clinical Draft Copilot Assistant */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-3.5">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-1.5">
                      <Brain size={16} className="text-[#C38B9B]" /> Copiloto Clínico: Rascunho AI
                    </h3>
                    <p className="text-[10px] text-[#8C6B7A] leading-relaxed font-medium">
                      Insira termos-chave (ex: "líquido baixo" ou "pressão alta") e clique abaixo para gerar um rascunho de conduta com base em diretrizes obstétricas:
                    </p>
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Ex: pressão limite no terceiro trimestre..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full px-3 py-2 border border-[#F0DDE4] rounded-xl text-xs outline-none focus:border-[#C38B9B] font-medium transition-colors"
                      />
                      <button
                        onClick={handleDraftAICopilot}
                        disabled={isDrafting || !aiPrompt.trim()}
                        className="w-full bg-[#FAF3F6] hover:bg-[#C38B9B] hover:text-white border border-[#F0DDE4] hover:border-[#C38B9B] text-[#C38B9B] font-extrabold text-[10.5px] py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs"
                      >
                        <RefreshCw size={12} className={isDrafting ? "animate-spin" : ""} />
                        {isDrafting ? "Processando Diretrizes..." : "Rascunhar Conduta Clínica"}
                      </button>
                    </div>
                  </div>

                  {/* Recommendation and Prescriptions inputs */}
                  <div className="bg-white p-5 rounded-3xl border border-[#F0DDE4] shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-[#4A4743] font-poppins flex items-center gap-2 border-b border-[#F0DDE4] pb-2">
                      <Send size={15} className="text-[#C38B9B]" /> Prescrição & Condutas Obstétricas
                    </h3>

                    <form onSubmit={handleSendRecommendation} className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[#3D2B33] text-[10.5px] font-bold px-1">Prescrever Orientação de Conduta:</label>
                        <textarea
                          rows={3}
                          placeholder={`Orientação clínica que aparecerá no início de ${activePatient.name.split(" ")[0]}...`}
                          value={recommendation}
                          onChange={(e) => setRecommendation(e.target.value)}
                          className="w-full bg-[#FAF3F6]/30 border border-[#F0DDE4] rounded-2xl p-3 text-xs text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] font-medium transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 active:scale-95"
                      >
                        Enviar Orientação Clínica
                      </button>
                    </form>

                    <div className="border-t border-[#F0DDE4]/40 pt-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[#3D2B33] text-[10.5px] font-bold px-1">Prescrever Novo Exame / Vacina:</label>
                        <select
                          value={selectedExame}
                          onChange={(e) => setSelectedExame(e.target.value)}
                          className="w-full bg-[#FAF3F6]/30 border border-[#F0DDE4] rounded-2xl px-3 py-2 text-xs text-[#3D2B33] outline-none focus:border-[#C38B9B] transition-colors"
                        >
                          <option value="Ultrassom Morfológico 2º Tri">Ultrassom Morfológico 2º Tri (20-24 sem)</option>
                          <option value="Curva Glicêmica (TOTG 75g)">Curva Glicêmica (TOTG 75g)</option>
                          <option value="Ecocardiograma Fetal">Ecocardiograma Fetal</option>
                          <option value="Vacina dTpa (Coqueluche)">Vacina dTpa (Coqueluche)</option>
                        </select>
                      </div>

                      <button
                        onClick={handlePrescribeExame}
                        className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 active:scale-95"
                      >
                        Prescrever e Adicionar à Agenda
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
