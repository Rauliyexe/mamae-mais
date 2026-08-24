import React from "react";
import { 
  TrendingUp, Users, HeartPulse, Activity, ShieldCheck, 
  BarChart3, Award, FileSpreadsheet, Download, CheckCircle2
} from "lucide-react";

export default function PresenzAnalyticsView() {
  return (
    <div className="space-y-5 animate-fadeIn font-albert">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8CA9B0] font-poppins">
            Adesão ao Tratamento
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-poppins">94.2%</span>
            <span className="text-[10px] text-emerald-400 font-bold">+3.8% este mês</span>
          </div>
          <p className="text-[11px] text-[#A6C5CB] mt-1">Sincronização contínua via Presenz App</p>
        </div>

        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8CA9B0] font-poppins">
            Tempo no Alvo (TIR - Diabéticos)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#8BE3D7] font-poppins">82.6%</span>
            <span className="text-[10px] text-[#7EC8C0] font-bold">Meta ADA &gt; 70%</span>
          </div>
          <p className="text-[11px] text-[#A6C5CB] mt-1">Controle glicêmico otimizado</p>
        </div>

        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8CA9B0] font-poppins">
            Controle Pressórico da Carteira
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-poppins">88.9%</span>
            <span className="text-[10px] text-emerald-400 font-bold">PA &lt; 130/80</span>
          </div>
          <p className="text-[11px] text-[#A6C5CB] mt-1">Pacientes hipertensos compensados</p>
        </div>

        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8CA9B0] font-poppins">
            Desfechos Obstétricos (Mamãe+)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#E6A4B4] font-poppins">98.5%</span>
            <span className="text-[10px] text-[#E6A4B4] font-bold">Parto a Termo</span>
          </div>
          <p className="text-[11px] text-[#A6C5CB] mt-1">Zero intercorrências graves no trimestre</p>
        </div>
      </div>

      {/* Specialty Breakdown & Health Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Specialty Distribution */}
        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-[#98D8D0]">
            <BarChart3 size={15} className="text-[#7EC8C0]" />
            Distribuição de Pacientes por Especialidade Ativa
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span>Obstetrícia & Medicina Fetal (Mamãe+)</span>
                <span className="text-[#E6A4B4]">42% (28 gestantes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0A1619] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E6A4B4] to-[#C38B9B] rounded-full w-[42%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span>Cardiologia & Telemetria Cardiovascular</span>
                <span className="text-[#8BE3D7]">28% (19 pacientes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0A1619] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] rounded-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span>Endocrinologia & Diabetes (CGM)</span>
                <span className="text-[#A8E6CF]">16% (11 pacientes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0A1619] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#A8E6CF] to-[#7EC8C0] rounded-full w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-white mb-1">
                <span>Pediatria & Puericultura</span>
                <span className="text-[#FFD3B6]">14% (9 pacientes)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0A1619] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FFD3B6] to-[#F39C9C] rounded-full w-[14%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quality Audit & Executive Reports */}
        <div className="bg-[#112025]/85 backdrop-blur-xl border border-[#7EC8C0]/20 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-poppins font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-[#98D8D0]">
              <Award size={15} className="text-[#7EC8C0]" />
              Conformidade Regulatória & Auditoria Hospitalar
            </h4>
            <p className="text-xs text-[#A6C5CB] leading-relaxed">
              Todos os registros biométricos, teleconsultas e prescrições com assinatura digital ICP-Brasil possuem trilha de auditoria compatível com LGPD e CFM.
            </p>
          </div>

          <div className="p-3 bg-[#0A1619] rounded-2xl border border-[#7EC8C0]/20 space-y-1 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 size={14} />
              <span>Selo de Qualidade Assistencial Presenz 2026</span>
            </div>
            <p className="text-[#8CA9B0] text-[11px]">Taxa de resolubilidade ambulatorial de 96.4%.</p>
          </div>

          <button
            type="button"
            className="w-full py-2.5 bg-[#162B30] hover:bg-[#7EC8C0] text-[#7EC8C0] hover:text-[#0C1618] border border-[#7EC8C0]/30 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>Exportar Relatório Clínico Consolidado (PDF / Excel)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
