import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, Heart } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Login() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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

  return (
    <div className="w-full min-h-full px-6 pt-10 pb-8 flex flex-col justify-between animate-fadeIn bg-[#FAF8F5]">
      {/* Logo / Welcome Header */}
      <div className="flex flex-col items-center mt-6">
        <img src={logoImg} alt="Logo Mamãe+" className="w-32 h-32 object-contain mb-5" />
        <h1 className="text-[#4A4743] text-[23px] font-bold font-poppins text-center leading-tight">
          Seja bem-vinda de volta!
        </h1>
        <p className="text-[#8C6B7A] text-[12.5px] text-center font-albert mt-2.5 leading-relaxed px-1 font-medium">
          Acompanhe cada momento da sua gestação com amor, cuidado e informação clínica de confiança.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-8 flex-1 flex flex-col gap-4.5">
        {error && (
          <div className="bg-red-50 text-red-600 text-[12px] p-3 rounded-xl font-bold font-albert border border-red-200/50 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1" style={{ fontFamily: "Albert Sans" }}>
            E-mail
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-sm font-medium"
              style={{ fontFamily: "Albert Sans" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1" style={{ fontFamily: "Albert Sans" }}>
            Senha
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-sm font-medium"
              style={{ fontFamily: "Albert Sans" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-[13.5px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer"
          style={{ fontFamily: "Albert Sans" }}
        >
          Entrar
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-[#8C6B7A] text-[12px] font-medium" style={{ fontFamily: "Albert Sans" }}>
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
  );
}
