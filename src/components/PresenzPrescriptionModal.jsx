import React, { useState } from "react";
import PresenzLogo, { PresenzIcon } from "./PresenzLogo";
import { 
  FileText, QrCode, ShieldCheck, Download, Printer, Copy, Check,
  X, AlertTriangle, Sparkles, Plus, Trash2, Stethoscope, Pill
} from "lucide-react";

const COMMON_MEDS = [
  { name: "Ácido Fólico", defaultDose: "5mg", freq: "1x ao dia pela manhã", category: "Obstetrícia / Suplementação" },
  { name: "Sulfato Ferroso", defaultDose: "40mg Fe elementar", freq: "1x ao dia 30 min antes do almoço", category: "Obstetrícia / Hematologia" },
  { name: "Losartana Potássica", defaultDose: "50mg", freq: "1x ao dia às 08h", category: "Cardiologia / Anti-hipertensivo" },
  { name: "Anlodipino", defaultDose: "5mg", freq: "1x ao dia à noite", category: "Cardiologia" },
  { name: "Insulina Glargina (Lantus)", defaultDose: "18 UI", freq: "1x ao dia às 22h", category: "Endocrinologia / Diabetes" },
  { name: "Insulina Lispro (Humalog)", defaultDose: "Conforme contagem de carbo", freq: "Antes das refeições principais", category: "Endocrinologia" },
  { name: "Dipirona Monoidratada", defaultDose: "500mg/mL", freq: "30 gotas a cada 6h se dor ou febre", category: "Geral / Analgésico" },
  { name: "Paracetamol Gotas", defaultDose: "200mg/mL", freq: "1 gota/kg a cada 6h em caso de febre > 37.8°C", category: "Pediatria" },
  { name: "Amoxicilina + Clavulanato", defaultDose: "875mg + 125mg", freq: "1 comprimido de 12/12h por 7 dias", category: "Antibioticoterapia" },
];

export default function PresenzPrescriptionModal({ isOpen, onClose, patient, doctorUser, onPrescriptionIssued }) {
  if (!isOpen || !patient) return null;

  const [docType, setDocType] = useState("receita"); // 'receita' | 'atestado' | 'laudo'
  const [medSearch, setMedSearch] = useState("");
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: patient.specialty === "obstetricia" ? "Polivitamínico Pré-natal c/ Metilfolato" : patient.specialty === "cardiologia" ? "Losartana Potássica 50mg" : "Dipirona 500mg",
      dosage: patient.specialty === "obstetricia" ? "1 comprimido" : "1 comprimido",
      frequency: patient.specialty === "obstetricia" ? "1x ao dia junto ao café da manhã" : "1x ao dia pela manhã",
      duration: "Uso contínuo por 60 dias"
    }
  ]);
  const [specialInstructions, setSpecialInstructions] = useState("Manter hidratação adequada e registrar sintomas no app Presenz.");
  const [certificateDays, setCertificateDays] = useState(2);
  const [cidCode, setCidCode] = useState(patient.specialty === "obstetricia" ? "Z34.0 (Supervisão de gravidez normal)" : "I10 (Hipertensão essencial)");
  const [isCopied, setIsCopied] = useState(false);
  const [isIssued, setIsIssued] = useState(false);

  const handleAddMed = (med) => {
    setMedications(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `${med.name} ${med.defaultDose}`,
        dosage: "1 dose",
        frequency: med.freq,
        duration: "Conforme prescrito"
      }
    ]);
    setMedSearch("");
  };

  const handleRemoveMed = (id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const handleIssueDoc = () => {
    setIsIssued(true);
    if (onPrescriptionIssued) {
      onPrescriptionIssued({
        type: docType,
        patientName: patient.name,
        date: new Date().toLocaleDateString("pt-BR"),
        code: `PRZ-${Math.floor(100000 + Math.random() * 900000)}`,
        medications
      });
    }
    setTimeout(() => {
      setIsIssued(false);
      onClose();
    }, 2000);
  };

  const handleCopyLink = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060D0F]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn font-albert">
      <div className="bg-[#0F1E22] border border-[#7EC8C0]/30 rounded-[32px] w-full max-w-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#14262C] border-b border-[#7EC8C0]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PresenzIcon size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-[#7EC8C0] font-poppins">
                  PRESENZ ICP-DIGITAL
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7EC8C0]/15 text-[#98D8D0] font-extrabold">
                  VALIDAÇÃO CFM QR-CODE
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-poppins mt-0.5">
                Emissor de Documentos Médicos Oficiais
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Document Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-[#091518] rounded-2xl border border-[#7EC8C0]/20">
            <button
              onClick={() => setDocType("receita")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                docType === "receita"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <Pill size={13} />
              Receita Médica
            </button>

            <button
              onClick={() => setDocType("atestado")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                docType === "atestado"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <FileText size={13} />
              Atestado Médico
            </button>

            <button
              onClick={() => setDocType("laudo")}
              className={`py-2 rounded-xl text-xs font-bold font-poppins transition cursor-pointer flex items-center justify-center gap-1.5 ${
                docType === "laudo"
                  ? "bg-[#7EC8C0] text-[#0C1618] shadow-sm font-black"
                  : "text-[#A6C5CB] hover:text-white"
              }`}
            >
              <Stethoscope size={13} />
              Relatório / Encaminhamento
            </button>
          </div>

          {/* Patient Info Card with Allergy Alert */}
          <div className="bg-[#14262C] p-3.5 rounded-2xl border border-[#7EC8C0]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-[#8CA9B0]">Paciente: </span>
              <strong className="text-white font-bold">{patient.name}</strong>
              <span className="text-[#8CA9B0] ml-2">({patient.specialtyLabel})</span>
            </div>
            {patient.allergies && patient.allergies !== "Nenhuma relatada" && (
              <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/30">
                <AlertTriangle size={13} />
                <span>Alergias: <strong>{patient.allergies}</strong></span>
              </div>
            )}
          </div>

          {/* 1. RECEITA MÉDICA */}
          {docType === "receita" && (
            <div className="space-y-4">
              {/* Quick Drug Search */}
              <div>
                <label className="text-xs font-bold text-[#C2E0DC] block mb-1">
                  Adicionar Fármaco / Medicamento:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={medSearch}
                    onChange={(e) => setMedSearch(e.target.value)}
                    placeholder="Digite o nome do medicamento (ex: Ácido Fólico, Losartana, Insulina)..."
                    className="w-full px-3.5 py-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-xs text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0]"
                  />
                  {medSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0E1F24] border border-[#7EC8C0]/30 rounded-xl p-2 shadow-xl z-20 max-h-48 overflow-y-auto space-y-1">
                      {COMMON_MEDS.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase())).map((med, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddMed(med)}
                          className="w-full p-2 rounded-lg text-left hover:bg-[#7EC8C0]/15 text-xs text-white flex justify-between items-center transition cursor-pointer"
                        >
                          <div>
                            <span className="font-bold">{med.name}</span>
                            <span className="text-[10.5px] text-[#7EC8C0] ml-2 font-mono">({med.defaultDose})</span>
                          </div>
                          <span className="text-[10px] text-[#8CA9B0]">{med.category}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Medication List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#C2E0DC] uppercase tracking-wider text-[10px]">
                  Itens da Prescrição:
                </span>
                {medications.map((item, idx) => (
                  <div key={item.id} className="bg-[#091518] p-3 rounded-2xl border border-[#7EC8C0]/20 flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <span className="font-bold text-white text-xs">{idx + 1}. {item.name}</span>
                      <p className="text-[11.5px] text-[#A6C5CB]">Posologia: {item.frequency} · {item.duration}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMed(item.id)}
                      className="p-1 text-[#8CA9B0] hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-bold text-[#C2E0DC] block mb-1">
                  Instruções e Recomendações Adicionais:
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full h-16 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl p-2.5 text-xs text-white placeholder-[#688A92] outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* 2. ATESTADO MÉDICO */}
          {docType === "atestado" && (
            <div className="space-y-3 bg-[#091518] p-4 rounded-2xl border border-[#7EC8C0]/20">
              <h4 className="text-xs font-bold text-white font-poppins uppercase tracking-wider">
                Emissão de Atestado de Afastamento
              </h4>
              <p className="text-xs text-[#A6C5CB] leading-relaxed">
                Atesto para os devidos fins que o(a) paciente <strong>{patient.name}</strong> esteve sob cuidados médicos nesta data, necessitando de afastamento de suas atividades por motivo de saúde.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-[#C2E0DC] block mb-1">Dias de Repouso:</label>
                  <input
                    type="number"
                    value={certificateDays}
                    onChange={(e) => setCertificateDays(e.target.value)}
                    className="w-full p-2 bg-[#0E1F24] border border-[#7EC8C0]/30 rounded-xl text-xs text-white outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#C2E0DC] block mb-1">Código CID-10:</label>
                  <input
                    type="text"
                    value={cidCode}
                    onChange={(e) => setCidCode(e.target.value)}
                    className="w-full p-2 bg-[#0E1F24] border border-[#7EC8C0]/30 rounded-xl text-xs text-white outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timbre & Digital Signature Preview */}
          <div className="bg-[#14262C] p-4 rounded-2xl border border-[#7EC8C0]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shrink-0">
                <QrCode size={48} className="text-[#0C1618]" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-[#7EC8C0] uppercase">Assinatura ICP-Brasil Digital</span>
                <p className="text-white font-bold">{doctorUser?.name || "Dr. Leonardo Pinto"}</p>
                <p className="text-[#8CA9B0]">CRM/{doctorUser?.uf || "SP"} {doctorUser?.crm || "184920"} · {doctorUser?.specialty || "Clínica"}</p>
                <span className="text-[9px] text-[#7EC8C0] font-mono">HASH: PRZ-77A9-CFM-2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[#091518] hover:bg-[#7EC8C0]/15 text-[#98D8D0] border border-[#7EC8C0]/20 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {isCopied ? <Check size={13} className="text-[#7EC8C0]" /> : <Copy size={13} />}
                <span>{isCopied ? "Link Copiado!" : "Copiar Link"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-[#14262C] border-t border-[#7EC8C0]/20 px-6 py-4 flex items-center justify-between">
          <div className="text-[11px] text-[#8CA9B0] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#7EC8C0]" />
            <span>Validade jurídica em todo território nacional.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#091518] hover:bg-white/10 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={handleIssueDoc}
              disabled={isIssued}
              className="px-5 py-2 bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] hover:from-[#6EB8B0] text-[#0C1618] font-black rounded-xl text-xs transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
            >
              {isIssued ? <Check size={14} /> : <ShieldCheck size={14} />}
              <span>{isIssued ? "Documento Emitido!" : "Emitir & Assinar Digitalmente"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
