import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Calendar, Stethoscope, FileText, CheckCircle2, Clock, 
  Plus, AlertCircle, Sparkles, ChevronRight 
} from "lucide-react";

export default function ClinicalBoard() {
  const { calendarEvents, addCalendarEvent, trimester, currentWeek } = useApp();
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDay, setNewEventDay] = useState(15);
  const [newEventTime, setNewEventTime] = useState("14:30");
  const [showAddForm, setShowAddForm] = useState(false);

  // Recommended clinical milestones based on trimester
  const trimesterChecklist = {
    1: [
      { id: "c1", title: "Tipagem Sanguínea & Fator Rh", done: true },
      { id: "c2", title: "Ultrassom Transvaginal Inicial", done: true },
      { id: "c3", title: "Sorologias (Toxoplasmose, Rubéola)", done: true },
      { id: "c4", title: "Ultrassom Morfológico 1º Tri (TN)", done: true },
    ],
    2: [
      { id: "c5", title: "Ultrassom Morfológico 2º Tri (20-24 sem)", done: false, badge: "Próximo" },
      { id: "c6", title: "Curva Glicêmica (TOTG 75g)", done: false },
      { id: "c7", title: "Ecocardiograma Fetal (se indicado)", done: false },
      { id: "c8", title: "Vacina dTpa & Gripe", done: false },
    ],
    3: [
      { id: "c9", title: "Pesquisa Estreptococo B (35-37 sem)", done: false },
      { id: "c10", title: "Cardiotocografia de Rotina", done: false },
      { id: "c11", title: "Ultrassom com Doppler Obstétrico", done: false },
      { id: "c12", title: "Consulta Pré-Natal Semanal", done: false },
    ]
  };

  const currentChecklist = trimesterChecklist[trimester] || trimesterChecklist[2];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEventTitle) return;
    addCalendarEvent(newEventDay, {
      title: newEventTitle,
      time: newEventTime,
      type: "consulta"
    });
    setNewEventTitle("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#F0DDE4] shadow-sm flex flex-col justify-between font-albert">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FBE8EF] text-[#D4638F] flex items-center justify-center font-bold">
            <Stethoscope size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#6B2D4E] font-poppins">
              Agenda Clínica & Protocolos Obstétricos
            </h3>
            <p className="text-[11px] text-[#8C6B7A]">Exames obrigatórios e consultas do {trimester}º Trimestre</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#FBE8EF] hover:bg-[#F2D0DE] text-[#6B2D4E] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-[#F0DDE4]"
        >
          <Plus size={13} className="text-[#D4638F]" />
          Agendar Consulta
        </button>
      </div>

      {/* Quick Add Form Modal/Inline */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-[#FDF5F8] p-3.5 rounded-2xl border border-[#F0DDE4] mb-3 animate-fadeIn">
          <h5 className="text-xs font-bold text-[#6B2D4E] font-poppins mb-2">Novo Compromisso Médico</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Ex: Consulta Obstetra Dra. Camila"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl border border-[#F0DDE4] text-xs font-medium focus:outline-none focus:border-[#D4638F]"
              required
            />
            <input
              type="number"
              min="1"
              max="31"
              placeholder="Dia do mês (Ex: 24)"
              value={newEventDay}
              onChange={(e) => setNewEventDay(parseInt(e.target.value) || 1)}
              className="bg-white px-3 py-1.5 rounded-xl border border-[#F0DDE4] text-xs font-medium focus:outline-none focus:border-[#D4638F]"
              required
            />
            <input
              type="text"
              placeholder="Horário (Ex: 15:00)"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl border border-[#F0DDE4] text-xs font-medium focus:outline-none focus:border-[#D4638F]"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-[#8C6B7A] hover:text-[#3D2B33]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#D4638F] hover:bg-[#B84E77] text-white px-3.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Salvar na Agenda
            </button>
          </div>
        </form>
      )}

      {/* Two Column Layout: Upcoming Appointments vs Protocol Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Scheduled Appointments */}
        <div className="bg-[#FDF5F8] p-3.5 rounded-2xl border border-[#F0DDE4]">
          <h4 className="text-xs font-bold text-[#6B2D4E] font-poppins mb-2.5 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#D4638F]" />
            Próximos Compromissos Agendados
          </h4>

          <div className="space-y-2 max-h-[145px] overflow-y-auto scrollbar-thin pr-1">
            {Object.entries(calendarEvents || {}).slice(0, 3).map(([key, ev]) => {
              const displayDay = ev?.day || (ev?.date ? parseInt(ev.date.split("-")[2], 10) : key);
              return (
                <div key={ev?.id || key} className="bg-white p-2.5 rounded-xl border border-[#F0DDE4] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FBE8EF] text-[#6B2D4E] font-bold text-xs flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] font-semibold text-[#8C6B7A] leading-none">DIA</span>
                      <span className="leading-tight">{displayDay}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3D2B33] truncate max-w-[170px]">{ev?.title || "Consulta Médica"}</p>
                      <p className="text-[10px] text-[#8C6B7A] flex items-center gap-1">
                        <Clock size={10} /> {ev?.time || "09:00"} · {ev?.location || "Maternidade Santa Clara"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    ev?.done 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-[#EBF8FF] text-[#2B6CB0] border-[#BEE3F8]"
                  }`}>
                    {ev?.done ? "Realizado" : "Confirmado"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trimester Protocol Checklist */}
        <div className="bg-[#FDF5F8] p-3.5 rounded-2xl border border-[#F0DDE4]">
          <h4 className="text-xs font-bold text-[#6B2D4E] font-poppins mb-2.5 flex items-center gap-1.5">
            <FileText size={13} className="text-[#D4638F]" />
            Checklist Obstétrico ({trimester}º Trimestre)
          </h4>

          <div className="space-y-1.5 max-h-[145px] overflow-y-auto scrollbar-thin pr-1">
            {currentChecklist.map((item) => (
              <div key={item.id} className="bg-white p-2 rounded-xl border border-[#F0DDE4] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? "bg-[#38A169] text-white" : "bg-[#FBE8EF] text-[#D4638F]"}`}>
                    <CheckCircle2 size={11} />
                  </div>
                  <span className={`text-[11.5px] font-semibold ${item.done ? "text-[#8C6B7A] line-through" : "text-[#3D2B33]"}`}>
                    {item.title}
                  </span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-extrabold bg-[#FEFCBF] text-[#744210] px-1.5 py-0.5 rounded-md border border-[#F6E05E]">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
