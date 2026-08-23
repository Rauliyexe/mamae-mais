import React, { useEffect, useState } from "react";
import { MockAPI } from "../../data/mockApi";
import { AlertCircle, PhoneCall, HeartPulse, Droplet, Pill, AlertTriangle, Building2, User, UserSearch } from "lucide-react";

export default function PaginaEmergencia() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract cardId from URL: /emergencia/:cardId
    const pathParts = window.location.pathname.split("/");
    const cardId = pathParts[pathParts.length - 1];

    if (!cardId) {
      setError("ID do cartão inválido ou ausente.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const publicData = await MockAPI.getPublicEmergencyData(cardId);
        setData(publicData);
      } catch (err) {
        setError(err.message || "Erro ao carregar os dados do cartão.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-16 h-16 border-4 border-[#E53E3E] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-[#C53030] font-bold text-xl font-poppins">Acessando Dados Vitais...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <AlertTriangle size={64} className="text-[#E53E3E] mb-4" />
        <h2 className="text-[#C53030] font-bold text-2xl font-poppins mb-2">Erro de Leitura</h2>
        <p className="text-[#9B2C2C] text-lg font-medium">{error}</p>
      </div>
    );
  }

  // Helper to render field blocks
  const renderField = (label, value, IconComponent) => {
    if (!value) return null;
    return (
      <div className="bg-white p-4 rounded-xl border-l-4 border-[#E53E3E] shadow-sm flex items-start gap-4 mb-3">
        <div className="bg-[#FFF5F5] p-2 rounded-lg text-[#E53E3E] shrink-0 mt-0.5">
          <IconComponent size={24} />
        </div>
        <div>
          <p className="text-[#9B2C2C] text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-[#2D3748] text-lg font-bold leading-snug">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF2F2] font-albert text-[#2D3748] pb-12">
      {/* HEADER CRÍTICO */}
      <div className="bg-[#E53E3E] text-white p-6 pt-10 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle size={32} />
          <h1 className="text-2xl font-extrabold font-poppins uppercase tracking-wide">
            Ficha de Emergência
          </h1>
        </div>
        <p className="text-[#FED7D7] font-medium text-base">
          Gestante identificada via Cartão NFC Mamãe+
        </p>
      </div>

      <div className="p-5 max-w-lg mx-auto">
        
        {/* IDENTIFICAÇÃO PRINCIPAL */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#FEB2B2] mb-6">
          <h2 className="text-[#C53030] text-sm font-bold uppercase tracking-wider mb-2">Identificação da Paciente</h2>
          <p className="text-3xl font-extrabold font-poppins text-[#2D3748] leading-tight mb-4">
            {data.fullName || "Nome não disponibilizado"}
          </p>
          
          <div className="flex gap-4">
            {data.bloodType && (
              <div className="bg-[#FFF5F5] px-4 py-3 rounded-xl border border-[#FEB2B2] flex-1 text-center">
                <p className="text-[#C53030] text-xs font-bold uppercase mb-1">Tipo Sanguíneo</p>
                <div className="flex items-center justify-center gap-2">
                  <Droplet size={20} className="text-[#E53E3E] fill-[#E53E3E]" />
                  <span className="text-2xl font-extrabold text-[#C53030]">{data.bloodType}</span>
                </div>
              </div>
            )}
            {data.gestationalWeek && (
              <div className="bg-[#EBF8FF] px-4 py-3 rounded-xl border border-[#90CDF4] flex-1 text-center">
                <p className="text-[#2B6CB0] text-xs font-bold uppercase mb-1">Semana Atual</p>
                <span className="text-2xl font-extrabold text-[#2B6CB0]">{data.gestationalWeek} Sem</span>
              </div>
            )}
          </div>
        </div>

        {/* DADOS MÉDICOS */}
        <h3 className="text-[#C53030] text-base font-bold font-poppins mb-3 px-1 flex items-center gap-2">
          <HeartPulse size={20} /> Informações Clínicas
        </h3>
        
        {renderField("Condições de Risco", data.riskConditions, AlertTriangle)}
        {renderField("Alergias", data.allergies, AlertCircle)}
        {renderField("Medicações em Uso", data.medications, Pill)}
        {renderField("Maternidade / Hospital Ref.", data.hospital, Building2)}

        {/* CONTATO DE EMERGÊNCIA */}
        {(data.contactName || data.contactPhone) && (
          <>
            <h3 className="text-[#C53030] text-base font-bold font-poppins mb-3 mt-6 px-1 flex items-center gap-2">
              <UserSearch size={20} /> Contato de Emergência
            </h3>
            <div className="bg-white p-5 rounded-xl border-2 border-[#E53E3E] shadow-sm mb-4">
              <p className="text-[#718096] text-sm font-bold uppercase tracking-wider mb-1">Responsável / Parceiro(a)</p>
              <p className="text-[#2D3748] text-xl font-bold mb-4">{data.contactName || "Não informado"}</p>
              
              {data.contactPhone && (
                <a 
                  href={`tel:${data.contactPhone.replace(/\D/g, '')}`}
                  className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-colors shadow-md active:scale-95"
                >
                  <PhoneCall size={24} />
                  Ligar para Contato
                </a>
              )}
            </div>
          </>
        )}

        {/* LIGAÇÃO DIRETA SAMU */}
        <div className="mt-8">
          <a 
            href="tel:192"
            className="w-full bg-[#C53030] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-extrabold text-xl shadow-[0_4px_14px_0_rgba(229,62,62,0.39)] hover:bg-[#9B2C2C] hover:shadow-[0_6px_20px_rgba(229,62,62,0.23)] transition duration-200"
          >
            <PhoneCall size={26} />
            LIGAR SAMU (192)
          </a>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-10 text-center px-4">
          <p className="text-xs text-[#A0AEC0] font-medium leading-relaxed">
            As informações acima foram fornecidas pela própria paciente através do aplicativo Mamãe+. 
            Em caso de dúvida clínica, confirme os dados com a paciente, acompanhante ou realize exames complementares.
          </p>
        </div>

      </div>
    </div>
  );
}
