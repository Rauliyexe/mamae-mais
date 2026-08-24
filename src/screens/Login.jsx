import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import PresenzLogo, { PresenzIcon } from "../components/PresenzLogo";
import { 
  Mail, Lock, Heart, Stethoscope, ShieldCheck, Sparkles, 
  Building2, UserPlus, LogIn, Award, Activity, CheckCircle2,
  ArrowRight, Radio
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
    <div className={`w-full min-h-full px-5 sm:px-6 pt-6 pb-6 flex flex-col justify-between animate-fadeIn transition-colors duration-300 ${
      authType === "presenz" ? "bg-[#070F12] text-[#E2E8F0]" : "bg-[#FAF8F5] text-[#3D2B33]"
    }`}>
      {/* Brand Header */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          {authType === "mother" ? (
            <img src={logoImg} alt="Logo" className="w-16 h-16 sm:w-18 sm:h-18 object-contain" />
          ) : (
            <PresenzLogo size="lg" showSlogan={true} />
          )}
        </div>

        {/* Global Module Switcher (Mamãe+ vs Presenz Médicos) */}
        <div className={`w-full max-w-sm grid grid-cols-2 p-1 rounded-2xl shadow-xs mb-3.5 border transition-all ${
          authType === "presenz" 
            ? "bg-[#0A161B] border-[#00F2C3]/30" 
            : "bg-white border-[#F0DDE4]"
        }`}>
          <button
            type="button"
            onClick={() => {
              setAuthType("mother");
              setError("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
              authType === "mother"
                ? "bg-[#C38B9B] text-white shadow-xs"
                : "text-[#8C6B7A] hover:text-[#4A4743] hover:bg-[#FAF3F6]"
            }`}
          >
            <Heart size={14} className={authType === "mother" ? "fill-white/30" : ""} />
            Mamãe+ (Gestante)
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthType("presenz");
              setError("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
              authType === "presenz"
                ? "bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] text-[#070F12] shadow-[0_0_15px_rgba(0,242,195,0.4)] font-black"
                : "text-[#8C6B7A] hover:text-[#00F2C3] hover:bg-[#00F2C3]/10"
            }`}
          >
            <Stethoscope size={14} />
            Presenz (Médicos)
          </button>
        </div>

        {/* Dynamic Sub-header */}
        {authType === "mother" ? (
          <>
            <h1 className="text-[#4A4743] text-[20px] sm:text-[22px] font-bold font-poppins text-center leading-tight">
              Seja bem-vinda de volta!
            </h1>
            <p className="text-[#8C6B7A] text-[12px] text-center font-albert mt-1 leading-relaxed px-1 font-medium max-w-xs">
              Acompanhe sua gestação, exames, chutes e saúde com segurança.
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#00F2C3]/10 text-[#00F2C3] border border-[#00F2C3]/30 text-[9.5px] font-extrabold uppercase tracking-wider font-poppins mb-1">
              <Radio size={11} className="text-[#00F2C3] animate-pulse" />
              Presenz Clinical Cloud · Cuidado em Tempo Real
            </div>
            <h1 className="text-white text-[19px] sm:text-[21px] font-bold font-poppins text-center leading-tight">
              Portal do Médico Obstetra
            </h1>
            <p className="text-[#7E99A3] text-[11.5px] text-center font-albert mt-0.5 leading-relaxed px-1 font-medium max-w-xs">
              Cardiotocografia em tempo real, prontuários NFC e telemetria.
            </p>

            {/* Doctor Sub-tabs: Login vs Cadastro */}
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <button
                type="button"
                onClick={() => {
                  setPresenzMode("login");
                  setError("");
                }}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  presenzMode === "login"
                    ? "bg-[#00F2C3] text-[#070F12] font-black shadow-[0_0_10px_rgba(0,242,195,0.3)]"
                    : "bg-[#0A161B] text-[#00F2C3] border border-[#00F2C3]/30 hover:bg-[#00F2C3]/10"
                }`}
              >
                <LogIn size={11} className="inline mr-1" />
                Login CRM
              </button>
              <button
                type="button"
                onClick={() => {
                  setPresenzMode("signup");
                  setError("");
                }}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  presenzMode === "signup"
                    ? "bg-[#00F2C3] text-[#070F12] font-black shadow-[0_0_10px_rgba(0,242,195,0.3)]"
                    : "bg-[#0A161B] text-[#00F2C3] border border-[#00F2C3]/30 hover:bg-[#00F2C3]/10"
                }`}
              >
                <UserPlus size={11} className="inline mr-1" />
                Cadastro Médico
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forms Area */}
      <div className="mt-3 flex-1 flex flex-col justify-center">
        {error && (
          <div className="mb-3 bg-red-500/20 text-red-400 text-[11.5px] p-2.5 rounded-xl font-bold font-albert border border-red-500/30 text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* 1. MOTHER LOGIN */}
        {authType === "mother" && (
          <form onSubmit={handleMotherSubmit} className="flex flex-col gap-3">
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
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
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
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-[13.5px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert"
            >
              Entrar como Gestante
            </button>
          </form>
        )}

        {/* 2. PRESENZ DOCTOR LOGIN */}
        {authType === "presenz" && presenzMode === "login" && (
          <form onSubmit={handleDoctorLogin} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[#A0B8C2] text-[11px] font-bold px-1 font-albert">
                  Número do CRM
                </label>
                <div className="relative">
                  <Stethoscope size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00F2C3]" />
                  <input
                    type="text"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    placeholder="Ex: 184920"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition shadow-xs font-semibold font-albert"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#A0B8C2] text-[11px] font-bold px-1 font-albert">
                  UF CRM
                </label>
                <select
                  value={crmUf}
                  onChange={(e) => setCrmUf(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white outline-none focus:border-[#00F2C3] transition shadow-xs font-semibold font-albert cursor-pointer"
                >
                  {BRAZIL_UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#A0B8C2] text-[11px] font-bold px-1 font-albert">
                Senha de Acesso Clínico
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E99A3]" />
                <input
                  type="password"
                  value={doctorPassword}
                  onChange={(e) => setDoctorPassword(e.target.value)}
                  placeholder="Sua senha médica"
                  className="w-full pl-10 pr-3 py-2 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            {/* Quick Demo Filler */}
            <button
              type="button"
              onClick={fillDoctorDemo}
              className="w-full py-1.5 px-2.5 bg-[#00F2C3]/10 hover:bg-[#00F2C3]/20 text-[#00F2C3] border border-[#00F2C3]/30 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={12} className="text-[#00F2C3]" />
              Preencher Demo: Dr. Leonardo Pinto (CRM/SP 184920)
            </button>

            <button
              type="submit"
              className="w-full mt-1 bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] hover:from-[#00D4AA] text-[#070F12] font-black text-[13px] py-3 rounded-full shadow-[0_0_20px_rgba(0,242,195,0.4)] transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert"
            >
              Acessar Portal Presenz
            </button>
          </form>
        )}

        {/* 3. PRESENZ DOCTOR SIGNUP (CADASTRO MÉDICO) */}
        {authType === "presenz" && presenzMode === "signup" && (
          <form onSubmit={handleDoctorSignup} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                Nome Completo do Médico
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Ex: Dra. Mariana Vasconcelos"
                className="w-full px-3 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-0.5">
                <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                  CRM
                </label>
                <input
                  type="text"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                  placeholder="Ex: 219840"
                  maxLength={10}
                  className="w-full px-3 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition font-semibold"
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                  UF
                </label>
                <select
                  value={crmUf}
                  onChange={(e) => setCrmUf(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white outline-none focus:border-[#00F2C3] transition font-semibold cursor-pointer"
                >
                  {BRAZIL_UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5">
                <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                  Especialidade
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[11px] text-white outline-none focus:border-[#00F2C3] transition font-medium cursor-pointer"
                >
                  {SPECIALTIES.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                  Hospital / Clínica
                </label>
                <input
                  type="text"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  placeholder="Ex: Maternidade Pro Matre"
                  className="w-full px-3 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[11px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <label className="text-[#A0B8C2] text-[10.5px] font-bold px-1 font-albert">
                Criar Senha de Acesso
              </label>
              <input
                type="password"
                value={doctorPassword}
                onChange={(e) => setDoctorPassword(e.target.value)}
                placeholder="Mínimo 6 dígitos"
                className="w-full px-3 py-1.5 bg-[#0A161B] border border-[#00F2C3]/30 rounded-xl text-[12px] text-white placeholder-[#7E99A3] outline-none focus:border-[#00F2C3] transition font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-1 bg-gradient-to-r from-[#00F2C3] to-[#00E5FF] hover:from-[#00D4AA] text-[#070F12] font-black text-[12.5px] py-2.5 rounded-full shadow-[0_0_20px_rgba(0,242,195,0.4)] transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              Concluir Cadastro & Acessar Presenz
            </button>
          </form>
        )}
      </div>

      {/* Footer Details */}
      <div className="mt-4 flex flex-col items-center">
        {authType === "mother" ? (
          <p className="text-[#8C6B7A] text-[12px] font-medium font-albert">
            Ainda não tem uma conta?{" "}
            <button
              onClick={() => navigate("cadastro")}
              className="text-[#C38B9B] font-bold hover:underline cursor-pointer"
            >
              Cadastre-se
            </button>
          </p>
        ) : (
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#00F2C3]/80 font-medium font-albert text-center">
            <ShieldCheck size={13} className="text-[#00F2C3]" />
            <span>Presenz Medical Cloud · Conformidade CFM nº 2.314/2022 e LGPD Saúde.</span>
          </div>
        )}
      </div>
    </div>
  );
}
