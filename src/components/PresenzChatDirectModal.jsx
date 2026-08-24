import React, { useState } from "react";
import PresenzLogo, { PresenzIcon } from "./PresenzLogo";
import { 
  Send, AlertTriangle, ShieldCheck, X, Phone, MessageSquare, 
  Sparkles, Check, Paperclip, AlertCircle, Radio
} from "lucide-react";

export default function PresenzChatDirectModal({ isOpen, onClose, patient, doctorUser, onSendAlert }) {
  if (!isOpen || !patient) return null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "patient", text: `Olá Dr. ${doctorUser?.name?.split(" ")[1] || "Leonardo"}, fiz o upload do meu exame hoje cedo. Está tudo bem?`, time: "08:24" },
    { id: 2, sender: "doctor", text: "Olá! Analisei seu laudo agora há pouco e os parâmetros estão ótimos. Deixei o parecer gravado no seu aplicativo.", time: "08:35" }
  ]);
  const [isSosActive, setIsSosActive] = useState(false);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "doctor",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessage("");
  };

  const handleSimulateSosAlert = () => {
    setIsSosActive(true);
    if (onSendAlert) {
      onSendAlert(`Alerta SOS acionado por ${patient.name}! Frequência Cardíaca ou PA fora da faixa.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050C0E]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-fadeIn font-albert">
      <div className="bg-[#0F1E22] border border-[#7EC8C0]/30 rounded-[32px] w-full max-w-2xl h-[85vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-[#14262C] border-b border-[#7EC8C0]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PresenzIcon size={34} />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7EC8C0] font-poppins">
                  PRESENZ DIRECT · CRIPTOGRAFADO
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-poppins">
                Canal com {patient.name} ({patient.specialtyLabel})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateSosAlert}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle size={13} />
              <span>Simular SOS</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#0A1619] hover:bg-[#7EC8C0]/20 text-[#A6C5CB] hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* SOS Emergency Banner if Active */}
        {isSosActive && (
          <div className="bg-red-600/90 text-white px-5 py-2.5 flex items-center justify-between text-xs font-bold animate-pulse shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>ALERTA DE EMERGÊNCIA: Paciente acionou o botão SOS no app móvel.</span>
            </div>
            <button
              onClick={() => setIsSosActive(false)}
              className="underline text-[11px] font-mono hover:text-white/80 cursor-pointer"
            >
              Desativar Alerta
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#0A1518]">
          <div className="text-center my-2">
            <span className="text-[10px] text-[#7EC8C0] bg-[#14262C] px-3 py-1 rounded-full border border-[#7EC8C0]/20 font-bold">
              Canal Oficial Auditável Presenz
            </span>
          </div>

          {messages.map((m) => {
            const isDoctor = m.sender === "doctor";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-medium ${
                    isDoctor
                      ? "bg-gradient-to-r from-[#7EC8C0] to-[#5BB0A6] text-[#0C1618] font-semibold rounded-br-none shadow-sm"
                      : "bg-[#14262C] text-white rounded-bl-none border border-[#7EC8C0]/20 shadow-sm"
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9.5px] text-[#8CA9B0] mt-1 px-1">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="bg-[#14262C] border-t border-[#7EC8C0]/20 p-4 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem direta para o paciente..."
            className="flex-1 px-4 py-2.5 bg-[#091518] border border-[#7EC8C0]/30 rounded-xl text-xs text-white placeholder-[#688A92] outline-none focus:border-[#7EC8C0] font-medium"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2.5 bg-[#7EC8C0] hover:bg-[#6EB8B0] text-[#0C1618] font-bold rounded-xl transition shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
