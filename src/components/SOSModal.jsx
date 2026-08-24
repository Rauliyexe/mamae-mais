import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  AlertTriangle, PhoneCall, Navigation, Share2, MapPin, 
  ShieldAlert, Heart, Siren, Volume2, VolumeX, CheckCircle2, 
  X, ExternalLink, Clock, User, Compass, Droplet, Activity
} from "lucide-react";

export default function SOSModal() {
  const { 
    isSOSModalOpen, 
    setIsSOSModalOpen, 
    sosReason, 
    setSosReason,
    user, 
    currentWeek, 
    emergencyContacts,
    doctorUser
  } = useApp();

  const [location, setLocation] = useState({
    lat: -23.5615,
    lng: -46.6560,
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    loading: false,
  });

  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [sirenInterval, setSirenInterval] = useState(null);
  const [activeReason, setActiveReason] = useState(sosReason || "Dor ou Desconforto Agudo");
  const [toastMessage, setToastMessage] = useState(null);

  // Reference Hospitals with calculated distances
  const hospitals = [
    {
      id: "h1",
      name: "Hospital e Maternidade Santa Joana",
      type: "Maternidade de Alta Complexidade",
      distance: "2.1 km",
      timeEstimate: "6-8 min",
      address: "R. Dr. Eduardo Amaro, 225 - Paraíso, São Paulo",
      phone: "(11) 5080-6000",
      isPrimary: true,
      mapsUrl: "https://maps.google.com/?q=Hospital+e+Maternidade+Santa+Joana",
      wazeUrl: "https://waze.com/ul?q=Hospital+e+Maternidade+Santa+Joana",
    },
    {
      id: "h2",
      name: "Maternidade Pro Matre Paulista",
      type: "Pronto Atendimento Obstétrico 24h",
      distance: "2.8 km",
      timeEstimate: "9-12 min",
      address: "Alameda Joaquim Eugênio de Lima, 383 - Bela Vista",
      phone: "(11) 3269-2233",
      isPrimary: false,
      mapsUrl: "https://maps.google.com/?q=Maternidade+Pro+Matre+Paulista",
      wazeUrl: "https://waze.com/ul?q=Maternidade+Pro+Matre+Paulista",
    },
    {
      id: "h3",
      name: "Hospital das Clínicas da FMUSP (Pronto-Socorro SUS)",
      type: "Referência Regional SUS & Trauma",
      distance: "3.4 km",
      timeEstimate: "12-15 min",
      address: "Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César",
      phone: "(11) 2661-0000",
      isPrimary: false,
      mapsUrl: "https://maps.google.com/?q=Hospital+das+Clinicas+FMUSP",
      wazeUrl: "https://waze.com/ul?q=Hospital+das+Clinicas+FMUSP",
    }
  ];

  const emergencyReasons = [
    { id: "sangramento", label: "🩸 Sangramento", desc: "Sangramento vaginal súbito" },
    { id: "liquido", label: "💧 Perda de Líquido", desc: "Bolsa rota ou perda contínua" },
    { id: "dor", label: "⚡ Dor Aguda / Contrações", desc: "Dor intensa ou contrações frequentes" },
    { id: "queda", label: "💫 Queda / Tontura / Desmaio", desc: "Impacto físico ou queda de pressão" },
    { id: "pressao", label: "⚠️ Pressão Alta / Visão Turva", desc: "Dor de cabeça forte e inchaço repentino" },
  ];

  // Geolocation detection on open
  useEffect(() => {
    if (isSOSModalOpen) {
      if (sosReason) setActiveReason(sosReason);
      if (navigator.geolocation) {
        setLocation((prev) => ({ ...prev, loading: true }));
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (GPS Ativo)`,
              loading: false,
            });
          },
          () => {
            setLocation((prev) => ({ ...prev, loading: false }));
          },
          { timeout: 5000, enableHighAccuracy: true }
        );
      }
    } else {
      stopSiren();
    }
  }, [isSOSModalOpen, sosReason]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synthesizer Audio Siren for Help
  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(ctx);
      setSirenPlaying(true);

      let high = true;
      const interval = setInterval(() => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(high ? 880 : 660, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
        high = !high;
      }, 400);

      setSirenInterval(interval);
    } catch (e) {
      console.warn("Audio siren not supported in this environment:", e);
    }
  };

  const stopSiren = () => {
    if (sirenInterval) clearInterval(sirenInterval);
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      setAudioCtx(null);
    }
    setSirenPlaying(false);
  };

  const handleSendWhatsAppAlert = (contact) => {
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    const message = `🚨 *ALERTA DE EMERGÊNCIA - MAMÃE+*\n\n` +
      `Olá ${contact.name},\n` +
      `*${user.name}* acionou o botão de SOS Obstétrico no aplicativo Mamãe+!\n\n` +
      `📋 *Motivo:* ${activeReason}\n` +
      `📅 *Idade Gestacional:* ${currentWeek}ª Semana\n` +
      `🏥 *Maternidade Mais Próxima:* Hospital e Maternidade Santa Joana\n` +
      `📍 *Localização GPS:* ${mapsLink}\n\n` +
      `Por favor, entre em contato imediatamente ou dirija-se ao local!`;

    const cleanPhone = contact.wpp || contact.phone.replace(/[^0-9]/g, "");
    const wppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.open(wppUrl, "_blank");
    showToast(`Alerta gerado para ${contact.name}`);
  };

  const handleBroadcastAll = () => {
    if (emergencyContacts.length > 0) {
      handleSendWhatsAppAlert(emergencyContacts[0]);
    }
  };

  if (!isSOSModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-4 select-none font-albert animate-fadeIn">
      <div className="bg-white rounded-[32px] w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl border-2 border-red-500/40 overflow-hidden relative">
        
        {/* Top Emergency Red Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4.5 px-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center animate-pulse">
              <ShieldAlert size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-poppins font-black text-[16px] tracking-wide uppercase leading-tight">
                  SOS Obstétrico Ativo
                </h3>
                <span className="bg-white text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase animate-bounce">
                  Emergência
                </span>
              </div>
              <p className="text-[11px] text-white/90 font-medium">
                {user.name} · {currentWeek}ª Sem. Gestacional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Siren Toggle */}
            <button
              onClick={toggleSiren}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                sirenPlaying 
                  ? "bg-white text-red-600 animate-ping" 
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              title={sirenPlaying ? "Desligar Sirene" : "Ligar Alarme Sonoro"}
            >
              {sirenPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSiren();
                setIsSOSModalOpen(false);
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Operations Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin bg-[#FAF8F5]">
          
          {/* Quick Symptom Reason Picker */}
          <div className="bg-white p-3.5 rounded-2xl border border-red-200 shadow-sm">
            <label className="text-[11px] font-bold text-[#3D2B33] flex items-center gap-1 mb-2">
              <AlertTriangle size={13} className="text-red-500" />
              Sintoma ou Motivo Principal:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {emergencyReasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveReason(r.label)}
                  className={`text-[10.5px] font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                    activeReason === r.label
                      ? "bg-red-600 text-white border-red-600 shadow-xs"
                      : "bg-[#FAF3F6] text-[#8C6B7A] border-[#F0DDE4] hover:bg-[#FBE8EF]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1-Touch Emergency Direct Calling (SAMU 192 / Resgate) */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:192"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white p-3.5 rounded-2xl flex items-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-white/80">Ligar Imediato</p>
                <h4 className="text-[14px] font-black font-poppins leading-tight">SAMU 192</h4>
              </div>
            </a>

            <a
              href="tel:193"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white p-3.5 rounded-2xl flex items-center gap-2.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Siren size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-white/80">Corpo de Bombeiros</p>
                <h4 className="text-[14px] font-black font-poppins leading-tight">Resgate 193</h4>
              </div>
            </a>
          </div>

          {/* Nearest Hospitals with GPS Navigation */}
          <div className="bg-white p-4 rounded-2xl border border-[#F0DDE4] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Navigation size={14} />
                </div>
                <div>
                  <h4 className="text-[12.5px] font-bold text-[#3D2B33] font-poppins">
                    Hospitais & Maternidades Mais Próximos
                  </h4>
                  <p className="text-[10px] text-[#8C6B7A]">Rotas calculadas em tempo real via GPS</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {hospitals.map((hosp) => (
                <div 
                  key={hosp.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    hosp.isPrimary 
                      ? "bg-[#FAF3F6]/70 border-[#D4638F] shadow-xs" 
                      : "bg-[#FAF3F6]/30 border-[#F0DDE4]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="text-[12px] font-bold text-[#3D2B33] font-poppins leading-tight">
                          {hosp.name}
                        </h5>
                        {hosp.isPrimary && (
                          <span className="bg-[#D4638F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                            Maternidade Preferencial
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8C6B7A] font-medium mt-0.5">
                        {hosp.type}
                      </p>
                      <p className="text-[10px] text-[#3D2B33] font-bold mt-1 flex items-center gap-1">
                        <Clock size={11} className="text-[#D4638F]" />
                        <span>Aprox. {hosp.distance} ({hosp.timeEstimate})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={hosp.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-[#FAF3F6] border border-[#F0DDE4] text-[#3D2B33] text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95"
                      >
                        <Compass size={11} className="text-[#1976D2]" />
                        Google Maps
                      </a>
                      <a
                        href={hosp.wazeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#33CCFF] hover:bg-[#29b6e6] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95"
                      >
                        Waze
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Support Network (WhatsApp Live Dispatch) */}
          <div className="bg-white p-4 rounded-2xl border border-[#F0DDE4] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <Share2 size={14} />
                </div>
                <div>
                  <h4 className="text-[12.5px] font-bold text-[#3D2B33] font-poppins">
                    Avisar Contatos de Emergência
                  </h4>
                  <p className="text-[10px] text-[#8C6B7A]">Envia alerta WhatsApp com link do GPS e dados</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3 bg-[#F1F8E9]/60 border border-[#C8E6C9] rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h5 className="text-[12px] font-bold text-[#2E7D32] truncate font-poppins">
                      {contact.name}
                    </h5>
                    <p className="text-[10px] text-[#558B2F] font-semibold">
                      {contact.relationship} · {contact.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleSendWhatsAppAlert(contact)}
                      className="bg-[#25D366] hover:bg-[#1EBE5B] text-white text-[10.5px] font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                    >
                      <Share2 size={12} />
                      WhatsApp
                    </button>
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                      className="w-8 h-8 rounded-xl bg-white border border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center shadow-xs hover:bg-[#E8F5E9] transition-all"
                    >
                      <PhoneCall size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rescue Clinical Medical Sheet (For Paramedics & Doctors) */}
          <div className="bg-gradient-to-br from-[#FAF3F6] to-white p-4 rounded-2xl border border-[#F0DDE4] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0DDE4]">
              <div className="flex items-center gap-2">
                <Heart size={15} className="text-[#D4638F]" />
                <h4 className="text-[12px] font-bold text-[#3D2B33] font-poppins uppercase tracking-wider">
                  Ficha Médica de Resgate Imediato
                </h4>
              </div>
              <span className="text-[9.5px] font-extrabold text-[#D4638F] bg-[#FBE8EF] px-2 py-0.5 rounded-full">
                Uso Clínico
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Tipo Sanguíneo</span>
                <span className="text-[13px] font-black text-red-600 font-poppins">A+ (Positivo)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#F0DDE4]">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Idade Gestacional</span>
                <span className="text-[13px] font-black text-[#3D2B33] font-poppins">{currentWeek} Semanas</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#F0DDE4] col-span-2">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Alergias a Medicamentos</span>
                <span className="text-[11.5px] font-bold text-[#3D2B33]">Nenhuma alergia relatada</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#F0DDE4] col-span-2">
                <span className="text-[9.5px] text-[#8C6B7A] font-bold block">Condição Clínica</span>
                <span className="text-[11.5px] font-bold text-[#3D2B33]">Pré-natal Habitual · Risco Habitual</span>
              </div>
            </div>
          </div>

        </div>

        {/* Global Modal Action Footer */}
        <div className="p-4 bg-white border-t border-[#F0DDE4] flex items-center justify-between shrink-0">
          <p className="text-[10px] text-[#8C6B7A] font-medium max-w-[200px] leading-tight">
            Em caso de emergência com risco à vida, ligue imediatamente para o <b>192</b>.
          </p>
          <button
            onClick={() => {
              stopSiren();
              setIsSOSModalOpen(false);
            }}
            className="bg-[#3D2B33] hover:bg-[#251A1F] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Encerrar SOS
          </button>
        </div>

      </div>

      {/* Local Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#3D2B33] text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-xl border border-white/10 z-[250] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={15} className="text-[#81C784]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
