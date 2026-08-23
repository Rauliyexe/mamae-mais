import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MockAPI } from "../data/mockApi";
import ninaImg from "../assets/nina.png";
import { 
  Volume2, VolumeX, X, Send, ChevronRight, Heart, Sparkles, Droplet, User
} from "lucide-react";

export default function NinaMascot() {
  const { 
    user, currentWeek,
    chatHistory, addChatMessage
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'tips' | 'actions'
  const [bubbleMessage, setBubbleMessage] = useState("");
  const [showBubble, setShowBubble] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [heartsAnimation, setHeartsAnimation] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Time-aware greetings and contextual phrases
  const getContextualGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name?.split(" ")[0] || "Mamãe";
    
    if (hour >= 5 && hour < 12) {
      return `Bom dia, ${firstName}! Dormiu bem? Lembra de tomar um café da manhã bem nutritivo!`;
    } else if (hour >= 12 && hour < 18) {
      return `Boa tarde, ${firstName}! Como está a barriguinha na ${currentWeek}ª semana hoje?`;
    } else {
      return `Boa noite, ${firstName}! Hora de colocar as pernas para cima e relaxar.`;
    }
  };

  // Load natural Portuguese voice on mount
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Look for natural online Brazilian voices first (great in Edge/Chrome/iOS)
      const bestVoice = voices.find(v => 
        v.lang.includes("pt-BR") && 
        (v.name.toLowerCase().includes("online") || 
         v.name.toLowerCase().includes("natural") || 
         v.name.toLowerCase().includes("francisca") || 
         v.name.toLowerCase().includes("google") ||
         v.name.toLowerCase().includes("luciana") || 
         v.name.toLowerCase().includes("maria"))
      ) || voices.find(v => v.lang.includes("pt-BR"));
      
      setSelectedVoice(bestVoice);
    };

    loadBestVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadBestVoice;
    }
  }, []);

  // Initial bubble greeting
  useEffect(() => {
    const greeting = getContextualGreeting();
    setBubbleMessage(greeting);
    setShowBubble(false);
  }, [currentWeek]);

  // Voice Speech (TTS)
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    const isNatural = selectedVoice?.name?.toLowerCase().includes("natural") || 
                      selectedVoice?.name?.toLowerCase().includes("online");

    // Online natural voices sound perfect at standard rate/pitch. Local voices benefit from a friendly pitch.
    utterance.rate = isNatural ? 1.0 : 1.05;
    utterance.pitch = isNatural ? 1.0 : 1.25;

    utterance.onstart = () => setIsTalking(true);
    utterance.onend = () => setIsTalking(false);
    utterance.onerror = () => setIsTalking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Trigger hearts when clicking mascot
  const handlePetMascot = (e) => {
    e.stopPropagation();
    const newHeart = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 40,
      y: -20 - Math.random() * 30,
    };
    setHeartsAnimation((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHeartsAnimation((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);

    const affectionateReplies = [
      "Eu te amo, mamãe! Você está indo tão bem!",
      "O seu bebê tem muita sorte de ter você!",
      "Aconchego e carinho para você e pro neném!",
      "Tô sempre aqui com você a cada chutinho!",
    ];
    const randomReply = affectionateReplies[Math.floor(Math.random() * affectionateReplies.length)];
    setBubbleMessage(randomReply);
    setShowBubble(true);
    speakText(randomReply);
  };

  // Toggle speech bubble on mascot click
  const handleMascotClick = (e) => {
    e.stopPropagation();
    
    // Heart animation effect
    const newHeart = {
      id: Date.now(),
      x: (Math.random() - 0.5) * 40,
      y: -20 - Math.random() * 30,
    };
    setHeartsAnimation((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHeartsAnimation((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (showBubble) {
      setShowBubble(false);
    } else {
      const affectionateReplies = [
        "Oi, mamãe! Estou aqui com você!",
        "Como está a nossa gravidez hoje?",
        "Lembra de beber um copo de água!",
        "Tô sempre atenta a cada chutinho!",
      ];
      const randomReply = affectionateReplies[Math.floor(Math.random() * affectionateReplies.length)];
      setBubbleMessage(randomReply);
      setShowBubble(true);
      speakText(randomReply);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isThinking) return;

    const query = chatInput;
    setChatInput("");
    setIsThinking(true);

    addChatMessage({
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    try {
      const reply = await MockAPI.askAI(query);
      addChatMessage({
        id: Date.now() + 1,
        sender: "nina",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setBubbleMessage(reply.slice(0, 110) + (reply.length > 110 ? "..." : ""));
      speakText(reply);
    } catch {
      const errReply = "Tive um probleminha, mas já estou aqui de novo com você!";
      addChatMessage({
        id: Date.now() + 1,
        sender: "nina",
        text: errReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setBubbleMessage(errReply);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <aside aria-label="Mascote Nina" className="fixed bottom-20 md:bottom-6 right-4 md:right-8 z-[99999] font-albert select-none pointer-events-auto">
      {/* Floating Hearts Particles */}
      {heartsAnimation.map((h) => (
        <span
          key={h.id}
          className="absolute pointer-events-none animate-ping text-[#C38B9B]"
          style={{
            left: `calc(50% + ${h.x}px)`,
            top: `${h.y}px`,
            transition: "all 1s ease-out",
          }}
        >
          <Heart size={16} fill="currentColor" />
        </span>
      ))}

      {/* Floating Speech Bubble (when dialog is closed) */}
      {!isOpen && showBubble && bubbleMessage && (
        <div className="absolute bottom-[28px] right-[115px] sm:right-[130px] w-[250px] sm:w-[280px] bg-white/95 backdrop-blur-md p-3.5 rounded-3xl shadow-[0_16px_40px_rgba(74,71,67,0.1)] border border-[#F0DDE4] text-xs text-[#3D2B33] animate-bubble-spring leading-relaxed z-[99999] pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBubble(false);
            }}
            className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-[#FAF3F6] text-[#8C6B7A] rounded-full flex items-center justify-center text-[10px] hover:bg-[#F5ECEF] shadow-xs border border-[#F0DDE4] cursor-pointer"
          >
            ✕
          </button>
          
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-[#C38B9B] shrink-0 mt-0.5" />
            <p className="font-medium text-[#4A4743] text-[11.5px]">{bubbleMessage}</p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#F0DDE4] flex justify-between items-center text-[10px]">
            <span className="text-[#C38B9B] font-bold">Nina Mascote</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                setShowBubble(false);
              }}
              className="text-[#4A4743] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Abrir Conversa <ChevronRight size={10} />
            </button>
          </div>

          {/* Bubble Pointer Tail pointing to Nina's body on the right */}
          <div className="absolute right-[-6px] bottom-[28px] w-3 h-3 bg-white border-r border-t border-[#F0DDE4] transform rotate-45" />
        </div>
      )}

      {/* Nina Interactive Dialog Modal / Companion Drawer */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[320px] sm:w-[360px] max-h-[480px] bg-white rounded-3xl shadow-[0_24px_60px_rgba(74,71,67,0.12)] border border-[#F0DDE4] overflow-hidden flex flex-col animate-fadeIn">
          {/* Header with Nina Avatar */}
          <div className="bg-[#FAF3F6] p-4 border-b border-[#F0DDE4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                onClick={handlePetMascot}
                className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[#F0DDE4] flex items-center justify-center p-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                title="Clique para fazer carinho!"
              >
                <img src={ninaImg} alt="Nina" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#4A4743] font-poppins">Nina Mascote</h3>
                  <span className="text-[9px] font-extrabold bg-[#C38B9B] text-white px-1.5 py-0.2 rounded-full uppercase">
                    Ao Vivo
                  </span>
                </div>
                <p className="text-[10.5px] text-[#8C6B7A]">Sua companheira da gestação</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  voiceEnabled ? "bg-[#C38B9B] text-white" : "bg-white text-[#8C6B7A] border border-[#F0DDE4]"
                }`}
                title={voiceEnabled ? "Voz da Nina ativada" : "Ativar voz falada da Nina"}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white text-[#8C6B7A] hover:bg-[#FAF3F6] flex items-center justify-center transition-colors border border-[#F0DDE4] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Actions Tabs */}
          <div className="flex border-b border-[#F0DDE4] bg-[#FAF3F6]/50 p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "chat" ? "bg-white text-[#C38B9B] shadow-xs" : "text-[#8C6B7A] hover:text-[#3D2B33]"
              }`}
            >
              Conversar
            </button>
            <button
              onClick={() => setActiveTab("tips")}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "tips" ? "bg-white text-[#C38B9B] shadow-xs" : "text-[#8C6B7A] hover:text-[#3D2B33]"
              }`}
            >
              Dicas & Carinho
            </button>
          </div>

          {/* Content Area */}
          <div className="p-3.5 flex-1 overflow-y-auto max-h-[280px] space-y-2.5 scrollbar-thin bg-[#FAF3F6]/30">
            {activeTab === "chat" ? (
              <>
                <div className="bg-white p-3 rounded-2xl border border-[#F0DDE4] text-xs text-[#523A46] leading-relaxed shadow-2xs">
                  <p className="font-bold text-[#4A4743] mb-1 flex items-center gap-1">
                    Oi, {user?.name?.split(" ")[0]}!
                  </p>
                  Estou acompanhando sua <b>{currentWeek}ª semana</b>. Pode me perguntar sobre sintomas, alimentação ou o que está sentindo!
                </div>

                {chatHistory.slice(-5).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#C38B9B] text-white rounded-br-none"
                          : "bg-white text-[#4A4743] border border-[#F0DDE4] rounded-bl-none shadow-2xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[8px] text-[#8C6B7A] px-1 mt-0.5 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.time || "agora"}
                    </span>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-1 bg-white p-2.5 rounded-2xl border border-[#F0DDE4] w-16 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C38B9B] animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handlePetMascot}
                  className="w-full bg-white hover:bg-[#FAF3F6] p-3 rounded-2xl border border-[#F0DDE4] flex items-center gap-3 text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <Heart size={18} className="text-[#C38B9B] fill-[#C38B9B]/20 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-[#4A4743]">Fazer Carinho na Nina</h5>
                    <p className="text-[10.5px] text-[#8C6B7A]">Ganhe um abraço quentinho e palavras de amor</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const advice = `Na semana ${currentWeek}, seu bebê adora quando você conversa ou canta baixinho para ele. Ele já ouve seu coração!`;
                    setBubbleMessage(advice);
                    speakText(advice);
                  }}
                  className="w-full bg-white hover:bg-[#FAF3F6] p-3 rounded-2xl border border-[#F0DDE4] flex items-center gap-3 text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <User size={18} className="text-[#C38B9B] shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-[#4A4743]">Curiosidade da Semana {currentWeek}</h5>
                    <p className="text-[10.5px] text-[#8C6B7A]">Descubra como o bebê está se desenvolvendo agora</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const waterMsg = "Lembrete de hidratação! Uma mãe bem hidratada garante o melhor fluxo de nutrientes para o bebê. Vamos beber um copo?";
                    setBubbleMessage(waterMsg);
                    speakText(waterMsg);
                  }}
                  className="w-full bg-white hover:bg-[#FAF3F6] p-3 rounded-2xl border border-[#F0DDE4] flex items-center gap-3 text-left transition-colors cursor-pointer shadow-2xs"
                >
                  <Droplet size={18} className="text-[#C38B9B] shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-[#4A4743]">Lembrete de Água</h5>
                    <p className="text-[10.5px] text-[#8C6B7A]">Dica de hidratação e bem-estar</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Chat Input */}
          {activeTab === "chat" && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#F0DDE4] flex items-center gap-2">
              <input
                type="text"
                placeholder="Fale com a Nina..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-[#FAF3F6]/55 px-3 py-2 rounded-xl text-xs text-[#3D2B33] placeholder-[#8C6B7A] border border-[#F0DDE4] focus:outline-none focus:border-[#C38B9B]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isThinking}
                className="w-8 h-8 rounded-xl bg-[#C38B9B] hover:bg-[#A87483] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-sm shrink-0"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Mascot Animated Character (Floating Free Without Circular Frame) */}
      <div className="relative flex flex-col items-center">
        {/* Floating Nina Character Button */}
        <button
          onClick={handleMascotClick}
          className="relative group focus:outline-none cursor-pointer select-none transition-transform active:scale-95"
          aria-label="Abrir mascote Nina"
        >
          {/* Heart Sparkle Badge */}
          <span className="absolute -top-2 right-2 w-6 h-6 rounded-full bg-[#C38B9B] text-white flex items-center justify-center shadow-md border-2 border-white z-20 animate-bounce">
            <Sparkles size={11} className="text-white" />
          </span>

          {/* Freely Floating Mascot Image */}
          <div 
            className={`relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center transition-all duration-300 filter drop-shadow-[0_12px_24px_rgba(74,71,67,0.1)] group-hover:scale-110 ${
              isTalking ? "animate-bounce" : "animate-mascot-float"
            }`}
          >
            <img 
              src={ninaImg} 
              alt="Mascote Nina" 
              className="w-full h-full object-contain pointer-events-auto select-none"
            />
          </div>
        </button>

        {/* Soft Dynamic Floor Shadow Underneath Mascot Feet */}
        <div className="w-14 sm:w-18 h-2.5 bg-[#3D2B33]/20 rounded-full blur-[3px] -mt-1 pointer-events-none animate-mascot-shadow" />
      </div>
    </aside>
  );
}
