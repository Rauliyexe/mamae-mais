import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  CreditCard, ShieldAlert, PhoneCall, Droplet, ExternalLink, 
  Printer, CheckCircle2, QrCode, Sparkles, UserCheck 
} from "lucide-react";

export default function NFCHubWidget() {
  const { user, currentWeek, navigate } = useApp();
  const [copied, setCopied] = useState(false);

  const emergencyData = {
    bloodType: "O+",
    allergies: "Dipirona",
    riskConditions: "Nenhuma pré-existente",
    hospital: "Maternidade Santa Clara",
    contactName: "Lucas Silva (Parceiro)",
    contactPhone: "(11) 98765-4321",
    cardId: "MM-2026-9874",
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/emergencia/${emergencyData.cardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#F0DDE4] shadow-sm flex flex-col justify-between font-albert">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center font-bold">
            <ShieldAlert size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#6B2D4E] font-poppins flex items-center gap-2">
              Hub NFCare & Ficha SOS Hospitalar
            </h3>
            <p className="text-[11px] text-[#8C6B7A]">Dados vitais para equipes de socorro em tempo real</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="bg-[#FDF5F8] hover:bg-[#FBE8EF] text-[#6B2D4E] p-2 rounded-xl text-xs font-bold transition-all border border-[#F0DDE4] flex items-center gap-1 cursor-pointer"
            title="Imprimir Prontuário"
          >
            <Printer size={13} />
          </button>
          <button
            onClick={() => navigate("cartaonfc")}
            className="bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#C53030] text-xs font-bold px-3 py-1.5 rounded-xl transition-all border border-[#FEB2B2] flex items-center gap-1 cursor-pointer"
          >
            <CreditCard size={13} />
            Gerenciar Cartão
          </button>
        </div>
      </div>

      {/* Grid: Interactive Physical NFC Card Graphic vs Emergency Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Physical NFC Card Representation */}
        <div className="md:col-span-6 bg-gradient-to-tr from-[#6B2D4E] via-[#A8386B] to-[#D4638F] text-white p-4.5 rounded-2xl shadow-lg border border-white/20 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          {/* Subtle Card Background Pattern */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-4 top-4 flex items-center gap-1 text-[9px] uppercase tracking-widest font-extrabold bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] mr-1" />
            NFC ATIVO
          </div>

          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] tracking-widest text-white/80 font-bold uppercase">MAMÃE+ NFCARE</p>
              <h4 className="text-base font-extrabold font-poppins mt-0.5">{user.name}</h4>
            </div>
            {/* Golden Chip */}
            <div className="w-7 h-5 rounded-md bg-gradient-to-br from-[#ECC94B] to-[#D69E2E] border border-[#B7791F] shadow-xs" />
          </div>

          <div className="flex justify-between items-end mt-4 pt-2 border-t border-white/15">
            <div>
              <p className="text-[8.5px] uppercase tracking-wider text-white/70">Tipo Sanguíneo</p>
              <p className="text-sm font-extrabold flex items-center gap-1">
                <Droplet size={13} className="text-[#FFD1E3] fill-[#FFD1E3]" /> {emergencyData.bloodType}
              </p>
            </div>
            <div>
              <p className="text-[8.5px] uppercase tracking-wider text-white/70">Semana Atual</p>
              <p className="text-sm font-extrabold">{currentWeek}ª Semana</p>
            </div>
            <div>
              <p className="text-[8.5px] uppercase tracking-wider text-white/70">ID Cartão</p>
              <p className="text-xs font-mono font-bold text-white/90">{emergencyData.cardId}</p>
            </div>
          </div>
        </div>

        {/* Emergency Summary & Link */}
        <div className="md:col-span-6 space-y-2">
          <div className="bg-[#FDF5F8] p-2.5 rounded-xl border border-[#F0DDE4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-[#C53030] flex items-center justify-center font-bold">
                <PhoneCall size={13} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8C6B7A] uppercase">Contato de Emergência</p>
                <p className="text-xs font-extrabold text-[#3D2B33]">{emergencyData.contactName}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#2B6CB0]">{emergencyData.contactPhone}</span>
          </div>

          <div className="bg-[#FDF5F8] p-2.5 rounded-xl border border-[#F0DDE4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-[#E53E3E] flex items-center justify-center font-bold">
                <ShieldAlert size={13} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8C6B7A] uppercase">Alergias / Restrições</p>
                <p className="text-xs font-extrabold text-[#C53030]">{emergencyData.allergies}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#8C6B7A]">{emergencyData.hospital}</span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-white hover:bg-[#FBE8EF] text-[#6B2D4E] border border-[#F0DDE4] py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={13} className="text-[#38A169]" /> Link Copiado!
                </>
              ) : (
                <>
                  <ExternalLink size={13} /> Copiar Link SOS
                </>
              )}
            </button>
            <a
              href={`/emergencia/${emergencyData.cardId}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#C53030] hover:bg-[#9B2C2C] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
            >
              Abrir Ficha Pública
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
