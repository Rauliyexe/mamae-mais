import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, Layers, Sparkles } from "lucide-react";

export default function Formulario() {
  const { saveOnboarding } = useApp();
  const [lmpDate, setLmpDate] = useState("2026-03-10");
  const [weeks, setWeeks] = useState("17");
  const [dueDate, setDueDate] = useState("2026-12-15");
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);

  useEffect(() => {
    if (!lmpDate) return;
    try {
      const lmp = new Date(lmpDate);
      if (isNaN(lmp.getTime())) return;
      
      const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
      const yyyy = edd.getFullYear();
      const mm = String(edd.getMonth() + 1).padStart(2, "0");
      const dd = String(edd.getDate()).padStart(2, "0");
      setDueDate(`${yyyy}-${mm}-${dd}`);

      const diffTime = Math.abs(new Date() - lmp);
      const estimatedWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      if (estimatedWeeks >= 14 && estimatedWeeks <= 20) {
        setWeeks(String(estimatedWeeks));
      }
    } catch (e) {
      console.error(e);
    }
  }, [lmpDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveOnboarding(lmpDate, weeks, dueDate, isFirstPregnancy);
  };

  return (
    <div className="w-full min-h-full px-6 pt-8 pb-8 flex flex-col justify-between animate-fadeIn bg-[#FDF5F8]">
      {/* Title Header */}
      <div>
        <h1 className="text-[#6B2D4E] text-[21px] font-bold font-poppins text-center leading-tight">
          Vamos te conhecer melhor
        </h1>
        <p className="text-[#8C6B7A] text-[12.5px] text-center font-albert mt-2 leading-relaxed px-1 font-medium">
          Ajuste as informações básicas para personalizarmos seu acompanhamento de pré-natal.
        </p>
      </div>

      {/* Onboarding Form */}
      <form onSubmit={handleSubmit} className="mt-6 flex-1 flex flex-col gap-4.5">
        {/* LMP Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1 flex items-center gap-1.5" style={{ fontFamily: "Albert Sans" }}>
            <Calendar size={13} className="text-[#D4638F]" />
            Data da última menstruação (DUM)
          </label>
          <input
            type="date"
            value={lmpDate}
            onChange={(e) => setLmpDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] outline-none focus:border-[#D4638F] transition shadow-sm font-medium"
            style={{ fontFamily: "Albert Sans" }}
            required
          />
        </div>

        {/* Weeks Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1 flex items-center gap-1.5" style={{ fontFamily: "Albert Sans" }}>
            <Layers size={13} className="text-[#D4638F]" />
            Em qual semana gestacional você está agora?
          </label>
          <select
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] outline-none focus:border-[#D4638F] transition shadow-sm font-medium"
            style={{ fontFamily: "Albert Sans" }}
          >
            {[14, 15, 16, 17, 18, 19, 20].map((w) => (
              <option key={w} value={w}>
                Semana {w}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-[#8C6B7A] px-1 italic">
            Mostrando semanas recomendadas de 14 a 20.
          </span>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#3D2B33] text-[11.5px] font-bold px-1 flex items-center gap-1.5" style={{ fontFamily: "Albert Sans" }}>
            <Sparkles size={13} className="text-[#D4638F]" />
            Data prevista para o parto (D.P.P.)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-[#F0DDE4] rounded-card text-[12.5px] text-[#3D2B33] outline-none focus:border-[#D4638F] transition shadow-sm font-medium"
            style={{ fontFamily: "Albert Sans" }}
            required
          />
          <span className="text-[10px] text-[#D4638F] px-1 font-bold">
            Estimado clinicamente com base na DUM.
          </span>
        </div>

        {/* Is First Pregnancy */}
        <div className="flex items-center justify-between bg-white border border-[#F0DDE4] rounded-card p-4 shadow-sm mt-1">
          <div>
            <p className="text-[#3D2B33] text-[12.5px] font-bold leading-tight" style={{ fontFamily: "Albert Sans" }}>
              É sua primeira gravidez?
            </p>
            <p className="text-[#8C6B7A] text-[10px] mt-0.5" style={{ fontFamily: "Albert Sans" }}>
              Isso adapta os guias e recomendações.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFirstPregnancy(!isFirstPregnancy)}
            className={`w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex items-center px-0.5 cursor-pointer ${
              isFirstPregnancy ? "bg-[#D4638F]" : "bg-[#8C6B7A]/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                isFirstPregnancy ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-[#D4638F] hover:bg-[#B84D75] text-white font-extrabold text-[13.5px] py-3.5 rounded-full shadow-md transition duration-150 active:scale-[0.98] outline-none cursor-pointer"
          style={{ fontFamily: "Albert Sans" }}
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
