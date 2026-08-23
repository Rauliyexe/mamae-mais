import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, 
  X, CheckCircle2, Circle, AlertCircle, Download, FileText, Stethoscope, 
  Sparkles, Syringe, Pill, TestTube, Check, Trash2, Edit3, MessageSquare, 
  Copy, Printer, HelpCircle, ArrowRight, CheckCheck, ListFilter
} from "lucide-react";
import { PRENATAL_GUIDELINES, EVENT_CATEGORIES } from "../data/prenatalProtocol";
import { downloadIcsFile } from "../utils/calendarExport";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendario() {
  const { 
    calendarEvents = {}, 
    addCalendarEvent, 
    updateCalendarEvent, 
    deleteCalendarEvent, 
    toggleCalendarEventDone, 
    addQuestionToEvent, 
    toggleQuestionDone,
    currentWeek = 17,
    trimester = 2,
    daysRemaining = 161,
    weightHistory = [],
    diaryEntries = [],
    moodHistory = []
  } = useApp();

  // Calendar navigation state (year and month)
  const [viewDate, setViewDate] = useState(() => {
    // Default to Oct 2026 or current real date
    const d = new Date();
    // Defaulting to 2026-10 to match mockup timeline, or current date if in 2026+
    return new Date(2026, 9, 1); // 9 is October (0-indexed)
  });

  const [selectedDateStr, setSelectedDateStr] = useState("2026-10-17");
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'timeline'
  const [filterCategory, setFilterCategory] = useState("Todos");

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [newQuestionInput, setNewQuestionInput] = useState({});

  // Event form state
  const [formDate, setFormDate] = useState("2026-10-17");
  const [formTitle, setFormTitle] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formType, setFormType] = useState("Consulta");
  const [formDoctor, setFormDoctor] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPrep, setFormPrep] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Normalize all calendar events into a clean list
  const allEventsList = useMemo(() => {
    const list = [];
    Object.entries(calendarEvents || {}).forEach(([key, val]) => {
      if (!val) return;
      // Handle legacy single-day format or object format
      let ev = { ...val };
      if (!ev.id) ev.id = key;
      if (!ev.date) {
        // If key is a day number like "5" or "17"
        if (!isNaN(Number(key))) {
          ev.date = `2026-10-${String(key).padStart(2, "0")}`;
        } else if (ev.day) {
          ev.date = `2026-10-${String(ev.day).padStart(2, "0")}`;
        } else {
          ev.date = "2026-10-17";
        }
      }
      if (!ev.questions) ev.questions = [];
      list.push(ev);
    });

    // Sort chronologically
    return list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [calendarEvents]);

  // Events indexed by date 'YYYY-MM-DD'
  const eventsByDate = useMemo(() => {
    const map = {};
    allEventsList.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [allEventsList]);

  // Selected day events
  const selectedDayEvents = useMemo(() => {
    const list = eventsByDate[selectedDateStr] || [];
    if (filterCategory === "Todos") return list;
    return list.filter((e) => e.type?.toLowerCase() === filterCategory.toLowerCase());
  }, [eventsByDate, selectedDateStr, filterCategory]);

  // Relevant guidelines for current week & trimester
  const recommendedGuidelines = useMemo(() => {
    return PRENATAL_GUIDELINES.filter((g) => {
      return (currentWeek >= g.minWeek && currentWeek <= g.maxWeek) || g.trimester === trimester;
    });
  }, [currentWeek, trimester]);

  // Month navigation functions
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date(2026, 9, 17); // App timeline anchor
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr("2026-10-17");
  };

  // Calendar Grid Calculation
  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: true });
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: false });
    }

    return cells;
  }, [viewDate]);

  // Open modal to add new event
  const handleOpenAddModal = (dateStr = selectedDateStr, initialData = null) => {
    setEditingEventId(null);
    setFormDate(dateStr || selectedDateStr);
    if (initialData) {
      setFormTitle(initialData.title || "");
      setFormTime(initialData.time || "09:00");
      setFormType(initialData.category || initialData.type || "Consulta");
      setFormDoctor(initialData.doctor || "");
      setFormLocation(initialData.location || "");
      setFormPrep(initialData.prep || initialData.prepInstructions || "");
      setFormNotes(initialData.description || initialData.notes || "");
    } else {
      setFormTitle("");
      setFormTime("");
      setFormType("Consulta");
      setFormDoctor("");
      setFormLocation("");
      setFormPrep("");
      setFormNotes("");
    }
    setShowEventModal(true);
  };

  // Open modal to edit existing event
  const handleOpenEditModal = (event) => {
    setEditingEventId(event.id);
    setFormDate(event.date || selectedDateStr);
    setFormTitle(event.title || "");
    setFormTime(event.time || "");
    setFormType(event.type || "Consulta");
    setFormDoctor(event.doctor || "");
    setFormLocation(event.location || "");
    setFormPrep(event.prepInstructions || "");
    setFormNotes(event.notes || "");
    setShowEventModal(true);
  };

  // Save event (add or edit)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingEventId) {
      updateCalendarEvent(editingEventId, {
        date: formDate,
        title: formTitle,
        time: formTime || "Dia todo",
        type: formType,
        doctor: formDoctor,
        location: formLocation,
        prepInstructions: formPrep,
        notes: formNotes,
      });
    } else {
      addCalendarEvent({
        date: formDate,
        title: formTitle,
        time: formTime || "Dia todo",
        type: formType,
        doctor: formDoctor,
        location: formLocation,
        prepInstructions: formPrep,
        notes: formNotes,
        questions: [],
        done: false,
      });
    }

    setSelectedDateStr(formDate);
    setShowEventModal(false);
  };

  // Handle adding a question to an event
  const handleAddQuestion = (eventId) => {
    const text = newQuestionInput[eventId];
    if (!text || !text.trim()) return;
    addQuestionToEvent(eventId, text.trim());
    setNewQuestionInput((prev) => ({ ...prev, [eventId]: "" }));
  };

  // 1-Click scheduling from guideline recommendation
  const handleScheduleGuideline = (guide) => {
    handleOpenAddModal(selectedDateStr, {
      title: guide.title,
      category: guide.category,
      prep: guide.prep,
      notes: guide.description,
      time: "09:00"
    });
  };

  // Export single event to .ics
  const handleExportEvent = (ev) => {
    downloadIcsFile(ev, `compromisso_${ev.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.ics`);
  };

  // Export all events to .ics
  const handleExportAll = () => {
    downloadIcsFile(allEventsList, "agenda_completa_prenatal.ics");
  };

  // Copy medical clinical summary
  const generateClinicalSummaryText = () => {
    const recentSymptoms = diaryEntries.slice(0, 5).map(e => `• ${e.date}: ${e.symptoms?.join(', ') || 'Nenhum sintoma grave'} (Humor: ${e.mood})`).join('\n');
    const questionsList = allEventsList
      .flatMap(e => (e.questions || []).filter(q => !q.done).map(q => `• [${e.title}] ${q.text}`))
      .join('\n');

    return `📋 *RESUMO DE PRÉ-NATAL - MAMÃE+*
────────────────────────
🤰 *Gestante:* Paciente Cadastrada
📅 *Idade Gestacional:* ${currentWeek} semanas (${trimester}º Trimestre)
⏳ *Previsão do Parto:* Faltam aprox. ${daysRemaining} dias
⚖️ *Último Peso:* ${weightHistory[0]?.value || '64.8'} kg

🔍 *Sintomas e Diário Recente:*
${recentSymptoms || 'Sem registros recentes no diário.'}

❓ *Dúvidas e Perguntas para a Consulta:*
${questionsList || 'Nenhuma dúvida pendente anotada.'}

📅 *Próximos Compromissos Agendados:*
${allEventsList.filter(e => !e.done).slice(0, 3).map(e => `• ${e.date.split('-').reverse().join('/')} às ${e.time}: ${e.title} (${e.doctor || 'Sem médico'})`).join('\n')}
────────────────────────
Gerado pelo app Mamãe+`;
  };

  const handleCopySummary = () => {
    const text = generateClinicalSummaryText();
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  // Helper for category styling
  const getCategoryTheme = (type = "Consulta") => {
    const match = EVENT_CATEGORIES.find(c => c.id.toLowerCase() === type.toLowerCase());
    return match || EVENT_CATEGORIES[0];
  };

  return (
    <div className="w-full min-h-full pb-16 font-albert animate-fadeIn bg-[#FDF5F8] relative">
      <TopBar title="Agenda & Pré-Natal" />

      {/* Floating / Header Action Toolbar */}
      <div className="px-5 -mt-3 mb-3 flex items-center justify-between gap-2 relative z-10">
        <div className="flex bg-[#F0DDE4]/60 p-1 rounded-2xl border border-[#E8CCD7] backdrop-blur-xs">
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "month"
                ? "bg-[#D4638F] text-white shadow-sm"
                : "text-[#8C6B7A] hover:text-[#3D2B33]"
            }`}
          >
            <CalendarIcon size={14} /> Mês
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "timeline"
                ? "bg-[#D4638F] text-white shadow-sm"
                : "text-[#8C6B7A] hover:text-[#3D2B33]"
            }`}
          >
            <ListFilter size={14} /> Linha do Tempo
          </button>
        </div>

        <button
          onClick={() => setShowSummaryModal(true)}
          className="bg-white hover:bg-[#FBE8EF] border border-[#F0DDE4] text-[#6B2D4E] font-bold text-xs px-3.5 py-2 rounded-2xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <FileText size={14} className="text-[#D4638F]" />
          <span>Resumo p/ Médico</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="px-5 mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {["Todos", "Consulta", "Exame", "Vacina", "Medicamento"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap border transition cursor-pointer ${
              filterCategory === cat
                ? "bg-[#6B2D4E] text-white border-[#6B2D4E] shadow-xs"
                : "bg-white text-[#8C6B7A] border-[#F0DDE4] hover:bg-[#FBE8EF]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {viewMode === "month" ? (
        <>
          {/* Main Calendar Card */}
          <div className="px-5 relative z-10">
            <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4]">
              
              {/* Calendar Month Header with Month/Year Navigation & "Hoje" */}
              <div className="flex items-center justify-between mb-3.5 border-b border-[#F0DDE4] pb-2.5">
                <button 
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-full bg-[#FBE8EF] flex items-center justify-center text-[#D4638F] hover:bg-[#F3D5E2] transition-all active:scale-90 cursor-pointer"
                  title="Mês Anterior"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-[#3D2B33] font-poppins">
                    {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </h3>
                  <button
                    onClick={handleToday}
                    className="text-[10px] font-extrabold text-[#D4638F] bg-[#FBE8EF] hover:bg-[#F3D5E2] px-2 py-0.5 rounded-md transition cursor-pointer"
                  >
                    Hoje
                  </button>
                </div>

                <button 
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-full bg-[#FBE8EF] flex items-center justify-center text-[#D4638F] hover:bg-[#F3D5E2] transition-all active:scale-90 cursor-pointer"
                  title="Próximo Mês"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEKDAY_NAMES.map((w, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[10.5px] font-bold ${idx === 0 || idx === 6 ? "text-[#D4638F]" : "text-[#8C6B7A]"}`}
                  >
                    {w}
                  </span>
                ))}
              </div>

              {/* Day Grid Cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarGrid.map((cell, idx) => {
                  const isSelected = cell.dateStr === selectedDateStr;
                  const dayEvents = eventsByDate[cell.dateStr] || [];
                  const hasEvents = dayEvents.length > 0;
                  const isToday = cell.dateStr === "2026-10-17";

                  let bgStyle = "bg-transparent";
                  let textStyle = cell.isCurrentMonth ? "text-[#3D2B33]" : "text-[#C0A8B4]";
                  let borderStyle = "";

                  if (isSelected) {
                    bgStyle = "bg-[#D4638F]";
                    textStyle = "text-white font-extrabold shadow-sm";
                  } else if (isToday) {
                    bgStyle = "bg-[#FBE8EF]";
                    borderStyle = "border-2 border-[#D4638F]";
                    textStyle = "text-[#D4638F] font-bold";
                  } else if (hasEvents) {
                    bgStyle = "bg-[#FDF2F6] border border-[#F0DDE4]";
                    textStyle = "text-[#6B2D4E] font-bold";
                  }

                  return (
                    <button
                      key={`day-cell-${idx}-${cell.dateStr}`}
                      onClick={() => {
                        setSelectedDateStr(cell.dateStr);
                        if (!cell.isCurrentMonth) {
                          const [y, m] = cell.dateStr.split("-");
                          setViewDate(new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1));
                        }
                      }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-[12.5px] relative active:scale-95 transition-all duration-150 cursor-pointer ${bgStyle} ${textStyle} ${borderStyle}`}
                    >
                      <span>{cell.day}</span>
                      
                      {/* Dots for Events */}
                      {hasEvents && !isSelected && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayEvents.slice(0, 3).map((ev, ei) => {
                            const theme = getCategoryTheme(ev.type);
                            return (
                              <span 
                                key={ei} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ev.type === "Consulta" ? "bg-[#D4638F]" :
                                  ev.type === "Exame" ? "bg-purple-600" :
                                  ev.type === "Vacina" ? "bg-teal-600" : "bg-amber-500"
                                }`} 
                              />
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Date Events Section */}
          <div className="px-5 mt-4">
            <div className="flex justify-between items-center mb-3 px-1">
              <div>
                <p className="text-[12px] font-extrabold text-[#6B2D4E] uppercase tracking-wide">
                  Compromissos do Dia
                </p>
                <p className="text-[11px] text-[#8C6B7A] font-semibold">
                  {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("pt-BR", { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              <button
                onClick={() => handleOpenAddModal(selectedDateStr)}
                className="text-[11px] font-bold text-white bg-[#D4638F] hover:bg-[#B84D75] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Plus size={13} strokeWidth={3} /> Agendar
              </button>
            </div>

            {/* List of events for selected day */}
            {selectedDayEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedDayEvents.map((event) => {
                  const theme = getCategoryTheme(event.type);
                  return (
                    <div 
                      key={event.id}
                      className={`bg-white rounded-card p-4 shadow-mamae border transition-all ${
                        event.done ? "border-emerald-200 bg-emerald-50/20" : "border-[#F0DDE4]"
                      }`}
                    >
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleCalendarEventDone(event.id)}
                            className="mt-0.5 cursor-pointer text-[#8C6B7A] hover:text-[#D4638F] transition"
                            title={event.done ? "Marcar como pendente" : "Marcar como realizado"}
                          >
                            {event.done ? (
                              <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle size={20} className="text-[#C0A8B4]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${theme.lightBg} ${theme.text} border ${theme.border}`}>
                                {event.type || "Consulta"}
                              </span>
                              {event.done && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                                  Concluído
                                </span>
                              )}
                            </div>

                            <h4 className={`text-[14px] font-bold font-poppins mt-1 text-[#3D2B33] ${event.done ? "line-through opacity-70" : ""}`}>
                              {event.title}
                            </h4>
                          </div>
                        </div>

                        {/* Event actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleExportEvent(event)}
                            className="p-1.5 rounded-lg text-[#8C6B7A] hover:text-[#D4638F] hover:bg-[#FBE8EF] transition cursor-pointer"
                            title="Exportar para Google/Apple Calendar (.ics)"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(event)}
                            className="p-1.5 rounded-lg text-[#8C6B7A] hover:text-[#D4638F] hover:bg-[#FBE8EF] transition cursor-pointer"
                            title="Editar"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => deleteCalendarEvent(event.id)}
                            className="p-1.5 rounded-lg text-[#8C6B7A] hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#F0DDE4]/60 text-[11.5px] text-[#8C6B7A] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#D4638F]" /> {event.time || "Dia todo"}
                        </span>
                        {event.doctor && (
                          <span className="flex items-center gap-1.5 text-[#3D2B33]">
                            <Stethoscope size={13} className="text-[#D4638F]" /> {event.doctor}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1.5 col-span-full">
                            <MapPin size={13} className="text-[#D4638F]" /> {event.location}
                          </span>
                        )}
                      </div>

                      {/* Prep Instructions / Alertas */}
                      {event.prepInstructions && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 flex items-start gap-2 text-[11px] text-amber-900">
                          <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Instruções de Preparo: </span>
                            {event.prepInstructions}
                          </div>
                        </div>
                      )}

                      {/* Doctor Questions Checklist */}
                      <div className="mt-3 pt-2.5 border-t border-[#F0DDE4]/60">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-[#6B2D4E] flex items-center gap-1">
                            <MessageSquare size={12} className="text-[#D4638F]" /> 
                            Dúvidas para Tirar na Consulta
                          </span>
                          <span className="text-[10px] text-[#8C6B7A]">
                            {(event.questions || []).filter(q => q.done).length}/{(event.questions || []).length} respondidas
                          </span>
                        </div>

                        {/* List of questions */}
                        <div className="flex flex-col gap-1.5 mb-2">
                          {(event.questions || []).map((q) => (
                            <div 
                              key={q.id}
                              onClick={() => toggleQuestionDone(event.id, q.id)}
                              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#FDF5F8] hover:bg-[#FBE8EF] border border-[#F0DDE4] cursor-pointer text-[11.5px] transition"
                            >
                              {q.done ? (
                                <CheckCheck size={14} className="text-emerald-600 shrink-0" />
                              ) : (
                                <Circle size={14} className="text-[#C0A8B4] shrink-0" />
                              )}
                              <span className={`flex-1 ${q.done ? "line-through text-[#8C6B7A]" : "text-[#3D2B33] font-medium"}`}>
                                {q.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Add question input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Adicionar dúvida para não esquecer..."
                            value={newQuestionInput[event.id] || ""}
                            onChange={(e) => setNewQuestionInput({ ...newQuestionInput, [event.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddQuestion(event.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-[#FDF5F8] border border-[#F0DDE4] rounded-xl text-[11px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddQuestion(event.id)}
                            className="px-3 py-1.5 bg-[#D4638F] text-white rounded-xl text-[11px] font-bold hover:bg-[#B84D75] transition cursor-pointer"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-card p-5 shadow-mamae border border-[#F0DDE4] text-center py-6">
                <CalendarIcon size={28} className="text-[#D4638F]/40 mx-auto mb-2" />
                <p className="text-[12.5px] text-[#3D2B33] font-bold">
                  Nenhum compromisso agendado para este dia.
                </p>
                <p className="text-[10.5px] text-[#8C6B7A] mt-0.5 font-medium">
                  Clique no botão "+ Agendar" acima ou escolha uma recomendação pré-natal abaixo.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Timeline View of all upcoming events */
        <div className="px-5 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[13px] font-bold text-[#6B2D4E] font-poppins">
              Linha do Tempo Pré-Natal ({allEventsList.length} compromissos)
            </h3>
            <button
              onClick={handleExportAll}
              className="text-[11px] font-bold text-[#D4638F] hover:text-[#B84D75] flex items-center gap-1 cursor-pointer"
            >
              <Download size={13} /> Baixar Todos (.ics)
            </button>
          </div>

          {allEventsList.map((event) => {
            const theme = getCategoryTheme(event.type);
            const dateObj = new Date(event.date + "T00:00:00");
            const dateFormatted = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", weekday: "short" });

            return (
              <div 
                key={event.id}
                className="bg-white rounded-card p-4 shadow-mamae border border-[#F0DDE4] flex gap-3 items-start"
              >
                {/* Date column */}
                <div className="w-16 h-16 rounded-2xl bg-[#FBE8EF] border border-[#F0DDE4] flex flex-col items-center justify-center shrink-0 text-[#6B2D4E]">
                  <span className="text-[10px] font-bold uppercase text-[#D4638F]">
                    {MONTH_NAMES[dateObj.getMonth()].slice(0, 3)}
                  </span>
                  <span className="text-[18px] font-extrabold font-poppins leading-none">
                    {dateObj.getDate()}
                  </span>
                  <span className="text-[9px] font-semibold text-[#8C6B7A]">
                    {event.time?.split(" ")[0] || "Dia todo"}
                  </span>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-md ${theme.lightBg} ${theme.text}`}>
                      {event.type}
                    </span>
                    {event.done && (
                      <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                        Realizado
                      </span>
                    )}
                  </div>
                  <h4 className="text-[13.5px] font-bold text-[#3D2B33] font-poppins mt-1 truncate">
                    {event.title}
                  </h4>
                  {event.doctor && (
                    <p className="text-[11px] text-[#8C6B7A] font-semibold mt-0.5">
                      {event.doctor}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-[10.5px] text-[#8C6B7A] flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#D4638F]" /> {event.location}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleExportEvent(event)}
                    className="p-1.5 rounded-lg text-[#8C6B7A] hover:text-[#D4638F] hover:bg-[#FBE8EF] transition cursor-pointer"
                    title="Exportar (.ics)"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(event)}
                    className="p-1.5 rounded-lg text-[#8C6B7A] hover:text-[#D4638F] hover:bg-[#FBE8EF] transition cursor-pointer"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smart Prenatal Recommendations Section (Item 2) */}
      <div className="px-5 mt-6">
        <div className="bg-gradient-to-br from-[#6B2D4E] to-[#451C32] rounded-card p-4.5 text-white shadow-mamae">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#FFC4D6]" />
              <h3 className="text-[13.5px] font-bold font-poppins">
                Recomendações para a {currentWeek}ª Semana
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
              {trimester}º Trimestre
            </span>
          </div>

          <p className="text-[11px] text-pink-100/90 leading-relaxed mb-3.5">
            Exames, vacinas e consultas indicados pelos protocolos da FEBRASGO para a sua fase gestacional:
          </p>

          <div className="flex flex-col gap-2.5">
            {recommendedGuidelines.slice(0, 3).map((guide) => (
              <div 
                key={guide.id}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-start justify-between gap-3 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-pink-300 text-[#451C32]">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-pink-200 font-semibold">
                      Semanas {guide.minWeek}–{guide.maxWeek}
                    </span>
                  </div>
                  <h4 className="text-[12.5px] font-bold text-white font-poppins mt-1">
                    {guide.title}
                  </h4>
                  <p className="text-[10.5px] text-pink-100/80 mt-0.5 line-clamp-2">
                    {guide.description}
                  </p>
                  {guide.prep && (
                    <p className="text-[10px] text-amber-200 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle size={11} /> {guide.prep}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleScheduleGuideline(guide)}
                  className="bg-white text-[#6B2D4E] hover:bg-pink-50 font-extrabold text-[11px] px-3 py-1.5 rounded-full shrink-0 shadow-sm transition active:scale-95 cursor-pointer mt-1"
                >
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD / EDIT EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <form 
            onSubmit={handleSaveEvent}
            className="bg-white rounded-[32px] w-full max-w-[360px] p-5 shadow-2xl flex flex-col gap-3 max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#6B2D4E] font-bold text-[14.5px] flex items-center gap-2">
                {editingEventId ? <Edit3 size={17} className="text-[#D4638F]" /> : <Plus size={17} className="text-[#D4638F]" />}
                {editingEventId ? "Editar Compromisso" : "Novo Compromisso"}
              </h3>
              <button 
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-[#8C6B7A] hover:text-[#3D2B33] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-[#3D2B33]">Data</label>
                <input 
                  type="date" 
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FDF5F8] border border-[#F0DDE4] rounded-xl text-[11.5px] text-[#3D2B33] outline-none font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-[#3D2B33]">Horário</label>
                <input 
                  type="time" 
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FDF5F8] border border-[#F0DDE4] rounded-xl text-[11.5px] text-[#3D2B33] outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Categoria</label>
              <select 
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-3 py-2 bg-[#FDF5F8] border border-[#F0DDE4] rounded-xl text-[11.5px] text-[#3D2B33] outline-none font-medium"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Título do Evento</label>
              <input 
                type="text" 
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Consulta Pré-Natal, Ultrassom..."
                className="w-full px-3 py-2 bg-white border border-[#F0DDE4] rounded-xl text-[12px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Médico ou Profissional</label>
              <input 
                type="text" 
                value={formDoctor}
                onChange={(e) => setFormDoctor(e.target.value)}
                placeholder="Ex: Dra. Luiza Martins"
                className="w-full px-3 py-2 bg-white border border-[#F0DDE4] rounded-xl text-[12px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Local / Clínica</label>
              <input 
                type="text" 
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="Ex: Hospital Santa Maria - Sala 204"
                className="w-full px-3 py-2 bg-white border border-[#F0DDE4] rounded-xl text-[12px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Instruções de Preparo (Opcional)</label>
              <input 
                type="text" 
                value={formPrep}
                onChange={(e) => setFormPrep(e.target.value)}
                placeholder="Ex: Jejum de 8h, Bexiga cheia..."
                className="w-full px-3 py-2 bg-white border border-[#F0DDE4] rounded-xl text-[12px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10.5px] font-bold text-[#3D2B33]">Anotações Adicionais</label>
              <textarea 
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Observações importantes..."
                className="w-full px-3 py-2 bg-white border border-[#F0DDE4] rounded-xl text-[12px] text-[#3D2B33] outline-none focus:border-[#D4638F] font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4638F] hover:bg-[#B84D75] text-white font-extrabold text-[13px] py-3 rounded-full shadow-md mt-1 transition-all cursor-pointer"
            >
              {editingEventId ? "Salvar Alterações" : "Agendar Compromisso"}
            </button>
          </form>
        </div>
      )}

      {/* MEDICAL SUMMARY REPORT MODAL (Item 4) */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-[420px] p-5 shadow-2xl flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FBE8EF] text-[#D4638F] flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-poppins text-[#6B2D4E] font-bold text-[14px]">
                    Resumo Clínico Pré-Natal
                  </h3>
                  <p className="text-[10px] text-[#8C6B7A]">Para levar na consulta médica</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="text-[#8C6B7A] hover:text-[#3D2B33] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formatted Report Card */}
            <div className="bg-[#FDF5F8] border border-[#F0DDE4] rounded-2xl p-4 flex flex-col gap-2.5 text-[11.5px] text-[#3D2B33]">
              <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
                <span className="font-bold text-[#6B2D4E]">Idade Gestacional:</span>
                <span className="font-extrabold text-[#D4638F]">{currentWeek} semanas ({trimester}º Tri)</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
                <span className="font-bold text-[#6B2D4E]">Previsão do Parto:</span>
                <span>Faltam ~{daysRemaining} dias</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
                <span className="font-bold text-[#6B2D4E]">Último Peso Registrado:</span>
                <span>{weightHistory[0]?.value || 64.8} kg</span>
              </div>

              <div>
                <span className="font-bold text-[#6B2D4E] block mb-1">Últimos Sintomas (Diário):</span>
                {diaryEntries.length > 0 ? (
                  <div className="flex flex-col gap-1 pl-2 text-[11px] text-[#8C6B7A]">
                    {diaryEntries.slice(0, 3).map((d) => (
                      <p key={d.id}>• <strong className="text-[#3D2B33]">{d.date}:</strong> {d.symptoms?.join(", ") || "Sem queixas"} (Humor: {d.mood})</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#8C6B7A] pl-2">Nenhum sintoma registrado recentemente.</p>
                )}
              </div>

              <div>
                <span className="font-bold text-[#6B2D4E] block mb-1">Perguntas Pendentes para a Consulta:</span>
                {allEventsList.some(e => (e.questions || []).some(q => !q.done)) ? (
                  <div className="flex flex-col gap-1 pl-2 text-[11px] text-[#3D2B33]">
                    {allEventsList.flatMap(e => (e.questions || []).filter(q => !q.done).map(q => (
                      <p key={q.id}>• {q.text} <span className="text-[#8C6B7A] text-[9.5px]">({e.title})</span></p>
                    )))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#8C6B7A] pl-2">Nenhuma pergunta pendente anotada.</p>
                )}
              </div>
            </div>

            {/* Share / Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopySummary}
                className="bg-[#D4638F] hover:bg-[#B84D75] text-white font-bold text-[12px] py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              >
                {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
                {copiedSummary ? "Copiado!" : "Copiar Texto"}
              </button>

              <button
                type="button"
                onClick={handleExportAll}
                className="bg-white hover:bg-[#FBE8EF] border border-[#F0DDE4] text-[#6B2D4E] font-bold text-[12px] py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Download size={14} className="text-[#D4638F]" />
                <span>Exportar .ICS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
