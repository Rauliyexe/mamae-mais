import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { BookHeart, Camera, Heart, CheckCircle2, ChevronRight, Image as ImageIcon, Flame, Droplet, Dumbbell, Star } from "lucide-react";
import { PREGNANCY_DATA } from "../data/mockData";

export default function Diario() {
  const { user, currentWeek, diaryEntries, addDiaryEntry, goBack, diaryStreak } = useApp();
  
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [waterToday, setWaterToday] = useState(false);
  const [activityToday, setActivityToday] = useState(false);
  const [diaryText, setDiaryText] = useState("");
  const [albumOpen, setAlbumOpen] = useState(false);

  const toggleSymptom = (s) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const handleSave = () => {
    const today = new Date();
    const dateString = `Semana ${currentWeek} · ${today.getDate()}/${today.getMonth() + 1}`;

    const newEntry = {
      id: Date.now(),
      date: dateString,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ["Sem Sintomas"],
      text: diaryText.trim() || "Registro diário salvo.",
      energy: energyLevel,
      waterToday,
      activityToday,
    };

    addDiaryEntry(newEntry);
    
    // Reset form
    setDiaryText("");
    setSelectedSymptoms([]);
    setEnergyLevel(3);
    setWaterToday(false);
    setActivityToday(false);

    alert("Registro diário salvo com sucesso!");
    goBack();
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FAF8F5] relative">
      <TopBar title="Diário de Sintomas" showBack={true} />

      {/* Album Modal (Overlay) */}
      {albumOpen && (
        <div className="absolute inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-[340px] p-5 shadow-2xl flex flex-col border border-[#F0DDE4]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-poppins text-[#6B2D4E] font-bold text-[15px] flex items-center gap-2">
                <ImageIcon size={17} className="text-[#C38B9B]" />
                Álbum da Grávida
              </h3>
              <button 
                onClick={() => setAlbumOpen(false)}
                className="text-[#8C6B7A] hover:text-[#3D2B33] text-[18px] font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-[11px] text-[#8C6B7A] mb-4 font-medium">
              Acompanhe fotos da evolução da sua gestação e crie memórias lindas.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="rounded-2xl border-2 border-dashed border-[#E5E1DB] flex flex-col items-center justify-center gap-1.5 p-3 hover:bg-[#FAF3F6]/40 active:scale-95 transition-all text-[#C38B9B] h-[142px] cursor-pointer">
                <Camera size={20} />
                <span className="text-[10px] font-bold text-center leading-tight">Adicionar Foto</span>
              </button>
            </div>

            <button
              onClick={() => setAlbumOpen(false)}
              className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold text-[13px] py-3 rounded-full transition-all cursor-pointer"
            >
              Fechar Álbum
            </button>
          </div>
        </div>
      )}

      {/* Main Questionnaire */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white rounded-card p-4.5 shadow-mamae border border-[#F0DDE4]">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#F0DDE4]">
            <div>
              <p className="text-[10px] font-bold text-[#C38B9B] uppercase tracking-wider">Acompanhamento</p>
              <h2 className="text-[#3D2B33] font-bold text-[14.5px] font-poppins mt-0.5">
                Semana {currentWeek} · Registro Hoje
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <BookHeart className="text-[#C38B9B] mb-1" size={19} />
              {diaryStreak > 0 && (
                <span className="text-[9px] font-extrabold text-[#C38B9B] flex items-center gap-0.5 bg-[#FAF3F6] px-2 py-0.5 rounded-full">
                  <Flame size={10} /> {diaryStreak} {diaryStreak === 1 ? "dia" : "dias"}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions (Water & Activity) */}
          <div className="flex gap-2.5 mb-4">
            <button
              onClick={() => setWaterToday(!waterToday)}
              className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                waterToday 
                  ? "bg-[#C38B9B] text-white border-[#C38B9B] shadow-sm" 
                  : "bg-white text-[#8C6B7A] border-[#F0DDE4]"
              }`}
            >
              <Droplet size={14} /> Bebi Água
            </button>
            <button
              onClick={() => setActivityToday(!activityToday)}
              className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                activityToday 
                  ? "bg-[#C38B9B] text-white border-[#C38B9B] shadow-sm" 
                  : "bg-white text-[#8C6B7A] border-[#F0DDE4]"
              }`}
            >
              <Dumbbell size={14} /> Atividade Física
            </button>
          </div>

          {/* Energy Level */}
          <div className="mb-4">
            <label className="text-[11px] font-bold text-[#3D2B33] block mb-1.5">
              Nível de Energia
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setEnergyLevel(star)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star 
                    size={22} 
                    fill={energyLevel >= star ? "#C38B9B" : "transparent"} 
                    className={energyLevel >= star ? "text-[#C38B9B]" : "text-[#F0DDE4]"} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Chips */}
          <div className="mb-4">
            <label className="text-[11px] font-bold text-[#3D2B33] block mb-1.5">
              Sintomas do Dia
            </label>
            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto scrollbar-thin pr-1">
              {PREGNANCY_DATA.symptoms.map((s) => {
                const isSelected = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#FAF3F6] border-[#C38B9B] text-[#C38B9B]" 
                        : "bg-white border-[#F0DDE4] text-[#8C6B7A]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Area */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[11.5px] font-bold text-[#3D2B33] px-0.5">
              Escreva notas ou sentimentos adicionais:
            </label>
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="Ex: Senti os primeiros chutes hoje à tarde..."
              className="w-full h-20 rounded-2xl p-3 bg-[#FAF3F6]/40 border border-[#F0DDE4] text-[12px] text-[#3D2B33] placeholder-[#8C6B7A]/50 outline-none focus:border-[#C38B9B] transition resize-none font-medium"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-extrabold text-[13px] py-3.5 rounded-full shadow-sm transition duration-150 active:scale-[0.98] outline-none cursor-pointer"
          >
            Salvar Diário
          </button>
        </div>
      </div>

      {/* Album Shortcut Card */}
      <div className="px-5 mt-4">
        <button
          onClick={() => setAlbumOpen(true)}
          className="w-full bg-white rounded-card p-4 border border-[#F0DDE4] shadow-mamae flex items-center justify-between hover:bg-[#FAF3F6] transition duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3F6] flex items-center justify-center text-[#C38B9B] shadow-sm">
              <Camera size={18} />
            </div>
            <div className="text-left">
              <h4 className="text-[13.5px] font-bold text-[#3D2B33] font-poppins">Álbum da Grávida</h4>
              <p className="text-[10px] text-[#8C6B7A] mt-0.5 font-medium">Evolução da barriguinha semana a semana</p>
            </div>
          </div>
          <ChevronRight size={15} className="text-[#C38B9B]" />
        </button>
      </div>

      {/* Historical Entries */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h3 className="text-[14px] font-bold text-[#3D2B33] font-poppins flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#C38B9B]" />
            Logs Anteriores
          </h3>
        </div>

        <div className="space-y-3">
          {diaryEntries.map((e) => (
            <div 
              key={e.id} 
              className="bg-white rounded-card p-4 shadow-mamae border border-[#F0DDE4] animate-fadeIn"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9.5px] font-bold text-[#C38B9B] bg-[#FAF3F6] px-2.5 py-0.5 rounded-full uppercase">
                  {e.date}
                </span>
                <div className="flex items-center gap-1">
                  {e.energy && (
                    <span className="text-[10px] flex items-center text-[#C38B9B]">
                      <Star size={10} fill="currentColor" /> {e.energy}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Symptoms Pills */}
              {e.symptoms && e.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {e.symptoms.map((s, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9px] font-bold bg-[#FAF3F6] text-[#C38B9B] px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[12px] leading-relaxed text-[#3D2B33] font-medium" style={{ fontFamily: "Albert Sans" }}>
                {e.text}
              </p>
            </div>
          ))}
          {diaryEntries.length === 0 && (
            <p className="text-[12px] text-center text-[#8C6B7A] py-4">Nenhum registro ainda. Comece hoje!</p>
          )}
        </div>
      </div>
    </div>
  );
}
