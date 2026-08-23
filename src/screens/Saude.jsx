import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import { PREGNANCY_DATA } from "../data/mockData";
import { Activity, Plus, PhoneCall, Heart, MapPin, Scale, ClipboardList, CheckCircle, ShieldAlert, X, Clock, PlayCircle, StopCircle, FileText } from "lucide-react";

export default function Saude() {
  const { 
    user,
    weightHistory, addWeight, 
    kickSessions, activeKickSession, startKickSession, registerKick, endKickSession,
    navigate
  } = useApp();
  
  const [activeModal, setActiveModal] = useState(null);
  const [inputWeight, setInputWeight] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [mapType, setMapType] = useState("hospitais");

  const renderCategoryIcon = (id) => {
    const props = { size: 20, className: "text-[#C38B9B]" };
    switch (id) {
      case "peso": return <Scale {...props} />;
      case "exames": return <ClipboardList {...props} />;
      case "chutes": return <Activity {...props} />;
      case "hidratacao": return <PhoneCall {...props} />; // PhoneCall or similar? Let's use a nice clinical wave or drop, like Activity or Scale
      case "atividade": return <Heart {...props} />;
      case "cuidados": return <Plus {...props} />;
      default: return <Activity {...props} />;
    }
  };

  const [exams, setExams] = useState([
    { id: 1, name: "Ultrassonografia Morfológica", done: true, period: "18-22 Sem" },
    { id: 2, name: "Exame de Curva Glicêmica", done: false, period: "24-28 Sem" },
    { id: 3, name: "Hemograma & Urina Completo", done: true, period: "1º Trimestre" },
    { id: 4, name: "Sorologias Pré-Natal", done: false, period: "3º Trimestre" }
  ]);

  // Timer for active kick session
  useEffect(() => {
    let interval = null;
    if (activeKickSession) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - activeKickSession.startTime) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activeKickSession]);

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!inputWeight || isNaN(inputWeight)) return;
    addWeight(inputWeight);
    setInputWeight("");
  };

  const toggleExam = (id) => {
    setExams(exams.map((ex) => (ex.id === id ? { ...ex, done: !ex.done } : ex)));
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="w-full min-h-full pb-8 font-albert animate-fadeIn bg-[#FAF8F5] relative">
      <TopBar title="Central de Saúde" showBack={true} />

      {/* OVERLAY DIALOGS */}
      {activeModal && (
        <div className="absolute inset-0 bg-[#3D2B33]/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-[340px] max-h-[720px] overflow-y-auto p-5 shadow-2xl flex flex-col scrollbar-none border border-[#F0DDE4]">
            
            <div className="flex justify-between items-center mb-3.5 pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#6B2D4E] font-bold text-[14.5px] flex items-center gap-2">
                {PREGNANCY_DATA.healthCategories.find((c) => c.id === activeModal)?.name}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-[#8C6B7A] cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* WEIGHT */}
            {activeModal === "peso" && (
              <div className="flex flex-col gap-4">
                <form onSubmit={handleAddWeight} className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={inputWeight}
                    onChange={(e) => setInputWeight(e.target.value)}
                    placeholder="Ex: 65.5"
                    className="flex-1 px-3 py-2 border border-[#F0DDE4] rounded-xl text-[12.5px] text-[#3D2B33] outline-none font-medium"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#C38B9B] hover:bg-[#A87483] text-white px-4 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </form>

                <div className="bg-[#FAF3F6] p-3 rounded-2xl border border-[#F0DDE4]">
                  <h4 className="text-[11.5px] font-bold text-[#C38B9B] mb-2">Histórico de Peso</h4>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-none">
                    {weightHistory.map((w, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[12px] text-[#3D2B33] py-1 border-b border-[#F0DDE4]/45 last:border-0 font-semibold">
                        <span>{w.date}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-[#8C6B7A]">{w.savedDate}</span>
                          <span className="font-bold text-[#C38B9B]">{w.value} kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EXAMS */}
            {activeModal === "exames" && (
              <div className="flex flex-col gap-3">
                <p className="text-[11px] text-[#8C6B7A] leading-relaxed font-medium">
                  Confira e marque os exames de pré-natal concluídos ou agendados.
                </p>
                <div className="space-y-2 max-h-[260px] overflow-y-auto scrollbar-none pr-1">
                  {exams.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => toggleExam(ex.id)}
                      className="w-full text-left bg-[#FAF3F6] border border-[#F0DDE4] hover:bg-[#F5ECEF] rounded-2xl p-3 flex items-center justify-between gap-3 text-[#3D2B33] cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[12px] font-bold leading-tight truncate">{ex.name}</h4>
                        <span className="text-[9.5px] text-[#8C6B7A] font-semibold mt-0.5">{ex.period}</span>
                      </div>
                      <CheckCircle
                        size={18}
                        className={ex.done ? "text-[#C38B9B] fill-white" : "text-[#B8A0AB]"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HEALTH POSTS */}
            {activeModal === "postos" && (
              <div className="flex flex-col gap-3 text-[#3D2B33] text-[12px]">
                <p className="text-[#8C6B7A] text-[11px] leading-relaxed font-medium">
                  Centros de saúde próximos para consultas SUS, vacinação e exames.
                </p>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-none">
                  <div className="bg-[#FBE8EF]/30 border border-[#F0DDE4] p-3 rounded-2xl">
                    <h4 className="font-bold text-[#D4638F] text-[12.5px] font-poppins">UBS Vila Mariana</h4>
                    <p className="text-[11px] text-[#8C6B7A] mt-0.5 flex items-center gap-1 font-semibold">
                      <MapPin size={11} /> R. Domingos de Morais, 1200
                    </p>
                    <p className="text-[10px] text-[#D4638F] mt-1 font-extrabold uppercase">Aberto · 07:00 às 19:00</p>
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT */}
            {activeModal === "apoio" && (
              <div className="flex flex-col gap-3 text-[12px] text-[#3D2B33]">
                <p className="text-[#8C6B7A] text-[11px] leading-relaxed font-medium">
                  Canais úteis para atendimento emergencial e apoio.
                </p>
                <div className="space-y-2">
                  <a href="tel:192" className="flex items-center justify-between p-3.5 bg-[#FBE8EF]/30 hover:bg-[#FBE8EF]/70 border border-[#F0DDE4] rounded-2xl font-bold transition-all">
                    <span className="flex items-center gap-2 text-[#D4638F]">
                      <PhoneCall size={16} /> SAMU (Emergência)
                    </span>
                    <span className="bg-[#D4638F] text-white px-3 py-1 rounded-full text-[10px] shadow-sm">192</span>
                  </a>
                </div>
              </div>
            )}

            {/* KICK COUNTER */}
            {activeModal === "chutes" && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-[#8C6B7A] text-[11px] text-center leading-relaxed font-medium">
                  O ideal é registrar 10 chutes em um período de até 2 horas. Comece a sessão quando o bebê estiver ativo!
                </p>

                {activeKickSession ? (
                  <>
                    <div className="w-full flex items-center justify-between px-2">
                      <span className="text-[16px] font-bold text-[#6B2D4E] font-poppins flex items-center gap-1.5">
                        <Clock size={16} className="text-[#C38B9B]" /> {formatTime(elapsedSeconds)}
                      </span>
                      {activeKickSession.kicks.length >= 10 && (
                        <span className="text-[9px] font-extrabold text-white bg-[#C38B9B] px-2 py-1 rounded-full uppercase">
                          Meta Atingida!
                        </span>
                      )}
                    </div>

                    <button
                      onClick={registerKick}
                      className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#C38B9B] to-[#E8A0BA] border-4 border-[#FBE8EF] flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                      <span className="text-[36px] font-bold text-white leading-none">
                        {activeKickSession.kicks.length}
                      </span>
                      <span className="text-[11px] font-extrabold text-white/90 uppercase mt-1">Chutes</span>
                    </button>

                    <button
                      onClick={endKickSession}
                      className="w-full bg-[#8C6B7A]/10 hover:bg-[#8C6B7A]/25 text-[#3D2B33] font-bold text-[13px] py-3 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <StopCircle size={16} /> Finalizar Sessão
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full bg-[#FBE8EF] border-2 border-[#D4A0B5] flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[28px] font-bold text-[#C38B9B] leading-none">0</span>
                    </div>
                    <button
                      onClick={startKickSession}
                      className="w-full bg-[#C38B9B] hover:bg-[#A87483] text-white font-bold text-[13px] py-3.5 rounded-full flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer mt-2"
                    >
                      <PlayCircle size={18} /> Iniciar Sessão
                    </button>
                  </>
                )}

                {/* History */}
                {kickSessions.length > 0 && !activeKickSession && (
                  <div className="w-full mt-2">
                    <h4 className="text-[11px] font-bold text-[#8C6B7A] mb-2 uppercase">Últimas Sessões</h4>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto scrollbar-thin">
                      {kickSessions.map((session) => (
                        <div key={session.id} className="bg-[#FAF3F6] border border-[#F0DDE4] p-2.5 rounded-xl flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#3D2B33]">{session.date} (Sem {session.week})</span>
                            <span className="text-[9.5px] text-[#8C6B7A]">Duração: {formatDuration(session.durationMs)}</span>
                          </div>
                          <span className="text-[13px] font-bold text-[#C38B9B]">{session.count} chutes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CARE */}
            {activeModal === "cuidados" && (
              <div className="flex flex-col gap-3">
                <div className="bg-[#FAF3F6] p-3 rounded-2xl border border-[#F0DDE4] flex gap-3.5 items-start">
                  <Heart size={18} className="text-[#C38B9B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#C38B9B] text-[12.5px] font-poppins">Prevenção de Estrias</h4>
                    <p className="text-[11.5px] text-[#3D2B33] mt-0.5 leading-relaxed font-medium">
                      Hidrate a barriga duas vezes ao dia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#8C6B7A]/10 hover:bg-[#8C6B7A]/20 text-[#3D2B33] font-bold text-[13px] py-3.5 rounded-full mt-4 transition-all duration-150 cursor-pointer"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      )}

      {/* Emergency Warning & Dial Card */}
      <div className="px-5 -mt-4 relative z-10 space-y-3">
        <div className="bg-[#FFF5F5] rounded-card p-4 shadow-mamae border border-[#FEE2E2] flex flex-col gap-3">
          <div className="flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE8E8] flex items-center justify-center shrink-0 text-[#E53E3E]">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-poppins text-[13.5px] font-bold text-[#C53030] leading-tight">Canal de Emergência</h4>
              <p className="text-[11px] text-[#9B2C2C] leading-relaxed mt-0.5 font-medium">
                Dores intensas, sangramentos ou perda de líquido? Tenha acesso aos números essenciais de emergência médica e obstétrica.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="w-full bg-[#E53E3E] hover:bg-[#C53030] text-white font-extrabold text-[11.5px] py-2.5 rounded-xl shadow-xs transition duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <PhoneCall size={13} /> Ligar para Emergência
          </button>
        </div>
      </div>

      {/* Document Library Banner */}
      <div className="px-5 mt-4">
        <button
          onClick={() => navigate("bibliotecaexames")}
          className="w-full bg-[#FAF3F6] hover:bg-[#FAF3F6]/80 rounded-card p-4 shadow-mamae border border-[#F0DDE4] flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] cursor-pointer"
        >
          <div className="flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 text-[#C38B9B] border border-[#F0DDE4] shadow-xs">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="font-poppins text-[13.5px] font-bold text-[#4A4743] leading-tight">Biblioteca da Nina</h4>
              <p className="text-[11px] text-[#8C6B7A] leading-relaxed mt-0.5 font-medium">
                Envie laudos e organize seus exames por gavetas inteligentes compartilhadas com o obstetra.
              </p>
            </div>
          </div>
          <span className="text-[#C38B9B] text-lg font-bold">›</span>
        </button>
      </div>

      {/* Grid of 6 health categories */}
      <div className="px-5 mt-5">
        <h3 className="text-[14px] font-bold text-[#3D2B33] font-poppins mb-3 px-0.5">
          Minha Saúde & Gestação
        </h3>

        <div className="grid grid-cols-2 gap-3.5">
          {PREGNANCY_DATA.healthCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveModal(c.id)}
              className="bg-white rounded-card p-4 border border-[#F0DDE4] shadow-mamae hover:bg-[#FAF3F6] active:scale-[0.98] transition-all flex flex-col items-center justify-between text-center gap-2.5 h-[125px] group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FAF3F6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                {renderCategoryIcon(c.id)}
              </div>
              <div>
                <h4 className="text-[12.5px] font-bold text-[#3D2B33] font-poppins leading-tight group-hover:text-[#C38B9B] transition-colors">
                  {c.name}
                </h4>
                <p className="text-[9.5px] text-[#8C6B7A] mt-0.5 line-clamp-1 font-semibold">
                  {c.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="px-5 mt-6 space-y-3">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-[13.5px] font-bold text-[#4A4743] font-poppins">
            Hospitais & Segurança Próximos
          </h3>
          <span className="text-[9.5px] font-extrabold text-[#C38B9B] bg-[#FAF3F6] border border-[#F0DDE4] px-2 py-0.5 rounded-lg flex items-center gap-1">
            <MapPin size={9} /> {user.location || "São Paulo, Brasil"}
          </span>
        </div>

        <div className="bg-white rounded-[24px] border border-[#F0DDE4] shadow-mamae overflow-hidden flex flex-col">
          {/* Map Tabs */}
          <div className="flex border-b border-[#F0DDE4] bg-[#FAF3F6]/20">
            <button
              onClick={() => setMapType("hospitais")}
              className={`flex-1 py-2 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                mapType === "hospitais" 
                  ? "border-[#C38B9B] text-[#C38B9B] bg-[#FAF3F6]/50" 
                  : "border-transparent text-[#8C6B7A] hover:bg-[#FAF8F5]"
              }`}
            >
              🏥 Maternidades & Hospitais
            </button>
            <button
              onClick={() => setMapType("policia")}
              className={`flex-1 py-2 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                mapType === "policia" 
                  ? "border-[#C38B9B] text-[#C38B9B] bg-[#FAF3F6]/50" 
                  : "border-transparent text-[#8C6B7A] hover:bg-[#FAF8F5]"
              }`}
            >
              🚨 Policiamento & Delegacias
            </button>
          </div>

          {/* Interactive Map Iframe */}
          <div className="w-full h-[220px] bg-[#FAF3F6] relative">
            <iframe
              title="Mapa de Serviços de Emergência"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(user.location || "São Paulo, Brasil")}+${mapType === "hospitais" ? "hospital+maternidade" : "delegacia+policia"}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            />
          </div>
          
          <div className="p-3 bg-[#FAF3F6]/30 border-t border-[#F0DDE4] text-[9.5px] text-[#8C6B7A] leading-relaxed font-medium">
            Mapa interativo sincronizado com sua localização. Você pode dar zoom, arrastar e identificar rotas de emergência.
          </div>
        </div>
      </div>

      {/* Emergency Dial Overlay Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-[#3D2B33]/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[350px] p-5 shadow-2xl border border-[#F0DDE4] flex flex-col gap-4 animate-fadeIn">
            
            <div className="flex justify-between items-center pb-2 border-b border-[#F0DDE4]">
              <h3 className="font-poppins text-[#4A4743] font-bold text-[13.5px] flex items-center gap-1.5">
                <ShieldAlert size={16} className="text-[#E53E3E]" /> Contatar Emergência
              </h3>
              <button 
                onClick={() => setShowEmergencyModal(false)} 
                className="text-[#8C6B7A] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[11px] text-[#8C6B7A] leading-relaxed font-medium">
              Escolha uma das linhas diretas abaixo para efetuar a chamada telefônica de resgate ou suporte clínico:
            </p>

            <div className="space-y-2.5">
              {[
                { number: "192", name: "SAMU (Urgência Médica)", desc: "Indicado para contrações graves e sangramentos." },
                { number: "193", name: "Corpo de Bombeiros (Resgate)", desc: "Socorro rápido e transporte emergencial." },
                { number: "190", name: "Polícia Militar (Segurança)", desc: "Ocorrências de perigo e segurança pública." },
                { number: "+5511999998888", name: "Dr. Leonardo (Obstetra)", desc: "Contato clínico direto do seu médico." },
                { number: "+5511988887777", name: "Contato de Emergência (Marido)", desc: "Ligar para seu parceiro cadastrado." }
              ].map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="block bg-[#FAF3F6]/55 hover:bg-[#FAF3F6] border border-[#F0DDE4] p-3 rounded-2xl transition-all shadow-3xs hover:border-[#C38B9B]/60"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-[11.5px] font-bold text-[#4A4743]">{item.name}</h4>
                      <p className="text-[9.5px] text-[#8C6B7A] mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                    <span className="text-[11px] font-extrabold text-[#C38B9B] bg-white border border-[#F0DDE4] px-2 py-0.5 rounded-lg shrink-0">
                      {item.number.startsWith("+") ? "Ligar" : item.number}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full bg-[#FAF3F6] hover:bg-[#FAF3F6]/80 text-[#4A4743] font-bold text-xs py-2.5 rounded-xl border border-[#F0DDE4] cursor-pointer mt-1"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
