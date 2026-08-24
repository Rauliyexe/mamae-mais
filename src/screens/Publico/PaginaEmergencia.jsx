import React, { useEffect, useState } from "react";
import { MockAPI } from "../../data/mockApi";
import { 
  AlertCircle, PhoneCall, HeartPulse, Droplet, Pill, AlertTriangle, 
  Building2, User, UserSearch, Share2, Compass, Navigation, Watch, 
  CreditCard, Key, ShieldCheck
} from "lucide-react";

export default function PaginaEmergencia() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceType, setDeviceType] = useState("Acessório NFC Inteligente");

  useEffect(() => {
    // Extract cardId from URL: /emergencia/:cardId
    const pathParts = window.location.pathname.split("/");
    const cardId = pathParts[pathParts.length - 1];

    if (cardId.includes("PULSEIRA")) {
      setDeviceType("Pulseira Médica Inteligente");
    } else if (cardId.includes("CHAVEIRO")) {
      setDeviceType("Chaveiro de Resgate");
    } else {
      setDeviceType("Cartão NFC de Emergência");
    }

    const loadData = async () => {
      try {
        const publicData = await MockAPI.getPublicEmergencyData(cardId);
        setData(publicData || {
          fullName: "Carla Silva",
          bloodType: "A+",
          gestationalWeek: 17,
          allergies: "Nenhuma alergia relatada",
          medications: "Suplementação de Ácido Fólico e Ferro",
          riskConditions: "Pré-natal Habitual (Baixo Risco)",
          hospital: "Hospital e Maternidade Santa Joana",
          contactName: "Lucas Silva (Marido)",
          contactPhone: "(11) 98844-2211",
        });
      } catch (err) {
        // Fallback default clinical data
        setData({
          fullName: "Carla Silva",
          bloodType: "A+",
          gestationalWeek: 17,
          allergies: "Nenhuma alergia relatada",
          medications: "Suplementação de Ácido Fólico e Ferro",
          riskConditions: "Pré-natal Habitual (Baixo Risco)",
          hospital: "Hospital e Maternidade Santa Joana",
          contactName: "Lucas Silva (Marido)",
          contactPhone: "(11) 98844-2211",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-center p-6 text-center animate-fadeIn font-albert">
        <div className="w-16 h-16 border-4 border-[#E53E3E] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-[#C53030] font-bold text-xl font-poppins">Acessando Dados Vitais de Emergência...</h2>
      </div>
    );
  }

  const renderField = (label, value, IconComponent) => {
    if (!value) return null;
    return (
      <div className="bg-white p-4 rounded-2xl border-l-4 border-[#E53E3E] shadow-sm flex items-start gap-4 mb-3 border border-[#FEB2B2]/60">
        <div className="bg-[#FFF5F5] p-2 rounded-xl text-[#E53E3E] shrink-0 mt-0.5">
          <IconComponent size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-[#9B2C2C] text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-[#2D3748] text-[15px] font-bold leading-snug break-words">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF2F2] font-albert text-[#2D3748] pb-12 select-none">
      {/* HEADER CRÍTICO */}
      <div className="bg-gradient-to-r from-[#C53030] to-[#E53E3E] text-white p-6 pt-10 shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <AlertCircle size={32} className="text-white" />
            <div>
              <h1 className="text-xl font-black font-poppins uppercase tracking-wide">
                Ficha Médica de Emergência
              </h1>
              <p className="text-[#FED7D7] font-medium text-xs">
                Lido via {deviceType} · Mamãe+
              </p>
            </div>
          </div>
          <span className="bg-white text-[#C53030] text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm animate-pulse">
            SOS Ativo
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 max-w-lg mx-auto space-y-4">
        
        {/* IDENTIFICAÇÃO PRINCIPAL */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#FEB2B2]">
          <span className="text-[#C53030] text-[10.5px] font-bold uppercase tracking-wider block mb-1">
            Identificação da Gestante
          </span>
          <h2 className="text-2xl font-black font-poppins text-[#2D3748] leading-tight mb-4">
            {data.fullName || "Carla Silva"}
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FFF5F5] p-3 rounded-2xl border border-[#FEB2B2] text-center">
              <p className="text-[#C53030] text-[10px] font-bold uppercase mb-0.5">Tipo Sanguíneo</p>
              <div className="flex items-center justify-center gap-1.5">
                <Droplet size={18} className="text-[#E53E3E] fill-[#E53E3E]" />
                <span className="text-2xl font-black text-[#C53030] font-poppins">{data.bloodType || "A+"}</span>
              </div>
            </div>
            <div className="bg-[#EBF8FF] p-3 rounded-2xl border border-[#90CDF4] text-center">
              <p className="text-[#2B6CB0] text-[10px] font-bold uppercase mb-0.5">Idade Gestacional</p>
              <span className="text-2xl font-black text-[#2B6CB0] font-poppins">{data.gestationalWeek || 17} Sem</span>
            </div>
          </div>
        </div>

        {/* ROTAS PARA MATERNIDADE DE REFERÊNCIA */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#FEB2B2] space-y-2.5">
          <div className="flex items-center gap-2 text-[#C53030]">
            <Building2 size={18} />
            <h3 className="text-sm font-bold font-poppins uppercase tracking-wider">
              Maternidade de Referência
            </h3>
          </div>
          <p className="text-[15px] font-extrabold text-[#2D3748]">
            {data.hospital || "Hospital e Maternidade Santa Joana"}
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(data.hospital || "Hospital e Maternidade Santa Joana")}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white py-2.5 rounded-xl text-center font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Compass size={14} />
              Rota no Maps
            </a>
            <a
              href={`https://waze.com/ul?q=${encodeURIComponent(data.hospital || "Hospital e Maternidade Santa Joana")}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#33CCFF] hover:bg-[#29b6e6] text-white py-2.5 rounded-xl text-center font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Navigation size={14} />
              Rota no Waze
            </a>
          </div>
        </div>

        {/* DADOS MÉDICOS CLÍNICOS */}
        <div>
          <h3 className="text-[#C53030] text-sm font-bold font-poppins mb-2 px-1 flex items-center gap-2">
            <HeartPulse size={17} /> Informações Clínicas Vitais
          </h3>
          
          {renderField("Condições de Risco", data.riskConditions || "Pré-natal Habitual", AlertTriangle)}
          {renderField("Alergias a Medicamentos", data.allergies || "Nenhuma alergia conhecida", AlertCircle)}
          {renderField("Medicações em Uso", data.medications || "Polivitamínico Gestacional", Pill)}
        </div>

        {/* CONTATO DE APOIO FAMILIAR */}
        {(data.contactName || data.contactPhone) && (
          <div className="bg-white p-4.5 rounded-3xl border-2 border-[#E53E3E] shadow-sm space-y-3">
            <div>
              <p className="text-[#C53030] text-[10.5px] font-bold uppercase tracking-wider">
                Contato de Apoio / Rede Familiar
              </p>
              <h4 className="text-lg font-bold text-[#2D3748] mt-0.5">
                {data.contactName || "Lucas Silva (Marido)"}
              </h4>
              <p className="text-xs text-[#718096] font-semibold">{data.contactPhone || "(11) 98844-2211"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a 
                href={`tel:${(data.contactPhone || "11988442211").replace(/\D/g, '')}`}
                className="bg-[#E53E3E] hover:bg-[#C53030] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <PhoneCall size={16} />
                Ligar Agora
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=55${(data.contactPhone || "11988442211").replace(/\D/g, '')}&text=${encodeURIComponent(`🚨 ALERTA: Encontrei a gestante ${data.fullName || "Carla Silva"} e acessei a ficha de emergência NFC dela. Por favor entre em contato.`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5B] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <Share2 size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* LIGAÇÃO DIRETA SAMU 192 */}
        <div className="pt-2">
          <a 
            href="tel:192"
            className="w-full bg-gradient-to-r from-[#9B2C2C] to-[#C53030] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg hover:from-[#7B1C1C] hover:to-[#9B2C2C] transition duration-200 active:scale-95"
          >
            <PhoneCall size={22} />
            LIGAR SAMU (192)
          </a>
        </div>

        {/* DISCLAIMER */}
        <div className="pt-4 text-center px-4">
          <p className="text-[11px] text-[#A0AEC0] font-medium leading-relaxed">
            Dados sincronizados com o aplicativo <b>Mamãe+</b> via acessório {deviceType}. 
            Em caso de parada ou choque, inicie manobras com a gestante posicionada em decúbito lateral esquerdo.
          </p>
        </div>

      </div>
    </div>
  );
}
