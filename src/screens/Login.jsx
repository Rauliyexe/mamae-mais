import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import PresenzLogo, { PresenzIcon } from "../components/PresenzLogo";
import { 
  Mail, Lock, Heart, Stethoscope, ShieldCheck, Sparkles, 
  Building2, UserPlus, LogIn, Award, Activity, CheckCircle2,
  ArrowRight, Radio, HeartPulse, Wifi, Shield, ArrowLeftRight
} from "lucide-react";
import logoImg from "../assets/logo.png";

const BRAZIL_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const SPECIALTIES = [
  "Ginecologia & Obstetrícia",
  "Medicina Fetal",
  "Obstetrícia de Alto Risco",
  "Neonatologia & Pediatria",
  "Clínica Geral & Saúde da Família",
  "Enfermagem Obstétrica"
];

export default function Login() {
  const { login, loginDoctor, signupDoctor, navigate } = useApp();
  
  // Main Module Selector: 'mother' (Mamãe+) | 'presenz' (Presenz Médicos)
  const [authType, setAuthType] = useState("mother");

  // Sub-mode for Presenz: 'login' | 'signup'
  const [presenzMode, setPresenzMode] = useState("login");

  // Mother form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Doctor / Presenz form state
  const [crm, setCrm] = useState("");
  const [crmUf, setCrmUf] = useState("SP");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("Ginecologia & Obstetrícia");
  const [clinic, setClinic] = useState("");

  const [error, setError] = useState("");

  // Handle Mother Login
  const handleMotherSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (!email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    setError("");
    login(email, password);
  };

  // Handle Doctor Login
  const handleDoctorLogin = (e) => {
    e.preventDefault();
    const cleanCrm = crm.replace(/\D/g, "");
    if (!cleanCrm) {
      setError("Por favor, informe o número do seu CRM.");
      return;
    }
    if (cleanCrm.length < 4) {
      setError("Número de CRM inválido. Mínimo de 4 dígitos.");
      return;
    }
    if (!doctorPassword.trim()) {
      setError("Por favor, digite sua senha de acesso.");
      return;
    }
    setError("");
    loginDoctor({
      crm: cleanCrm,
      uf: crmUf,
      name: doctorName || `Dr. Leonardo Pinto`,
      specialty: specialty || "Ginecologia & Obstetrícia",
      clinic: clinic || "Hospital e Maternidade Santa Clara",
    });
  };

  // Handle Doctor Registration (Cadastro Presenz)
  const handleDoctorSignup = (e) => {
    e.preventDefault();
    if (!doctorName.trim()) {
      setError("Por favor, informe seu nome completo.");
      return;
    }
    const cleanCrm = crm.replace(/\D/g, "");
    if (!cleanCrm || cleanCrm.length < 4) {
      setError("Por favor, insira um número de CRM válido.");
      return;
    }
    if (!doctorPassword.trim() || doctorPassword.length < 6) {
      setError("A senha médica deve ter pelo menos 6 dígitos.");
      return;
    }
    setError("");
    signupDoctor({
      name: doctorName,
      crm: cleanCrm,
      uf: crmUf,
      specialty,
      clinic: clinic || "Hospital / Clínica Médica",
      password: doctorPassword,
    });
  };

  // Fill demo doctor data
  const fillDoctorDemo = () => {
    setCrm("184920");
    setCrmUf("SP");
    setDoctorPassword("medico123");
    setDoctorName("Dr. Leonardo Pinto");
    setSpecialty("Ginecologia & Obstetrícia");
    setClinic("Hospital e Maternidade Santa Clara");
    setError("");
  };

  return (
    <div className={`w-full min-h-screen transition-all duration-500 ease-in-out flex flex-col justify-center items-center p-3 sm:p-6 select-none font-albert ${
      authType === "presenz" ? "bg-[#0C1618] text-[#E2E8F0]" : "bg-[#FAF8F5] text-[#3D2B33]"
    }`}>

      {/* ========================================================================= */}
      {/* 1. MAMÃE+ LAYOUT (PASTEL ROSE & WARM CREAM CENTERED CARD) */}
      {/* ========================================================================= */}
      {authType === "mother" && (
        <div className="w-full max-w-[480px] bg-white sm:rounded-[36px] p-6 sm:p-8 border border-[#F0DDE4] shadow-mamaeStrong animate-fadeIn flex flex-col min-h-screen sm:min-h-0 justify-between transition-all duration-300">
          {/* Top Brand Header */}
          <div className="flex flex-col items-center">
            <img src={logoImg} alt="Logo Mamãe+" className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-3" />
            
            {/* Mode Selector Tabs */}
            <div className="w-full grid grid-cols-2 p-1 bg-[#FAF3F6] border border-[#F0DDE4] rounded-2xl mb-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins bg-[#C38B9B] text-white shadow-xs"
              >
                <Heart size={14} className="fill-white/30" />
                Mamãe+ (Gestante)
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthType("presenz");
                  setError("");
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins text-[#7E99A3] hover:text-[#273A40] hover:bg-white transition-all cursor-pointer"
              >
                <Stethoscope size={14} />
                Presenz (Médicos)
              </button>
            </div>

            <h1 className="text-[#4A4743] text-[22px] font-bold font-poppins text-center leading-tight">
              Seja bem-vinda de volta!
            </h1>
            <p className="text-[#8C6B7A] text-[12.5px] text-center font-albert mt-1.5 leading-relaxed px-1 font-medium">
              Acompanhe sua gestação com carinho, diário de bordo e acompanhamento com sua equipe médica.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleMotherSubmit} className="mt-5 flex-1 flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-50 text-red-600 text-[11.5px] p-2.5 rounded-xl font-bold font-albert border border-red-200/50 text-center animate-fadeIn">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[#3D2B33] text-[11.5px] font-bold px-1 font-albert">
                E-mail da Gestante
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#3D2B33] text-[11.5px] font-bold px-1 font-albert">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-[13.5px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert"
            >
              Entrar como Gestante
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-[#8C6B7A] text-[12px] font-medium font-albert">
              Ainda não tem uma conta?{" "}
              <button
                onClick={() => navigate("cadastro")}
                className="text-[#C38B9B] font-bold hover:underline cursor-pointer"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRESENZ SUITE LAYOUT (PASTEL TEAL & SLATE EXPANSIVE SPLIT LAYOUT) */}
      {/* ========================================================================= */}
      {authType === "presenz" && (
        <div className="w-full max-w-5xl my-auto animate-fadeIn transition-all duration-500 ease-in-out">
          
          {/* Top Switcher Ribbon */}
          <div className="flex justify-between items-center mb-4 px-2">
            <button
              onClick={() => {
                setAuthType("mother");
                setError("");
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#A8D5CF] hover:text-white bg-[#132328] hover:bg-[#1A2E35] border border-[#7EC8C0]/30 px-4 py-2 rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeftRight size={14} className="text-[#7EC8C0]" />
              <span>Trocar para App da Mãe (Mamãe+)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7EC8C0] animate-ping" />
              <span className="text-[10.5px] font-extrabold uppercase tracking-widest text-[#7EC8C0] font-poppins">
                Presenz Medical Cloud Ativo
              </span>
            </div>
          </div>

          {/* Expansive Split Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#101D21]/90 backdrop-blur-xl border border-[#7EC8C0]/25 rounded-[36px] overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.4)]">
            
            {/* Left Feature Showcase Banner */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-[#13252A] to-[#0D181B] border-b lg:border-b-0 lg:border-r border-[#7EC8C0]/20 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <PresenzLogo size="lg" showSlogan={true} />

                <div className="space-y-3 pt-2">
                  <h3 className="font-poppins font-bold text-white text-base leading-snug">
                    Suíte Multidisciplinar para Médicos e Obstetras
                  </h3>
                  <p className="text-xs text-[#9BBEC5] leading-relaxed">
                    Acompanhamento fetal em tempo real, integração direta de prontuários com cartões NFC e transmissão de laudos com carimbo do CRM.
                  </p>
                </div>

                {/* Feature Bullets */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-[#D1ECE8] bg-[#0A1618]/70 p-2.5 rounded-xl border border-[#7EC8C0]/15">
                    <HeartPulse size={16} className="text-[#7EC8C0] shrink-0" />
                    <span>Cardiotocografia & FCF Contínuo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#D1ECE8] bg-[#0A1618]/70 p-2.5 rounded-xl border border-[#7EC8C0]/15">
                    <Radio size={16} className="text-[#7EC8C0] shrink-0" />
                    <span>Prontuário de Emergência Pareado via NFC</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#D1ECE8] bg-[#0A1618]/70 p-2.5 rounded-xl border border-[#7EC8C0]/15">
                    <Sparkles size={16} className="text-[#7EC8C0] shrink-0" />
                    <span>Presenz AI Copilot para Laudos e Condutas</span>
                  </div>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="pt-6 relative z-10">
                <div className="flex items-center gap-2 text-[10.5px] text-[#7EC8C0] font-medium">
                  <ShieldCheck size={14} className="text-[#7EC8C0]" />
                  <span>Em conformidade com a Resolução CFM nº 2.314/2022.</span>
                </div>
              </div>
            </div>

            {/* Right Authentication Form Area */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#101D21]">
              <div>
                {/* Presenz Sub-Tabs: Login vs Cadastro */}
                <div className="grid grid-cols-2 p-1 bg-[#091416] border border-[#7EC8C0]/20 rounded-2xl mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPresenzMode("login");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
                      presenzMode === "login"
                        ? "bg-[#7EC8C0] text-[#0C1618] shadow-xs font-extrabold"
                        : "text-[#9BBEC5] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <LogIn size={13} />
                    Já possuo CRM (Entrar)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPresenzMode("signup");
                      setError("");
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
                      presenzMode === "signup"
                        ? "bg-[#7EC8C0] text-[#0C1618] shadow-xs font-extrabold"
                        : "text-[#9BBEC5] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UserPlus size={13} />
                    Cadastrar Novo CRM
                  </button>
                </div>

                {error && (
                  <div className="mb-3 bg-red-500/20 text-red-300 text-[11.5px] p-2.5 rounded-xl font-bold font-albert border border-red-500/30 text-center animate-fadeIn">
                    {error}
                  </div>
                )}

                {/* Sub-Form 1: Login CRM */}
                {presenzMode === "login" && (
                  <form onSubmit={handleDoctorLogin} className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-[#C2E0DC] text-[11px] font-bold px-1 font-albert">
                          Número do CRM
                        </label>
                        <div className="relative">
                          <Stethoscope size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7EC8C0]" />
                          <input
                            type="text"
                            value={crm}
                            onChange={(e) => setCrm(e.target.value)}
                            placeholder="Ex: 184920"
                            maxLength={10}
                            className="w-full pl-10 pr-3 py-2.5 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12.5px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-semibold font-albert"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[#C2E0DC] text-[11px] font-bold px-1 font-albert">
                          UF do CRM
                        </label>
                        <select
                          value={crmUf}
                          onChange={(e) => setCrmUf(e.target.value)}
                          className="w-full px-2.5 py-2.5 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12.5px] text-white outline-none focus:border-[#7EC8C0] transition font-semibold font-albert cursor-pointer"
                        >
                          {BRAZIL_UFS.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#C2E0DC] text-[11px] font-bold px-1 font-albert">
                        Senha de Acesso Clínico
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#688A92]" />
                        <input
                          type="password"
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                          placeholder="Digite sua senha médica"
                          className="w-full pl-10 pr-3 py-2.5 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12.5px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-medium font-albert"
                        />
                      </div>
                    </div>

                    {/* Quick Demo Pre-fill */}
                    <button
                      type="button"
                      onClick={fillDoctorDemo}
                      className="w-full py-2 px-3 bg-[#162A30] hover:bg-[#1C363D] text-[#7EC8C0] border border-[#7EC8C0]/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles size={13} className="text-[#7EC8C0]" />
                      Preencher Demonstração: Dr. Leonardo Pinto (CRM/SP 184920)
                    </button>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] hover:to-[#4FA49A] text-[#0C1618] font-extrabold text-[13.5px] py-3 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert"
                    >
                      Acessar Portal Clínico Presenz
                    </button>
                  </form>
                )}

                {/* Sub-Form 2: Cadastro Novo CRM */}
                {presenzMode === "signup" && (
                  <form onSubmit={handleDoctorSignup} className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                        Nome Completo do Médico
                      </label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="Ex: Dra. Mariana Vasconcelos"
                        className="w-full px-3 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 flex flex-col gap-0.5">
                        <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                          CRM
                        </label>
                        <input
                          type="text"
                          value={crm}
                          onChange={(e) => setCrm(e.target.value)}
                          placeholder="Ex: 219840"
                          maxLength={10}
                          className="w-full px-3 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-semibold"
                        />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                          UF
                        </label>
                        <select
                          value={crmUf}
                          onChange={(e) => setCrmUf(e.target.value)}
                          className="w-full px-2 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12px] text-white outline-none focus:border-[#7EC8C0] transition font-semibold cursor-pointer"
                        >
                          {BRAZIL_UFS.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                          Especialidade
                        </label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full px-2 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[11px] text-white outline-none focus:border-[#7EC8C0] transition font-medium cursor-pointer"
                        >
                          {SPECIALTIES.map((esp) => (
                            <option key={esp} value={esp}>{esp}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                          Hospital / Clínica
                        </label>
                        <input
                          type="text"
                          value={clinic}
                          onChange={(e) => setClinic(e.target.value)}
                          placeholder="Ex: Pro Matre"
                          className="w-full px-3 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[11px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[#C2E0DC] text-[10.5px] font-bold px-1 font-albert">
                        Criar Senha de Acesso
                      </label>
                      <input
                        type="password"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        placeholder="Mínimo 6 dígitos"
                        className="w-full px-3 py-2 bg-[#091416] border border-[#7EC8C0]/30 rounded-xl text-[12px] text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] transition font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-1.5 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-extrabold text-[13px] py-2.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      Concluir Cadastro & Acessar Presenz
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
