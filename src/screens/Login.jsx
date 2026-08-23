import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, Heart, Stethoscope, ShieldCheck, Award, Sparkles, Building2 } from "lucide-react";
import logoImg from "../assets/logo.png";

const BRAZIL_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function Login() {
  const { login, loginDoctor, navigate } = useApp();
  
  // Tab: 'mother' | 'doctor'
  const [authType, setAuthType] = useState("mother");

  // Mother form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Doctor form
  const [crm, setCrm] = useState("");
  const [crmUf, setCrmUf] = useState("SP");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Leonardo Pinto");
  const [specialty, setSpecialty] = useState("Ginecologia & Obstetrícia");

  const [error, setError] = useState("");

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

  const handleDoctorSubmit = (e) => {
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
      setError("Por favor, digite sua senha de acesso médico.");
      return;
    }
    setError("");
    loginDoctor({
      crm: cleanCrm,
      uf: crmUf,
      name: doctorName || `Dr(a). CRM ${cleanCrm}`,
      specialty: specialty || "Obstetrícia",
      clinic: "Hospital e Maternidade Santa Clara",
    });
  };

  const fillDoctorDemo = () => {
    setCrm("184920");
    setCrmUf("SP");
    setDoctorPassword("medico123");
    setDoctorName("Dr. Leonardo Pinto");
    setSpecialty("Ginecologia & Obstetrícia");
    setError("");
  };

  return (
    <div className="w-full min-h-full px-5 sm:px-6 pt-8 pb-8 flex flex-col justify-between animate-fadeIn bg-[#FAF8F5]">
      {/* Top Brand Header */}
      <div className="flex flex-col items-center">
        <img src={logoImg} alt="Logo Mamãe+" className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-3" />
        
        {/* Role Selector Tabs */}
        <div className="w-full max-w-sm grid grid-cols-2 p-1 bg-white border border-[#F0DDE4] rounded-2xl shadow-xs mb-4">
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
            Gestante
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthType("doctor");
              setError("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer ${
              authType === "doctor"
                ? "bg-[#2B6CB0] text-white shadow-xs"
                : "text-[#8C6B7A] hover:text-[#4A4743] hover:bg-[#EBF8FF]"
            }`}
          >
            <Stethoscope size={14} />
            Médico (CRM)
          </button>
        </div>

        {authType === "mother" ? (
          <>
            <h1 className="text-[#4A4743] text-[21px] sm:text-[23px] font-bold font-poppins text-center leading-tight">
              Seja bem-vinda de volta!
            </h1>
            <p className="text-[#8C6B7A] text-[12px] text-center font-albert mt-1.5 leading-relaxed px-1 font-medium max-w-xs">
              Acompanhe sua gestação com carinho, diário de bordo e acompanhamento com sua equipe.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8] text-[10px] font-extrabold uppercase tracking-wider font-poppins mb-1.5">
              <ShieldCheck size={12} className="text-[#3182CE]" />
              Acesso Profissional Clínico
            </div>
            <h1 className="text-[#1A365D] text-[21px] sm:text-[23px] font-bold font-poppins text-center leading-tight">
              Portal do Médico
            </h1>
            <p className="text-[#4A5568] text-[12px] text-center font-albert mt-1.5 leading-relaxed px-1 font-medium max-w-xs">
              Área exclusiva para obstetras e especialistas acessarem laudos, telemetria e condutas.
            </p>
          </>
        )}
      </div>

      {/* Forms Section */}
      <div className="mt-4 flex-1 flex flex-col justify-center">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-[11.5px] p-3 rounded-xl font-bold font-albert border border-red-200/50 text-center animate-fadeIn">
            {error}
          </div>
        )}

        {authType === "mother" ? (
          /* MOTHER LOGIN FORM */
          <form onSubmit={handleMotherSubmit} className="flex flex-col gap-3.5">
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-[#F0DDE4] rounded-2xl text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-xs font-medium font-albert"
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
        ) : (
          /* DOCTOR CRM LOGIN FORM */
          <form onSubmit={handleDoctorSubmit} className="flex flex-col gap-3">
            {/* CRM and UF inputs side by side */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-[#2D3748] text-[11.5px] font-bold px-1 font-albert">
                  Número do CRM
                </label>
                <div className="relative">
                  <Stethoscope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3182CE]" />
                  <input
                    type="text"
                    value={crm}
                    onChange={(e) => setCrm(e.target.value)}
                    placeholder="Ex: 184920"
                    maxLength={10}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#BEE3F8] rounded-2xl text-[12.5px] text-[#1A202C] placeholder-[#A0AEC0] outline-none focus:border-[#3182CE] transition shadow-xs font-semibold font-albert"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#2D3748] text-[11.5px] font-bold px-1 font-albert">
                  UF Conselho
                </label>
                <select
                  value={crmUf}
                  onChange={(e) => setCrmUf(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#BEE3F8] rounded-2xl text-[12.5px] text-[#1A202C] outline-none focus:border-[#3182CE] transition shadow-xs font-semibold font-albert cursor-pointer"
                >
                  {BRAZIL_UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor Name / Identification */}
            <div className="flex flex-col gap-1">
              <label className="text-[#2D3748] text-[11.5px] font-bold px-1 font-albert">
                Nome do Profissional
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]" />
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. Nome Sobrenome"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#BEE3F8] rounded-2xl text-[12.5px] text-[#1A202C] placeholder-[#A0AEC0] outline-none focus:border-[#3182CE] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-[#2D3748] text-[11.5px] font-bold px-1 font-albert">
                Senha / Código de Acesso CFM
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]" />
                <input
                  type="password"
                  value={doctorPassword}
                  onChange={(e) => setDoctorPassword(e.target.value)}
                  placeholder="Digite sua senha médica"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#BEE3F8] rounded-2xl text-[12.5px] text-[#1A202C] placeholder-[#A0AEC0] outline-none focus:border-[#3182CE] transition shadow-xs font-medium font-albert"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill Button */}
            <button
              type="button"
              onClick={fillDoctorDemo}
              className="w-full py-2 px-3 bg-[#EBF8FF] hover:bg-[#BEE3F8]/60 text-[#2B6CB0] border border-[#BEE3F8] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-[#3182CE]" />
              Preencher Demo: Dr. Leonardo Pinto (CRM/SP 184920)
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-1 bg-gradient-to-r from-[#2B6CB0] to-[#3182CE] hover:from-[#2C5282] hover:to-[#2B6CB0] text-white font-extrabold text-[13.5px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer font-albert"
            >
              Acessar Portal Clínico (CRM)
            </button>
          </form>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-6 flex flex-col items-center">
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
          <div className="flex items-center gap-1.5 text-[11px] text-[#718096] font-medium font-albert text-center">
            <ShieldCheck size={13} className="text-[#38A169]" />
            <span>Ambiente seguro em conformidade com o CFM e LGPD Saúde.</span>
          </div>
        )}
      </div>
    </div>
  );
}
