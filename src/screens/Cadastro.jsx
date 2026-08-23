import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Cadastro() {
  const { signup, navigate } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (!email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve conter pelo menos 6 caracteres.");
      return;
    }
    setError("");
    signup(name, email, password);
  };

  return (
    <div className="w-full min-h-full px-6 pt-10 pb-8 flex flex-col justify-between animate-fadeIn bg-[#FAF8F5]">
      {/* Welcome Header */}
      <div className="flex flex-col items-center mt-4">
        <img src={logoImg} alt="Logo Mamãe+" className="w-28 h-28 object-contain mb-4" />
        <h1 className="text-[#4A4743] text-[22px] font-bold font-poppins text-center leading-tight">
          Crie sua conta!
        </h1>
        <p className="text-[#8C6B7A] text-[12.5px] text-center font-albert mt-2 leading-relaxed px-1 font-medium">
          Junte-se ao Mamãe+ e acompanhe sua gestação com dicas clínicas, registros de saúde e muito carinho.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex-1 flex flex-col gap-3.5">
        {error && (
          <div className="bg-red-50 text-red-600 text-[11.5px] p-2.5 rounded-xl font-bold font-albert border border-red-200/50 text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1" style={{ fontFamily: "Albert Sans" }}>
            Nome
          </label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como prefere ser chamada?"
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-sm font-medium"
              style={{ fontFamily: "Albert Sans" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
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
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-sm font-medium"
              style={{ fontFamily: "Albert Sans" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1" style={{ fontFamily: "Albert Sans" }}>
            Senha
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C6B7A]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition shadow-sm font-medium"
              style={{ fontFamily: "Albert Sans" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-[13px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer"
          style={{ fontFamily: "Albert Sans" }}
        >
          Criar conta
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-[#8C6B7A] text-[12px] font-medium" style={{ fontFamily: "Albert Sans" }}>
          Já tem uma conta?{" "}
          <button
            onClick={() => navigate("login")}
            className="text-[#C38B9B] font-bold hover:underline cursor-pointer"
          >
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
}
