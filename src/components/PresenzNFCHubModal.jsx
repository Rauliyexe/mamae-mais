import React, { useState } from "react";
import PresenzLogo, { PresenzIcon } from "./PresenzLogo";
import { 
  Radio, Wifi, ShieldCheck, Check, AlertTriangle, X, RefreshCw, 
  Smartphone, Watch, CreditCard, Sparkles, HeartPulse, Lock
} from "lucide-react";

export default function PresenzNFCHubModal({ isOpen, onClose, patient, onSaveNfcData }) {
  if (!isOpen || !patient) return null;

  const [activeTab, setActiveTab] = useState("read"); // 'read' | 'write' | 'wearables'
  const [isScanning, setIsScanning] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [writeSuccess, setWriteSuccess] = useState(false);

  // Editable NFC payload
  const [emergencyPhone, setEmergencyPhone] = useState("(11) 98765-4321");
  const [bloodType, setBloodType] = useState(patient.bloodType || "A+");
  const [allergies, setAllergies] = useState(patient.allergies || "Nenhuma relatada");
  const [continuousMeds, setContinuousMeds] = useState(
    patient.specialty === "obstetricia" ? "Polivitamínico Pré-natal, Sulfato Ferroso" : patient.specialty === "cardiologia" ? "Losartana 50mg, AAS 100mg" : "Insulina Glargina, Metformina"
  );
  const [notes, setNotes] = useState(patient.riskConditions || "Paciente em acompanhamento regular");

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const handleWriteTag = () => {
    setIsWriting(true);
    setTimeout(() => {
      setIsWriting(false);
      setWriteSuccess(true);
      if (onSaveNfcData) {
        onSaveNfcData(patient.id, {
          emergencyPhone,
          bloodType,
          allergies,
          continuousMeds,
          notes
        });
      }
      setTimeout(() => setWriteSuccess(false), 3000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050C0E]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-albert">
      <div className="bg-[#0F1E22] border border-[#7EC8C0]/30 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-[#14262C] border-b border-[#7EC8C0]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PresenzIcon size={34} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#7EC8C0] font-poppins">
                  NFC HEALTH HUB PRO
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] font-extrabold">
                  ISO/IEC 14443 TIPO A
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-poppins mt-0.5">
                Gravador & Leitor de Cartões NFC de Emergência
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0A1619] hover:bg-[#7EC8C0]/20 text-[#A6C5CB] hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Action Tabs */}
          <div className="grid grid-cols-3 p-1 bg-[#091518] rounded-2xl border border-[#7EC8C0]/20">
            <button
              onClick={() => setActiveTab("read")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "read"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <Radio size={13} />
              Leitura de Tag
            </button>

            <button
              onClick={() => setActiveTab("write")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "write"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <CreditCard size={13} />
              Gravar Dados na Tag
            </button>

            <button
              onClick={() => setActiveTab("wearables")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "wearables"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <Watch size={13} />
              Dispositivos & Sensores
            </button>
          </div>

          {/* 1. READ TAB */}
          {activeTab === "read" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-gradient-to-b from-[#14262C] to-[#0A1619] p-6 rounded-3xl border border-[#7EC8C0]/30 text-center space-y-3 relative overflow-hidden">
                <div className={`w-20 h-20 mx-auto rounded-full bg-[#183339] border-2 border-[#7EC8C0] flex items-center justify-center text-[#7EC8C0] shadow-md transition-all duration-300 ${
                  isScanning ? "scale-110 shadow-[0_0_30px_#7EC8C0]" : ""
                }`}>
                  <Radio size={36} className={isScanning ? "animate-spin" : "animate-pulse"} />
                </div>

                <div className="space-y-1">
                  <h4 className="font-poppins font-bold text-white text-sm">
                    {isScanning ? "Aproxime o cartão ou pulseira do leitor..." : `Tag Pareada: ${patient.nfcTag}`}
                  </h4>
                  <p className="text-xs text-[#8CA9B0]">
                    Paciente: <strong className="text-white">{patient.name}</strong> · Protocolo Criptografado Presenz
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="px-5 py-2.5 bg-[#7EC8C0] hover:bg-[#6EB8B0] text-[#0C1618] font-black rounded-xl text-xs transition cursor-pointer shadow-md active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <RefreshCw size={13} className={isScanning ? "animate-spin" : ""} />
                  <span>{isScanning ? "Lendo Chip NFC..." : "Realizar Nova Leitura"}</span>
                </button>
              </div>

              {/* Readout Summary */}
              <div className="bg-[#091518] p-4 rounded-2xl border border-[#7EC8C0]/20 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-[#7EC8C0] uppercase">Ficha Instantânea de Emergência:</span>
                <div className="grid grid-cols-2 gap-2 text-[#A6C5CB]">
                  <div>Tipo Sanguíneo: <strong className="text-white">{patient.bloodType}</strong></div>
                  <div>Alergias: <strong className="text-white">{patient.allergies}</strong></div>
                  <div className="col-span-2">Condição: <strong className="text-white">{patient.riskConditions}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* 2. WRITE TAB */}
          {activeTab === "write" && (
            <div className="space-y-3 animate-fadeIn">
              {writeSuccess && (
                <div className="bg-[#162E2A] border border-[#7EC8C0] text-[#98D8D0] p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check size={16} className="text-[#7EC8C0]" />
                  <span>Dados gravados com sucesso na Tag {patient.nfcTag}!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#C2E0DC] font-bold block mb-1">Telefone SOS de Emergência:</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#C2E0DC] font-bold block mb-1">Tipo Sanguíneo & Fator RH:</label>
                  <input
                    type="text"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full p-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-white outline-none font-bold"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-[#C2E0DC] font-bold block mb-1">Alergias Medicamentosas Críticas:</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full p-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-white outline-none font-medium"
                />
              </div>

              <div className="text-xs">
                <label className="text-[#C2E0DC] font-bold block mb-1">Medicamentos de Uso Contínuo:</label>
                <input
                  type="text"
                  value={continuousMeds}
                  onChange={(e) => setContinuousMeds(e.target.value)}
                  className="w-full p-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-white outline-none font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleWriteTag}
                disabled={isWriting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-black rounded-2xl text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard size={15} />
                <span>{isWriting ? "Gravando Chip NFC..." : "Gravar Dados Atualizados no Cartão do Paciente"}</span>
              </button>
            </div>
          )}

          {/* 3. WEARABLES TAB */}
          {activeTab === "wearables" && (
            <div className="space-y-3 animate-fadeIn text-xs">
              <div className="bg-[#091518] p-3.5 rounded-2xl border border-[#7EC8C0]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Watch size={22} className="text-[#7EC8C0]" />
                  <div>
                    <h5 className="font-bold text-white">Smartwatch Biométrico (ECG + SpO2)</h5>
                    <p className="text-[11px] text-[#8CA9B0]">Sincronização a cada 5 min · Bateria 86%</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#7EC8C0]/20 text-[#98D8D0] font-bold text-[10px]">
                  Conectado
                </span>
              </div>

              <div className="bg-[#091518] p-3.5 rounded-2xl border border-[#7EC8C0]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={22} className="text-[#7EC8C0]" />
                  <div>
                    <h5 className="font-bold text-white">Aplicativo Mamãe+ / Presenz Mobile</h5>
                    <p className="text-[11px] text-[#8CA9B0]">Notificações push e diário de bordo ativos</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#7EC8C0]/20 text-[#98D8D0] font-bold text-[10px]">
                  Online
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
